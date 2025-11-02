import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SalesReturnStates } from '../states';
import { SalesReturnFeatureKey } from '../reducers';

export const SalesReturnSelector = createFeatureSelector<SalesReturnStates>(SalesReturnFeatureKey);

export const selectTotalRecords = createSelector(
  SalesReturnSelector, 
  (state: SalesReturnStates) => state.salesReturn.totalRecords
);
export const selectEntity = createSelector(
  SalesReturnSelector, 
  (state: SalesReturnStates) => state.salesReturn.selectedEntity
);
export const selectLineItem = createSelector(
  SalesReturnSelector, 
  (state: SalesReturnStates) => state.salesReturn.selectedLineItem
);
export const selectReturn = createSelector(
  SalesReturnSelector, 
  (state: SalesReturnStates) => state.salesReturn.selectedReturn
);
export const selectMode = createSelector(
  SalesReturnSelector, 
  (state: SalesReturnStates) => state.salesReturn.selectedMode
);
export const selectPayment = createSelector(
  SalesReturnSelector, 
  (state: SalesReturnStates) => state.salesReturn.selectedPayment
);
export const selectContraDoc = createSelector(
  SalesReturnSelector, 
  (state: SalesReturnStates) => state.salesReturn.selectedContraDoc
);
export const selectContraLink = createSelector(
  SalesReturnSelector, 
  (state: SalesReturnStates) => state.salesReturn.selectedContraLink
);
export const selectAgGrid = createSelector(
  SalesReturnSelector, 
  (state: SalesReturnStates) => state.salesReturn.updateAgGrid
);