import { Action, createReducer, on } from "@ngrx/store";
import { InternalSalesReturnActions } from "../../../internal-sales-return-controller/store/actions";
import { Column2ViewModelActions } from "../actions";
import {
  initialState,
  Column2ViewModelState,
} from "../states/column_2_view_model.states";

export const Column2ViewModelReducer = createReducer(
  initialState,
  on(Column2ViewModelActions.setKOForImport_JSDocNo, (state, action) => ({
    ...state,
    KOForJSDocNo: action.koForJSDocNo,
  })),
  on(Column2ViewModelActions.setKOForImport_SODocNo, (state, action) => ({
    ...state,
    KOForSODocNo: action.koForSODocNo,
  })),
  on(Column2ViewModelActions.setKOForImport_DODocNo, (state, action) => ({
    ...state,
    KOForDODocNo: action.koForDODocNo,
  })),
  on(Column2ViewModelActions.setKOForImport_SIDocNo, (state, action) => ({
    ...state,
    KOForSIDocNo: action.koForSIDocNo,
  })),
  on(InternalSalesReturnActions.resetDraft, (state, action) => ({
    ...state,
    KOForJSDocNo: null,
    KOForSODocNo: null,
    KOForDODocNo: null,
    KOForSIDocNo: null
  })),
  on(InternalSalesReturnActions.createInternalSalesReturnSuccess, (state, action) => ({
    ...state,
    KOForJSDocNo: null,
    KOForSODocNo: null,
    KOForDODocNo: null,
    KOForSIDocNo: null
  })),
  on(InternalSalesReturnActions.editInternalSalesReturnSuccess, (state, action) => ({
    ...state,
    KOForJSDocNo: null,
    KOForSODocNo: null,
    KOForDODocNo: null,
    KOForSIDocNo: null
  })),
  on(InternalSalesReturnActions.deleteInternalSalesReturnSuccess, (state, action) => ({
    ...state,
    KOForJSDocNo: null,
    KOForSODocNo: null,
    KOForDODocNo: null,
    KOForSIDocNo: null
  })),
  on(
    Column2ViewModelActions.setDeliveryDetailsTab_LoadedBranches,
    (state, action) => ({
      ...state,
      deliveryDetailsTab_loadedBranches: action.branches,
    })
  ),
  on(
    Column2ViewModelActions.setDeliveryDetailsTab_LoadedLocations,
    (state, action) => ({
      ...state,
      deliveryDetailsTab_loadedLocations: action.locations,
    })
  ),
  on(
    Column2ViewModelActions.setDeliveryDetailsTab_LoadedDeliveryRegions,
    (state, action) => ({
      ...state,
      deliveryDetailsTab_loadedDeliveryRegions: action.deliveryRegions,
    })
  )
);

export function reducer(
  state: Column2ViewModelState | undefined,
  action: Action
) {
  return Column2ViewModelReducer(state, action);
}
