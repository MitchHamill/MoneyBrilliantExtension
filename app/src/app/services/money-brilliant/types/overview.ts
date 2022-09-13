export interface Overview {
  balances: {
    cash_balance: number;
    banks_balance: number;
    net_cash_balance: number;
    credit_cards_balance: number;
    investments_balance: number;
    loans_balance: number;
    properties_balance: number;
    vehicles_balance: number;
    other_assets_balance: number;
    other_liabilities_balance: number;
    net_worth: number;
    total_assets: number;
    total_liabilities: number;
  };
  user: {
    referral_url: string;
    base_currency: {
      iso_code: string;
      name: string;
      symbol: string;
    };
  };
  priorities: {
    name: string;
    priority: string;
    enabled: boolean;
    active: boolean;
    setup_complete: boolean;
  }[];
  has_budget: boolean;
}
