import * as moment from 'moment';
import { Transaction } from '../services/money-brilliant/types';
import { SummaryPeriod } from '../types';

type DateOptions = Date | moment.Moment | string;

function isMoment(d: DateOptions): d is moment.Moment {
  return !!(d as any).unix;
}

function getDate(d: DateOptions): Date {
  let day: Date;
  if (isMoment(d)) {
    day = d.toDate();
  } else {
    day = new Date(d);
  }
  return day;
}

function getMoment(d: DateOptions): moment.Moment {
  let m: moment.Moment;
  if (isMoment(d)) {
    m = d;
  } else {
    m = moment(d);
  }
  return m;
}

export function isWeekday(d: DateOptions) {
  const date = getDate(d);

  const dayOfWeek = date.getDay();
  return dayOfWeek !== 0 && dayOfWeek !== 6;
}

export function getBusinessDatesCount({ start, end }: SummaryPeriod) {
  const [startDate, endDate] = [start, end].map((d) => d.clone());
  let count = 0;
  let curDate = startDate;
  while (curDate.unix() <= endDate.unix()) {
    if (isWeekday(curDate)) count++;
    curDate = curDate.add(1, 'd');
  }
  return count;
}

export function earliestTransactionDate(transactions: Transaction[]) {
  return transactions
    .map((t) => t.transaction_date)
    .sort((a, b) => a.localeCompare(b))[0];
}

export function getDateLabels({ start: startIn, end: endIn }: SummaryPeriod) {
  const [start, end] = [startIn, endIn].map((m) => m.clone().startOf('d'));

  let latestDate = start;
  let labels: string[] = [];
  while (latestDate.unix() <= end.unix()) {
    labels.push(latestDate.format('D/M/YY'));
    latestDate = latestDate.add(1, 'd');
  }
  return labels;
}
