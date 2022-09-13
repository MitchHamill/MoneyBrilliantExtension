import { Transaction } from '../services/money-brilliant/types';

export function totalTransactions(trans: Transaction[]) {
  return trans.map((t) => t.net_amount).reduce((acc, v) => acc + v);
}
