import { Transaction } from '../services/money-brilliant/types';
import { SummaryPeriod } from '../types';

export function getBusinessDatesCount({ start, end }: SummaryPeriod) {
  const [startDate, endDate] = [start, end].map((d) => d.toDate());
  let count = 0;
  const curDate = new Date(startDate.getTime());
  while (curDate <= endDate) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
    curDate.setDate(curDate.getDate() + 1);
  }
  return count;
}

export function earliestTransactionDate(transactions: Transaction[]) {
  return transactions
    .map((t) => t.transaction_date)
    .sort((a, b) => a.localeCompare(b))[0];
}
