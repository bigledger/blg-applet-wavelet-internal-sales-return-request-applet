import { Action, createReducer, on } from "@ngrx/store";
import { Column4ViewModelActions } from "../actions";
import {
  initialState,
  Column4ViewModelState,
} from "../states/column_4_view_model.states";

export const Column4ViewModelReducer = createReducer(
  initialState,
  on(Column4ViewModelActions.processSerialNumberListing_Reset, (state, action) =>
  ({ ...state, serialNumberTab_ScanTab_SerialNumbersListing: [] })),
  on(Column4ViewModelActions.setSerialNumberTab_ScanTab_SerialNumbersListing, (state, action) =>
  ({ ...state, serialNumberTab_ScanTab_SerialNumbersListing: action.serialNumberListing })),
  on(Column4ViewModelActions.updateSerialNumberTab_ScanTab_SerialNumbersListing, (state, action) =>
  ({ ...state, serialNumberTab_ScanTab_SerialNumbersListing: action.serialNumberListing.concat(state.serialNumberTab_ScanTab_SerialNumbersListing) })),
  on(Column4ViewModelActions.setItemDetailsTab_qtyBaseField_Value, (state, action) =>
  ({ ...state, itemDetailsTab_qtyBaseField_Value: action.baseQuantity })),
  on(Column4ViewModelActions.setSerialNumberTabFieldColor, (state, action) =>
  ({ ...state, serialNumberTab_Color: action.color })),
  on(Column4ViewModelActions.setBaseQuantityFieldColor, (state, action) =>
  ({ ...state, itemDetailsTab_qtyBaseField_Color: action.color })),
  on(Column4ViewModelActions.setItemDetailsTab_itemType_Value, (state, action) =>
  ({ ...state, itemDetailsTab_itemType_Value: action.itemType })),
  on(Column4ViewModelActions.setDefaultPricingSchemeHdr, (state, action) => ({
    ...state,
    defaultPricingSchemeHdr: action.defaultPricingSchemeHdr,
  })),
  on(Column4ViewModelActions.setFIItemHdrGuid, (state, action) => ({
    ...state,
    fiItemHdrGuid: action.fiItemHdrGuid,
  })),
  on(Column4ViewModelActions.setPricingScheme, (state, action) => ({
    ...state,
    pricingScheme: action.pricingScheme,
  })),
  on(Column4ViewModelActions.setPricingSchemeAccessKey, (state, action) => ({
    ...state,
    pricingSchemeAccessKey: action.pricingSchemeAccessKey,
  })),
  on(Column4ViewModelActions.setFIItem, (state, action) => ({
    ...state,
    fiItem: action.fiItem,
  }))
);

export function reducer(
  state: Column4ViewModelState | undefined,
  action: Action
) {
  return Column4ViewModelReducer(state, action);
}
