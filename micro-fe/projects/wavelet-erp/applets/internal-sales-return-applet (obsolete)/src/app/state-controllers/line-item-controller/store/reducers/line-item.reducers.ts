import { LineItemActions } from '../actions';
import { Action, createReducer, on } from '@ngrx/store';
import { initState } from '../states/line-item.states';
import { LineItemState } from '../states/line-item.states';

export const LineItemFeatureKey = 'lineItem';

export const LineItemReducer = createReducer(
  initState,
  on(LineItemActions.loadLineItemSuccess, (state, action) =>
    ({ ...state, totalRecords: action.totalRecords })),

  on(LineItemActions.selectOrder, (state, action) =>
  ({ ...state, selectedOrder: action.genDoc })),

  on(LineItemActions.selectLineItem, (state, action) =>
  ({ ...state, selectedLineItem: action.lineItem })),

  on(LineItemActions.selectInvItem, (state, action) =>
  ({ ...state, selectedInvItem: action.invItem })),

  on(LineItemActions.selectBatch, (state, action) =>
  ({ ...state, selectedBatch: action.batch })),

  on(LineItemActions.selectBin, (state, action) =>
  ({ ...state, selectedBin: action.bin })),

  on(LineItemActions.editGenLineItemSuccess, (state, action) => ({
    ...state, updateAgGrid: true
  })),
  
  on(LineItemActions.resetAgGrid, (state, action) => ({
    ...state, updateAgGrid: false
  })),  
);

export function reducer(state: LineItemState | undefined, action: Action) {
  return LineItemReducer(state, action);
}