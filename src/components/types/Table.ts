/* eslint-disable @typescript-eslint/no-explicit-any */
// this rule is disabled because we are copying Quasar table column type.

export type TableColumn = {
  name: string;
  label: string;
  field: string | ((row: any) => any);
  required?: boolean;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  sort?: (a: any, b: any, rowA: any, rowB: any) => number;
  rawSort?: (a: any, b: any, rowA: any, rowB: any) => number;
  sortOrder?: 'ad' | 'da';
  format?: (val: any, row: any) => any;
  style?: string | ((row: any) => string);
  classes?: string | ((row: any) => string);
  headerStyle?: string;
  headerClasses?: string;
};

export type TableRow = {
  [key: string]: number | string | null | boolean;
};

export enum ResultsTableColumns {
  rank = 'rank',
  consistency = 'consistency',
  routeCount = 'routeCount',
  name = 'name',
  team = 'team',
  organization = 'organization',
  category = 'category',
  city = 'city',
}

export enum FeeApprovalTableColumns {
  amount = 'amount',
  name = 'name',
  email = 'email',
  nickname = 'nickname',
  address = 'address',
  dateCreated = 'dateCreated',
}
