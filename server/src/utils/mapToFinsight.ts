const newId = (): string => {
  return '_' + Math.random().toString(36).substr(2, 9);
};
export function mapTransToFinsight(trans: any): any {
  return {
    id: newId(),
    type: trans.base_type === 'debit' ? 'exp' : 'inc',
    date: trans.transaction_date,
    amount: trans.amount,
    reason: trans.category.name,
    clarification: trans.description,
  };
}
