import * as moment from 'moment';
import {
  Transaction,
  TransactionAccount,
} from '../services/money-brilliant/types';
import { SummaryPeriod } from '../types';

const PAY_CAT = 'Income - Pay & Salary';
const REIMB_CAT = 'Refunds and rebates';

export type TransactionFilter = (t: Transaction) => boolean;

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

export function isIncomePayment(trans: Transaction): boolean;
export function isIncomePayment(): TransactionFilter;
export function isIncomePayment(
  trans?: Transaction
): TransactionFilter | boolean {
  const filter = (t) =>
    t.account_name === TransactionAccount.personal &&
    t.category.name === PAY_CAT;
  return trans ? filter(trans) : filter;
}

export function isReimbursement(trans: Transaction): boolean;
export function isReimbursement(): TransactionFilter;
export function isReimbursement(
  trans?: Transaction
): TransactionFilter | boolean {
  const filter = (t) => t.category.name === REIMB_CAT;
  return trans ? filter(trans) : filter;
}

export function isOnDate(date: moment.MomentInput): TransactionFilter {
  return (t) =>
    moment(t.transaction_date).startOf('d').toISOString() ===
    moment(date).startOf('d').toISOString();
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

export function isDebit(trans: Transaction): boolean;
export function isDebit(): TransactionFilter;
export function isDebit(trans?: Transaction): TransactionFilter | boolean {
  const filter = (t) => t.base_type === 'debit';
  return trans ? filter(trans) : filter;
}

export function isTransfer(trans: Transaction): boolean;
export function isTransfer(): TransactionFilter;
export function isTransfer(trans?: Transaction): TransactionFilter | boolean {
  const filter = (t) => t.category.name === 'Transfers';
  return trans ? filter(trans) : filter;
}

export function isPersonal(trans: Transaction): boolean;
export function isPersonal(): TransactionFilter;
export function isPersonal(trans?: Transaction): TransactionFilter | boolean {
  const filter = (t) => t.account_name === TransactionAccount.personal;
  return trans ? filter(trans) : filter;
}

export function isSpending(trans: Transaction): boolean;
export function isSpending(): TransactionFilter;
export function isSpending(trans?: Transaction): TransactionFilter | boolean {
  return checkAllFilters(
    checkAnyFilter(isDebit, isReimbursement),
    not(isTransfer),
    isPersonal
  );
}
