import { PaymentFrequency, UserIncome } from '../types';

export function getDailyAccrualRate({ frequency, takeHome }: UserIncome) {
  let periodsInYear: number;
  switch (frequency) {
    case PaymentFrequency.weekly:
      periodsInYear = 52;
      break;
    case PaymentFrequency.fortnightly:
      periodsInYear = 26;
      break;
    case PaymentFrequency.twiceMonthly:
      periodsInYear = 24;
      break;
    case PaymentFrequency.monthly:
      periodsInYear = 12;
      break;
  }

  const annualTakeHome = periodsInYear * takeHome;
  return annualTakeHome / 260;
}
