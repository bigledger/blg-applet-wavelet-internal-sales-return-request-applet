export class SearchQueryModel {
  searchQuery?: any;
  isEmpty: boolean;
  table?: string;
}

export interface SelectContraInputModel {
  keyword: string;
  docNo: string;
  serverDocType: string;
  created_date_from: string;
  created_date_to: string;
  txn_date_from: string;
  txn_date_to: string;
}