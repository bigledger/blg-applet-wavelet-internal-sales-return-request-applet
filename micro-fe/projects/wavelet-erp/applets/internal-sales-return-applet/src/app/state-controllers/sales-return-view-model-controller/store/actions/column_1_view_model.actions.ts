import { createAction, props } from "@ngrx/store";

export const resetAdvanceSearch = createAction('[Search] Reset Advance Search');
export const resetGenDocLsiting = createAction('[Search] Reset Gen Doc Listing');

export const setAdvanceSearch_CustomerField = createAction(
  "[Column 1 View Model] Set Advance Search Customer Field",
  props<{ customers: [] }>()
);

export const setAdvanceSearch_BranchField = createAction(
  "[Column 1 View Model] Set Advance Search Branch Field",
  props<{ branches: any [] }>()
);

export const setAdvanceSearch_CreationDateFromField = createAction(
  "[Column 1 View Model] Set Advance Search Creation Date From Field",
  props<{ date: string }>()
);

export const setAdvanceSearch_CreationDateToField = createAction(
  "[Column 1 View Model] Set Advance Search Creation Date To Field",
  props<{ date: string }>()
);

export const setAdvanceSearch_TransactionDateFromField = createAction(
  "[Column 1 View Model] Set Advance Search Creation Date From Field",
  props<{ date: string }>()
);

export const setAdvanceSearch_TransactionDateToField = createAction(
  "[Column 1 View Model] Set Advance Search Creation Date To Field",
  props<{ date: string }>()
);

export const setGenDocListing_PreviousSnapshotGuid = createAction(
  "[Column 1 View Model] Set Gen Doc Listing Previous Snapshot Guid",
  props<{ snapshotGuid: string }>()
);

export const removeGenDocListing_PreviousSnapshotGuid = createAction(
  "[Column 1 View Model] Remove Gen Doc Listing Previous Snapshot Guid",
  props<{ snapshotGuid: string }>()
);

export const setAdvanceSearch_SalesAgentField = createAction(
  "[Column 1 View Model] Set Advance Search Sales Agent Field",
  props<{ salesAgents: [] }>()
);

export const resetGenDocListing_SnapshotGuid = createAction(
  "[Column 1 View Model] Reset Gen Doc Listing Snapshot Guids"
);

export const setAdvanceSearch_OrderByField = createAction(
  "[Column 1 View Model] Set Advance Search Order By Field",
  props<{ orderBy: string }>()
);

export const setSalesReturnListing_State = createAction(
  "[Column 1 View Model] Set Sales Return Listing State",
  props<{ salesReturnListingState: any }>()
);