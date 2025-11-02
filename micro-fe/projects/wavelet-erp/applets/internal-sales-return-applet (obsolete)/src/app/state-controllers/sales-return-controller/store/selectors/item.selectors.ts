import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SalesReturnStates } from '../states';
import { SalesReturnFeatureKey } from '../reducers';

export const SalesReturnSelector = createFeatureSelector<SalesReturnStates>(SalesReturnFeatureKey);

export const selectInvItem = createSelector(
  SalesReturnSelector, 
  (state: SalesReturnStates) => state.item.selectedInvItem
);
export const selectSerial = createSelector(
  SalesReturnSelector,
  (state: SalesReturnStates) => state.item.selectedSerial
);
export const selectBatch = createSelector(
  SalesReturnSelector,
  (state: SalesReturnStates) => state.item.selectedBatch
);
export const selectBin = createSelector(
  SalesReturnSelector,
  (state: SalesReturnStates) => state.item.selectedBin
);