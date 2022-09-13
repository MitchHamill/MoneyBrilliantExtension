export enum SummaryPeriodType {
  week = 'week',
  month = 'month',
  year = 'year',
}

export interface SummaryPeriod {
  start: moment.Moment;
  end: moment.Moment;
}
