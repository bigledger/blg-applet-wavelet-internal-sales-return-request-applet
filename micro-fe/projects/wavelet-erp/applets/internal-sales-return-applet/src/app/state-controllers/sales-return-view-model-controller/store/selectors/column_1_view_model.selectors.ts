import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ColumnViewModelStates } from '../states';
import { columnViewModelFeatureKey } from '../reducers';

export const ViewModelSelector = createFeatureSelector<ColumnViewModelStates>(columnViewModelFeatureKey);

export const selectAdvanceSearch_Customer_Field = createSelector(
  ViewModelSelector, 
 (state: ColumnViewModelStates) => state.column1ViewModel.advanceSearch_Customer_Field
);

export const selectAdvanceSearch_Branch_Field = createSelector(
 ViewModelSelector, 
(state: ColumnViewModelStates) => state.column1ViewModel.advanceSearch_Branch_Field
);

export const selectAdvanceSearch_CreationDateFrom_Field = createSelector(
 ViewModelSelector, 
(state: ColumnViewModelStates) => state.column1ViewModel.advanceSearch_CreationDateFrom_Field
);

export const selectAdvanceSearch_CreationDateTo_Field = createSelector(
 ViewModelSelector, 
(state: ColumnViewModelStates) => state.column1ViewModel.advanceSearch_CreationDateTo_Field
);

export const selectAdvanceSearch_TransactionDateFrom_Field = createSelector(
 ViewModelSelector, 
(state: ColumnViewModelStates) => state.column1ViewModel.advanceSearch_TransactionDateFrom_Field
);

export const selectAdvanceSearch_TransactionDateTo_Field = createSelector(
 ViewModelSelector, 
(state: ColumnViewModelStates) => state.column1ViewModel.advanceSearch_TransactionDateTo_Field
);

export const selectGenDocListing_RefreshListing = createSelector(
 ViewModelSelector, 
(state: ColumnViewModelStates) => state.column1ViewModel.refreshGenDocListing
);

export const selectGenDocListing_SnapshotGuid = createSelector(
 ViewModelSelector, 
(state: ColumnViewModelStates) => state.column1ViewModel.genDocListing_SnapshotGuid
);

export const selectGenDocListing_PreviousSnapshotGuid = createSelector(
 ViewModelSelector, 
(state: ColumnViewModelStates) => state.column1ViewModel.genDocListing_PreviousSnapshotGuids
);

export const selectAdvanceSearch_SalesAgent_Field = createSelector(
 ViewModelSelector, 
(state: ColumnViewModelStates) => state.column1ViewModel.advanceSearch_SalesAgent_Field
);

export const selectAdvanceSearch_OrderBy_Field = createSelector(
  ViewModelSelector, 
 (state: ColumnViewModelStates) => state.column1ViewModel.advanceSearch_OrderBy_Field
);

export const selectSalesReturnListing_State = createSelector(
  ViewModelSelector, 
 (state: ColumnViewModelStates) => state.column1ViewModel.salesReturnListingState
);