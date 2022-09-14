export enum TabType {
  analytics = 'analytics',
  summary = 'summary',
  settings = 'settings',
}

export enum SummaryPeriodType {
  week = 'week',
  month = 'month',
  year = 'year',
}

export interface SummaryPeriod {
  start: moment.Moment;
  end: moment.Moment;
}

export enum PaymentFrequency {
  weekly = 'Weekly',
  fortnightly = 'Fortnightly',
  twiceMonthly = 'Twice Monthly',
  monthly = 'Monthly',
}

export interface UserIncome {
  frequency: PaymentFrequency;
  takeHome: number;
  paidDateRef?: string;
}
