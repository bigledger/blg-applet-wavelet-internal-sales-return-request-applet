import { Action, createReducer, on } from '@ngrx/store';
import { LineItemActions } from '../actions';
import { initState, LineItemState } from '../states/line-item.states';

export const LineItemFeatureKey = 'lineItem';

export const LineItemReducer = createReducer(
  initState,
  on(LineItemActions.loadLineItemSuccess, (state, action) =>
    ({ ...state, totalRecords: action.totalRecords })),

  on(LineItemActions.selectSalesReturn, (state, action) =>
    ({ ...state, selectedSalesReturn: action.genDoc })),

  on(LineItemActions.selectLineItem, (state, action) =>
    ({ ...state, selectedLineItem: action.lineItem })),

  on(LineItemActions.resetAgGrid, (state, action) => ({
    ...state, updateAgGrid: false
  })),

  on(LineItemActions.editGenLineItemSuccess, (state, action) => ({
    ...state, updateAgGrid: true
  })),
  on(LineItemActions.selectPricingSchemeLinkSuccess, (state, action) =>
  ({
    ...state, pricingSchemeLink: action.pricing
  })),

  on(LineItemActions.selectPricingScheme, (state, action) => ({
    ...state,
    selectedPricingScheme: action.pricingScheme
  })),
  on(LineItemActions.selectTotalRecords, (state, action) => ({
    ...state, totalRecords: action.totalRecords
  })),
  on(LineItemActions.selectRowData, (state, action) => ({
    ...state, rowData: action.rowData
  })),
  on(LineItemActions.selectGuid, (state, action) => ({
    ...state, selectedGuid : action.guid
  })),
  on(LineItemActions.selectFirstLoadListing, (state, action) =>
    ({...state, firstLoadListing: action.firstLoadListing})),  
);

export function reducer(state: LineItemState | undefined, action: Action) {
  return LineItemReducer(state, action);
}
