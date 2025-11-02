import { Action, createReducer, on } from '@ngrx/store';
import { SalesReturnActions } from '../actions';
import { initState, SalesReturnState } from '../states/sales-return.states';

export const SalesReturnReducer = createReducer(
  initState,
  on(SalesReturnActions.loadSalesReturnSuccess, (state, action) =>
    ({ ...state, totalRecords: action.totalRecords })),

  on(SalesReturnActions.selectEntity, (state, action) =>
    ({ ...state, selectedEntity: action.entity.entity })),

  on(SalesReturnActions.selectEntityOnEdit, (state, action) =>
    ({ ...state, selectedEntity: action.entity.entity })),

  on(SalesReturnActions.selectLineItem, (state, action) =>
    ({ ...state, selectedLineItem: action.lineItem })),

  on(SalesReturnActions.selectReturnForEdit, (state, action) =>
    ({ ...state, selectedReturn: action.genDoc })),

  on(SalesReturnActions.selectMode, (state, action) =>
    ({ ...state, selectedMode: action.mode })),

  on(SalesReturnActions.selectPayment, (state, action) =>
    ({ ...state, selectedPayment: action.payment })),

  on(SalesReturnActions.createSalesReturnSuccess, (state, action) => ({
    ...state, updateAgGrid: true
  })),

  on(SalesReturnActions.editSalesReturnSuccess, (state, action) => ({
    ...state, updateAgGrid: true
  })),

  on(SalesReturnActions.deleteSalesReturnSuccess, (state, action) => ({
    ...state, updateAgGrid: true
  })),

  on(SalesReturnActions.resetAgGrid, (state, action) => ({
    ...state, updateAgGrid: false
  })),
  on(SalesReturnActions.selectContraDoc, (state, action) => ({
    ...state,
    selectedContraDoc: action.contraDoc
  })),
  on(SalesReturnActions.selectContraLink, (state, action) => ({
    ...state,
    selectedContraLink: action.link
  })),
  on(SalesReturnActions.updatePostingStatusSuccess, (state, action) => ({
    ...state, updateAgGrid: true
  })),
);

export function reducer(state: SalesReturnState | undefined, action: Action) {
  return SalesReturnReducer(state, action);
}
