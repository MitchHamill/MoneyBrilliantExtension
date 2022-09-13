export enum TransactionAccount {
  personal = 'Mitchell Hamill',
  joint = 'Spending',
  home = 'Home',
  holiday = 'Get Away',
  reserve = 'Unexpecteds',
  emergency = 'Runway',
}

export interface TransactionCategory {
  id: number;
  name: string;
  description: string;
  deals_enabled: false;
  group: {
    id: number;
    name: string;
    image: string;
    description: string;
    type: string;
  };
}

export interface AccountDetails {
  id: number;
  account_type: string;
  display_name: TransactionAccount;
  site_account_id: number;
  site_name: string;
  icon: string;
  fav_icon: string;
  url: string;
  manual_account: false;
  account_number: string;
  _self: string;
  status: string;
  closed: false;
}

export interface Transaction {
  id: number;
  transaction_date: string;
  posted_date: string;
  amount: number;
  net_amount: number;
  amount_currency: string;
  amount_aud: number;
  status: string;
  base_type: string;
  description: string;
  account_name: TransactionAccount;
  category: TransactionCategory;
  type: 'BankTransaction' | 'InvestmentTransaction';
  manual: false;
  merchant_name: string;
  note: null;
  image_url: null;
  image_file_name: null;
  content_service_name: string;
  content_service_favicon: string;
  content_service_icon: string;
  exclude_from_budget: false;
  merchant_id: 43;
  merchant_logo_id: string;
  _self: string;
  account: AccountDetails;
}

export interface TransactionsMeta {
  total_count: number;
  total_pages: number;
  current_page: number;
  per_page: number;
  first_record: number;
  last_record: number;
  _next: string;
  _base: string;
  params: any;
  order: string;
  credit: number;
  debit: number;
}
