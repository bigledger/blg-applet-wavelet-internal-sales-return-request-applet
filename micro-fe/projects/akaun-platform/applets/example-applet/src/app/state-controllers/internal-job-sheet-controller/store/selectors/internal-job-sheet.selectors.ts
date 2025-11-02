import { createFeatureSelector } from '@ngrx/store';
import { internalJobSheetFeatureKey } from '../reducers/internal-job-sheet.reducers';
import { InternalJobSheetStates } from '../states';
import { InternalJobSheetState } from '../states/internal-job-sheet.states';

export const selectInternalJobSheetFeature = createFeatureSelector<InternalJobSheetState>(internalJobSheetFeatureKey);

export const selectEntity = (state: InternalJobSheetStates) => state.jobSheet.selectedEntity;
export const selectTotalRecords = (state: InternalJobSheetStates) => state.jobSheet.totalRecords;
export const selectCustomer = (state: InternalJobSheetStates) => state.jobSheet.selectedCustomer;
export const selectShippingAddress = (state: InternalJobSheetStates) => state.jobSheet.selectedShippingAddress;
export const selectBillingAddress = (state: InternalJobSheetStates) => state.jobSheet.selectedBillingAddress;
export const selectItem = (state: InternalJobSheetStates) => state.jobSheet.selectedItem;
export const selectAgGrid = (state: InternalJobSheetStates) => state.jobSheet.updateAgGrid;
export const selectLineItem = (state: InternalJobSheetStates) => state.jobSheet.selectedLineItem;
export const selectBatch = (state: InternalJobSheetStates) => state.jobSheet.selectedBatch;
export const selectPayment = (state: InternalJobSheetStates) => state.jobSheet.selectedPayment;
export const selectContraDoc = (state: InternalJobSheetStates) => state.jobSheet.selectedContraDoc;
export const selectContraLink = (state: InternalJobSheetStates) => state.jobSheet.selectedContraLink;
export const selectJobSheet = (state: InternalJobSheetStates) => state.jobSheet.selectedJobSheet;

