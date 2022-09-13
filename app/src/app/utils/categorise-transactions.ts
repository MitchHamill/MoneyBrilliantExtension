import * as moment from 'moment';
import {
  Transaction,
  TransactionAccount,
} from '../services/money-brilliant/types';
import { SummaryPeriod } from '../types';

const PAY_CAT = 'Income - Pay & Salary';
const REIMB_CAT = 'Refunds and rebates';

type TransactionFilter = (t: Transaction) => boolean;

export function checkAllFilters(
  ...filters: TransactionFilter[]
): TransactionFilter {
  return (t) => filters.every((f) => f(t));
}

export function checkAnyFilter(
  ...filters: TransactionFilter[]
): TransactionFilter {
  return (t) => filters.some((f) => f(t));
}

export function not(f: TransactionFilter): TransactionFilter {
  return (t) => !f(t);
}

export function isIncomePayment(trans: Transaction) {
  return (
    trans.account_name === TransactionAccount.personal &&
    trans.category.name === PAY_CAT
  );
}

export function isReimbursement(trans: Transaction) {
  return trans.category.name === REIMB_CAT;
}

export function isBetweenDates({
  start,
  end,
}: SummaryPeriod): TransactionFilter {
  return (trans: Transaction) => {
    const transactionMoment = moment(trans.transaction_date);
    return transactionMoment.isAfter(start) && transactionMoment.isBefore(end);
  };
}

export function isDebit(t: Transaction) {
  return t.base_type === 'debit';
}

export function isTransfer(t: Transaction) {
  return t.category.name === 'Transfers';
}

export function isPersonal(t: Transaction) {
  return t.account_name === TransactionAccount.personal;
}

export function isSpending(t: Transaction) {
  // return checkAllFilters(checkAnyFilter(isDebit, isReimbursement), not(isTransfer), isPersonal);
  return (isDebit(t) || isReimbursement(t)) && !isTransfer(t) && isPersonal(t);
}
