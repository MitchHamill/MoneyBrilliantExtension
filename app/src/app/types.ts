export enum TabType {
  analytics = 'analytics',
  summary = 'summary',
  settings = 'settings',
}

export enum SummaryPeriodType {
  sevenDays = 'sevenDays',
  month = 'month',
  year = 'year',
}

export interface SummaryPeriod {
  start: moment.Moment;
  end: moment.Moment;
}

export interface SummaryOverview {
  bank: number;
  invested: number;
  netWorth: number;
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

export interface UserCredentials {
  username: string;
  password: string;
}
