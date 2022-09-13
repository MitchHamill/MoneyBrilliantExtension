import { Storage } from '@ionic/storage';
import {
  Overview,
  Transaction,
  TransactionsMeta,
} from '../money-brilliant/types';
import { StorageKeys } from './storage.service';

interface CachedData<T, Meta> {
  data: T;
  meta: Meta;
  cached: string;
}

export type CachedTransactions = CachedData<Transaction[], TransactionsMeta>;
export type CachedOverview = CachedData<Overview, undefined>;

class Cache {
  constructor(private _storage: Storage) {}

  public remove(toRemove: StorageKeys | StorageKeys[]) {
    const keysToClear = Array.isArray(toRemove) ? toRemove : [toRemove];
    return Promise.resolve(keysToClear.map((key) => this._storage.remove(key)));
  }

  public setTransactions(transactions: Transaction[], meta: TransactionsMeta) {
    const data: CachedTransactions = {
      data: transactions,
      cached: new Date().toISOString(),
      meta,
    };
    this._storage.set(StorageKeys.transactions, data);
  }

  public getTransactions() {
    return this._storage.get(StorageKeys.transactions) as Promise<
      CachedTransactions | undefined
    >;
  }

  set overview(overview: Overview) {
    const data: CachedOverview = {
      data: overview,
      cached: new Date().toISOString(),
      meta: undefined,
    };
    this._storage.set(StorageKeys.overview, data);
  }

  public getOverview() {
    return this._storage.get(StorageKeys.overview) as Promise<
      CachedOverview | undefined
    >;
  }
}

export default Cache;
