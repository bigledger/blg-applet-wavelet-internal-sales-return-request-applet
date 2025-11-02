import { createFeatureSelector } from '@ngrx/store';
import { LineItemFeatureKey } from '../reducers/line-item.reducers';
import { LineItemStates } from '../states';
import { LineItemState } from '../states/line-item.states';

export const selectLineItemFeature = createFeatureSelector<LineItemState>(LineItemFeatureKey);

export const selectOrder = (state: LineItemStates) => state.lineItem.selectedOrder;
export const selectLineItem = (state: LineItemStates) => state.lineItem.selectedLineItem;
export const selectInvItem = (state: LineItemStates) => state.lineItem.selectedInvItem;
export const selectBatch = (state: LineItemStates) => state.lineItem.selectedBatch;
export const selectBin = (state: LineItemStates) => state.lineItem.selectedBin;
export const selectTotalRecords = (state: LineItemStates) => state.lineItem.totalRecords;
export const selectAgGrid = (state: LineItemStates) => state.lineItem.updateAgGrid;
