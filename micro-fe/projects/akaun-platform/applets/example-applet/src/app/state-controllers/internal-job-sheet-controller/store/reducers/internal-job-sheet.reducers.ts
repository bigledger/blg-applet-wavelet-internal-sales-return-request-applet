import { InternalJobSheetActions } from '../actions';
import { Action, createReducer, on } from '@ngrx/store';
import { initState } from '../states/internal-job-sheet.states';
import { InternalJobSheetState } from '../states/internal-job-sheet.states';
import { GenericDocContainerModel } from 'blg-akaun-ts-lib';

export const internalJobSheetFeatureKey = 'jobSheet';

export const internalJobSheetReducer = createReducer(
  initState,
  on(InternalJobSheetActions.loadJobSheetSuccess, (state, action) =>
    ({...state, totalRecords: action.totalRecords})),
  on(InternalJobSheetActions.selectEntityInit, (state, action) =>
    ({...state, selectedEntity: action.entity, draftEdit: {...action.entity}})),
  on(InternalJobSheetActions.selectCustomer, (state, action) =>
    ({...state, selectedCustomer: action.entity.entity})),
  // on(InternalJobSheetActions.selectCustomer, (state, action) =>
  //   ({...state, selectedCustomer: action.entity})),
  on(InternalJobSheetActions.selectShippingAddress, (state, action) =>
    ({...state, selectedShippingAddress: action.ext})),
  on(InternalJobSheetActions.selectBillingAddress, (state, action) =>
    ({...state, selectedBillingAddress: action.ext})),
  on(InternalJobSheetActions.selectItem, (state, action) => ({
    ...state,
    selectedItem: action.entity
  })),
  on(InternalJobSheetActions.selectLineItemInit, (state, action) => ({
    ...state,
    selectedLineItem: action.line
  })),
  on(InternalJobSheetActions.selectContraDoc, (state, action) => ({
    ...state,
    selectedContraDoc: action.entity
  })),
  on(InternalJobSheetActions.selectContraLink, (state, action) => ({
    ...state,
    selectedContraLink: action.link
  })),
  on(InternalJobSheetActions.createJobSheetSuccess, (state, action) => ({
    ...state, draft: new GenericDocContainerModel(), updateAgGrid: true
  })),
  on(InternalJobSheetActions.deleteJobSheetSuccess, (state, action) => ({
    ...state, updateAgGrid: true
  })),
  on(InternalJobSheetActions.editJobSheetSuccess, (state, action) => ({
    ...state, updateAgGrid: true
  })),
  on(InternalJobSheetActions.resetAgGrid, (state, action) => ({
    ...state, updateAgGrid: false
  })),
  on(InternalJobSheetActions.selectEntityCustomerSuccess, (state, action) => ({
    ...state, selectedCustomer: action.entity
  })),
  // on(InternalJobSheetActions.selectEntityCustomerSuccess, (state, action) => ({
  //   ...state, selectedCustomer: action.entity
  // })),
  on(InternalJobSheetActions.selectPayment, (state, action) =>
  ({ ...state, selectedPayment: action.line })),

  on(InternalJobSheetActions.selectLineItemSuccess, (state, action) => ({
    ...state, selectedItem: action.entity
  })),
  on(InternalJobSheetActions.selectBatch, (state, action) => ({
    ...state,
    selectedBatch: action.batch
  })),
  on(InternalJobSheetActions.selectJobSheetForEdit, (state, action) =>
  ({ ...state, selectedJobSheet: action.genDoc })),
);

export function reducer(state: InternalJobSheetState | undefined, action: Action) {
  return internalJobSheetReducer(state, action);
}
