import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LineItemFeatureKey } from '../reducers/line-item.reducers';
import { LineItemStates } from '../states';
import { LineItemState } from '../states/line-item.states';

export const selectLineItemFeature = createFeatureSelector<LineItemState>(LineItemFeatureKey);

export const selectSalesReturn = (state: LineItemStates) => state.lineItem.selectedSalesReturn;
export const selectLineItem = (state: LineItemStates) => state.lineItem.selectedLineItem;
export const selectPricingScheme = (state: LineItemStates) => state.lineItem.selectedPricingScheme;
export const selectTotalRecords = (state: LineItemStates) => state.lineItem.totalRecords;
export const selectAgGrid = (state: LineItemStates) => state.lineItem.updateAgGrid;
export const selectRowData = (state: LineItemStates) => state.lineItem.rowData;
export const selectGuid = (state: LineItemStates) => state.lineItem.selectedGuid;
export const selectFirstLoadListing = (state: LineItemStates) => state.lineItem.firstLoadListing;

export const getPricingSchemeLinks = createSelector(
  selectLineItemFeature,
  (state) => state.pricingSchemeLink
);
