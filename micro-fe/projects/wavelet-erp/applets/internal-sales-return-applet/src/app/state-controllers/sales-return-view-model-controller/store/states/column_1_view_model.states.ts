export interface Column1ViewModelState {
  refreshGenDocListing: boolean;
  searchCriteria: string;
  advanceSearch_Customer_Field: any[];
  advanceSearch_Branch_Field: any[];
  advanceSearch_CreationDateFrom_Field: string;
  advanceSearch_CreationDateTo_Field: string;
  advanceSearch_TransactionDateFrom_Field: string;
  advanceSearch_TransactionDateTo_Field: string;
  genDocListing_SnapshotGuid: string;
  genDocListing_PreviousSnapshotGuids: string[];
  advanceSearch_SalesAgent_Field: [];
  printableFormat: string;
  advanceSearch_OrderBy_Field: any;
  salesReturnListingState: any;
}

export const initialState: Column1ViewModelState = {
  refreshGenDocListing: false,
  searchCriteria: "",
  advanceSearch_Customer_Field: [],
  advanceSearch_Branch_Field: [],
  advanceSearch_CreationDateFrom_Field: "",
  advanceSearch_CreationDateTo_Field: "",
  advanceSearch_TransactionDateFrom_Field: "",
  advanceSearch_TransactionDateTo_Field: "",
  genDocListing_SnapshotGuid: null,
  genDocListing_PreviousSnapshotGuids: [],
  advanceSearch_SalesAgent_Field: [],
  printableFormat: null,
  advanceSearch_OrderBy_Field: null,
  salesReturnListingState: null,
};
