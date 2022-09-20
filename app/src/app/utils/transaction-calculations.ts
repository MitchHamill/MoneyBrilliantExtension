import { ChartDataset } from 'chart.js';
import * as moment from 'moment';
import { Transaction } from '../services/money-brilliant/types';
import { SummaryOverview, SummaryPeriod, UserIncome } from '../types';
import {
  isIncomePayment,
  isOnDate,
  isTransfer,
  not,
  TransactionFilter,
} from './categorise-transactions';
import { isWeekday } from './dates';
import { getDailyAccrualRate } from './utils';

export function totalTransactions(
  trans: Transaction[],
  filter?: TransactionFilter
) {
  const filteredTrans = filter ? trans.filter(filter) : trans;
  if (!filteredTrans.length) return 0;
  return filteredTrans.map((t) => t.net_amount).reduce((acc, v) => acc + v);
}

export function getGrowthGraphs(
  trans: Transaction[],
  { netWorth }: SummaryOverview,
  { start, end }: SummaryPeriod,
  income?: UserIncome
): ChartDataset[] {
  const nonTransferTrans = trans.filter(not(isTransfer));
  const accrualRate = income ? getDailyAccrualRate(income) : 0;

  let netWorths: number[] = [netWorth];
  let netAccruals: number[] = [netWorth];

  let day = end.clone().subtract(1, 'd').startOf('d');
  let totalAccrued = 0;
  let totalPaid = 0;
  while (day.unix() >= start.unix()) {
    const dayTransactions = nonTransferTrans.filter(isOnDate(day));

    let netEarned = totalTransactions(dayTransactions);
    let netAccrued = totalTransactions(dayTransactions, not(isIncomePayment));
    if (isWeekday(day)) netAccrued += accrualRate;

    const previousNetWorth = netWorths[0] - netEarned;
    const previousNetAccruals = netAccruals[0] - netAccrued;
    netWorths.unshift(previousNetWorth);
    netAccruals.unshift(previousNetAccruals);
    day = day.subtract(1, 'd');
  }

  const datasets: ChartDataset[] = [{ data: netWorths, label: 'Actual' }];
  if (income)
    datasets.unshift({
      data: netAccruals,
      label: 'Accrued',
    });

  return datasets;
}
