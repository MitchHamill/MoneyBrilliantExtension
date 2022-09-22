import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { StorageKeys, StorageService } from '../storage/storage.service';
import { MoneyBrilliantApi } from './utils';
import { Overview, Transaction, TransactionsMeta } from './types';
import { earliestTransactionDate } from 'src/app/utils/dates';
import { UserCredentials } from 'src/app/types';

const TRANSACTIONS_PAGE_SIZE = '250';

function filterObs<T>(o: Observable<T>, array = false) {
  return o.pipe(
    filter((v) => (array ? !!(v as unknown as any[]).length : !!v))
  );
}

@Injectable({
  providedIn: 'root',
})
export class MoneyBrilliantService {
  private _token: string | undefined;
  private _api: MoneyBrilliantApi;
  private _transactionsMeta: TransactionsMeta = {
    current_page: 0,
  } as TransactionsMeta;

  private _transactions = new BehaviorSubject<Transaction[]>([]);
  private _overview = new BehaviorSubject<Overview | undefined>(undefined);

  public authenticationStatus = new BehaviorSubject(false);

  constructor(private _storage: StorageService) {
    this._api = new MoneyBrilliantApi(Capacitor.getPlatform() === 'web');
  }

  public async init() {
    let res: { authenticated: boolean } = { authenticated: false };
    const storedToken = await this._storage.getAuthToken();
    if (storedToken) {
      const valid = await this._api.testToken(storedToken);
      if (valid) {
        this._token = storedToken;
        this._api.setAuthHeaders({
          'X-User-Email': 'mitchhamill@gmail.com',
          'X-User-Token': this._token,
        });
        res.authenticated = true;
        this.authenticationStatus.next(true);
      }
    }
    await this._importCache();
    return res;
  }

  public async getNewToken({ username, password }: UserCredentials) {
    try {
      const token = await this._api.token(username, password);
      if (token) {
        this._token = token;
        this._api.setAuthHeaders({
          'X-User-Email': 'mitchhamill@gmail.com',
          'X-User-Token': this._token,
        });
        this._storage.setAuthToken(token);
        this.authenticationStatus.next(true);
      } else {
        throw new Error('Token not found');
      }
    } catch (err) {
      console.error('Error getting token', err);
    }
    return;
  }

  public async reload() {
    await this._storage.cache.remove([
      StorageKeys.overview,
      StorageKeys.transactions,
    ]);
    this._transactionsMeta = { current_page: 0 } as TransactionsMeta;
    this._transactions.next([]);
    await Promise.all([this._moreTransactions(), this._loadOverview()]);
    return;
  }

  public async getTransactionsByDate(date: Date) {
    const dateString = date.toISOString();

    /**
     * Use a copy of the main transactions subject as to
     *  not trigger subscriptions to the transactions every time
     *  moreTransactions is called.
     */
    const trackingTransactions = new BehaviorSubject<Transaction[]>(
      this._transactions.value
    );

    if (!trackingTransactions.value.length) {
      await this._moreTransactions(trackingTransactions);
    }

    const getMinDate = () =>
      earliestTransactionDate(trackingTransactions.value);

    if (getMinDate() <= dateString) {
      this._transactions.next(trackingTransactions.value);
      return;
    }

    while (getMinDate() > dateString) {
      await this._moreTransactions(trackingTransactions);
    }

    this._transactions.next(trackingTransactions.value);
  }

  public async _moreTransactions(transactionsSubject = this._transactions) {
    if (
      this._transactionsMeta.current_page === 0 &&
      !transactionsSubject.value.length
    ) {
      const cachedTransactions: Transaction[] | undefined =
        await this._storage.cache.getTransactions().then((transCache) => {
          if (transCache) {
            const { data, cached } = transCache;
            // Check relevance
            const cachedTime = new Date(cached).getTime();
            const now = new Date().getTime();

            const oneDay = 1000 * 60 * 60 * 24;
            if (now - cachedTime < oneDay) {
              return data;
            }
          }
        });
      if (cachedTransactions) {
        return transactionsSubject.next(cachedTransactions);
      }
    }

    const params = {
      include_investment_type: 'true',
      order: 'date+desc',
      page: String((this._transactionsMeta.current_page += 1)),
      per_page: TRANSACTIONS_PAGE_SIZE,
    };

    return this._api
      .get('/transactions', {
        params,
      })
      .then((res) => {
        this._transactionsMeta = res.data?._metadata;
        const currentTransactions = transactionsSubject.value;
        const newTransactions = (res.data?.transactions || []) as Transaction[];

        const allTransactions = [...currentTransactions, ...newTransactions];
        this._storage.cache.setTransactions(
          allTransactions,
          this._transactionsMeta
        );
        transactionsSubject.next(allTransactions);
        return;
      });
  }

  public get transactions() {
    if (!this._transactions.value.length) {
      this._moreTransactions();
    }
    return this._transactions.asObservable();
  }

  private async _importCache() {
    const isRelevant = (cachedString: string) => {
      const oneDay = 1000 * 60 * 60 * 24;
      const cachedTime = new Date(cachedString).getTime();
      const now = new Date().getTime();

      return now - cachedTime < oneDay;
    };
    await this._storage.cache.getTransactions().then((transCache) => {
      if (transCache) {
        const { data, cached, meta } = transCache;
        if (isRelevant(cached)) {
          if (data) this._transactions.next(data);
          if (meta) this._transactionsMeta = meta;
        }
      }
    });
    await this._storage.cache.getOverview().then((overviewCache) => {
      if (overviewCache && isRelevant(overviewCache?.cached)) {
        this._overview.next(overviewCache.data);
      }
    });
  }

  private async _loadOverview() {
    const loadedOverview = await this._storage.cache
      .getOverview()
      .then((overviewCache) => {
        if (overviewCache?.data) {
          return overviewCache?.data;
        }
        return this._api.get('users/current/overview').then((res) => {
          const overview = res.data?.overview as Overview | undefined;
          if (overview) this._storage.cache.overview = overview;
          return overview;
        });
      });
    this._overview.next(loadedOverview);
  }

  public get overview() {
    if (!this._overview.value) {
      this._loadOverview();
    }
    return filterObs(this._overview.asObservable());
  }
}
