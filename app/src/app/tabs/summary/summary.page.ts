import { Component } from '@angular/core';
import * as moment from 'moment';
import { Transaction } from '../../services/money-brilliant/types';
import {
  checkAllFilters,
  isBetweenDates,
  isSpending,
} from '../../utils/categorise-transactions';
import { totalTransactions } from '../../utils/transaction-calculations';
import { MoneyBrilliantService } from '../../services/money-brilliant/money-brilliant.service';
import { SummaryPeriod, SummaryPeriodType } from '../../types';

interface Overview {
  bank: number;
  invested: number;
  netWorth: number;
}

interface Summary {
  spent: number;
  accrued: number;
  plannedSave: number;
}

@Component({
  selector: 'app-summary',
  templateUrl: 'summary.page.html',
  styleUrls: ['summary.page.scss'],
})
export class SummaryPage {
  private _transactions: Transaction[];

  public overview: Overview = {} as Overview;
  public summaryPeriod = SummaryPeriodType.week;
  public summary: Summary = { spent: 0, accrued: 0, plannedSave: 0 };

  constructor(private _moneyBrilliant: MoneyBrilliantService) {
    this._moneyBrilliant.authenticationStatus.subscribe((authed) => {
      if (authed) {
        this._init();
      }
    });
  }

  private async _init() {
    this._moneyBrilliant.overview.subscribe((o) => {
      const { balances } = o;
      this.overview = {
        bank: balances.banks_balance,
        invested: balances.investments_balance,
        netWorth: balances.net_worth,
      };
    });

    const period = this._getSummaryPeriod();
    await this._moneyBrilliant.getTransactionsByDate(period.start.toDate());
    this._moneyBrilliant.transactions.subscribe((transactions) => {
      this._transactions = transactions;
      this._summariseTransactions();
    });
  }

  private async _summariseTransactions() {
    const period = this._getSummaryPeriod();
    const dateFilter = isBetweenDates(period);

    const spendingTransactions = this._transactions.filter(
      checkAllFilters(dateFilter, isSpending)
    );
    const totalSpent = spendingTransactions.length
      ? totalTransactions(spendingTransactions)
      : 0;

    this.summary = {
      spent: totalSpent,
      accrued: 0, // TODO: Income as input - Can it be configured in MB?
      plannedSave: 0, // TODO: Saving plan - Can it be configured in MB?
    };
  }

  private _getSummaryPeriod(): SummaryPeriod {
    let unit: moment.unitOfTime.StartOf;
    switch (this.summaryPeriod) {
      case SummaryPeriodType.week:
        unit = 'W';
        break;
      case SummaryPeriodType.month:
        unit = 'M';
        break;
      case SummaryPeriodType.year:
        unit = 'y';
        break;
      default:
        const _check: never = this.summaryPeriod;
    }
    return {
      start: moment().startOf(unit),
      end: moment(),
    };
  }

  public async refreshData(event) {
    const period = this._getSummaryPeriod();
    await this._moneyBrilliant.reload();
    await this._moneyBrilliant.getTransactionsByDate(period.start.toDate());
    event.target.complete();
  }

  public periodChanged($event) {
    // this.summaryPeriod updated automatically via ngModel
    const period = this._getSummaryPeriod();
    this._moneyBrilliant
      .getTransactionsByDate(period.start.toDate())
      .then(() => this._summariseTransactions());
  }
}
