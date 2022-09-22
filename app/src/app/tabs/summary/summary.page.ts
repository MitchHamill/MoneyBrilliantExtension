import { Component } from '@angular/core';
import * as moment from 'moment';
import { Transaction } from '../../services/money-brilliant/types';
import {
  checkAllFilters,
  isBetweenDates,
  isIncomePayment,
  isSpending,
} from '../../utils/categorise-transactions';
import {
  getGrowthGraphs,
  totalTransactions,
} from '../../utils/transaction-calculations';
import { MoneyBrilliantService } from '../../services/money-brilliant/money-brilliant.service';
import {
  SummaryOverview,
  SummaryPeriod,
  SummaryPeriodType,
  UserIncome,
} from '../../types';
import { StorageService } from 'src/app/services/storage/storage.service';
import { getDailyAccrualRate } from 'src/app/utils/utils';
import { getBusinessDatesCount, getDateLabels } from 'src/app/utils/dates';
import { TabsService } from 'src/app/services/tabs/tabs.service';
import { ChartDataset, ChartOptions } from 'chart.js';
import { TRANSACTION_CHART_OPTIONS } from 'src/app/constants/chart';

interface Summary {
  spent: number;
  accrued: number;
}

interface ChartDetails {
  datasets: ChartDataset[];
  labels: string[];
  options: ChartOptions;
}

@Component({
  selector: 'app-summary',
  templateUrl: 'summary.page.html',
  styleUrls: ['summary.page.scss'],
})
export class SummaryPage {
  private _transactions: Transaction[];

  public overview: SummaryOverview = {} as SummaryOverview;
  public userIncome: UserIncome;
  public summaryPeriodType = SummaryPeriodType.month;
  public summary: Summary = { spent: 0, accrued: 0 };
  public chart: ChartDetails;

  public chartLoading = true;

  constructor(
    private _moneyBrilliant: MoneyBrilliantService,
    private tabsService: TabsService,
    private storage: StorageService
  ) {
    this._moneyBrilliant.authenticationStatus.subscribe((authed) => {
      if (authed) {
        this._init();
      }
    });
    this.onTabChange();
    this.tabsService.$onSummary.subscribe(() => this.onTabChange());
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

    await this._moneyBrilliant.getTransactionsByDate(
      this.summaryPeriod.start.toDate()
    );
    this._moneyBrilliant.transactions.subscribe((transactions) => {
      this._transactions = transactions;
      this._loadAllSummaries();
    });
  }

  // For some reason the storage service is lost when changing back
  private async onTabChange() {
    this.storage.getIncome().then((income) => {
      this.userIncome = income;
      this._summariseIncome();
    });
  }

  private _loadAllSummaries() {
    this._summariseTransactions();
    this._summariseIncome();
    this._generateChart();
  }

  private _summariseTransactions() {
    const totalSpent = totalTransactions(
      this._transactions,
      checkAllFilters(isBetweenDates(this.summaryPeriod), isSpending)
    );

    this.summary.spent = totalSpent;
  }

  private _generateChart() {
    const labels = getDateLabels(this.summaryPeriod);

    this.chart = {
      datasets: getGrowthGraphs(
        this._transactions,
        this.overview,
        this.summaryPeriod,
        this.userIncome
      ),
      labels,
      options: TRANSACTION_CHART_OPTIONS,
    };
    this.chartLoading = false;
  }

  private _summariseIncome() {
    const accrualRate = this.userIncome
      ? getDailyAccrualRate(this.userIncome)
      : 0;
    const earningDays = getBusinessDatesCount(this.summaryPeriod);
    this.summary.accrued = accrualRate * earningDays;
  }

  private get summaryPeriod(): SummaryPeriod {
    const startTypes: SummaryPeriodType[] = [
      SummaryPeriodType.month,
      SummaryPeriodType.year,
    ];
    if (startTypes.includes(this.summaryPeriodType)) {
      let unit: moment.unitOfTime.StartOf;
      switch (this.summaryPeriodType) {
        case SummaryPeriodType.month:
          unit = 'M';
          break;
        case SummaryPeriodType.year:
          unit = 'y';
          break;
        default:
          console.error('Tried to get summary period incorrectly');
          break;
      }
      return {
        start: moment().startOf(unit),
        end: moment(),
      };
    } else {
      let amount: moment.DurationInputArg1;
      let unit: moment.unitOfTime.DurationConstructor;
      switch (this.summaryPeriodType) {
        case SummaryPeriodType.sevenDays:
          amount = 7;
          unit = 'd';
          break;
        default:
          console.error('Tried to get summary period incorrectly');
          break;
      }

      return {
        start: moment().startOf('d').subtract(amount, unit),
        end: moment(),
      };
    }
  }

  public async refreshData(event) {
    await this._moneyBrilliant.reload();
    await this._moneyBrilliant.getTransactionsByDate(
      this.summaryPeriod.start.toDate()
    );
    event.target.complete();
  }

  public periodChanged() {
    // this.summaryPeriodType updated automatically via ngModel
    this.chartLoading = true;
    // Use setTimeout to allow the Ui to transaction the period icon before computing the new chart
    setTimeout(() => {
      this._moneyBrilliant
        .getTransactionsByDate(this.summaryPeriod.start.toDate())
        .then(() => this._loadAllSummaries());
    }, 0);
  }
}
