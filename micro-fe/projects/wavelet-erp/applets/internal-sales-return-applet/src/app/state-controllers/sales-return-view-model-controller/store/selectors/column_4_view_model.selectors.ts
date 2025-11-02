import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ColumnViewModelStates } from '../states';
import { columnViewModelFeatureKey } from '../reducers';

export const ViewModelSelector = createFeatureSelector<ColumnViewModelStates>(columnViewModelFeatureKey);

export const selectSerialNumberTab_ScanTab_SerialNumbersListing = createSelector(
  ViewModelSelector, 
 (state: ColumnViewModelStates) => {return state.column4ViewModel.serialNumberTab_ScanTab_SerialNumbersListing}
);

export const selectItemDetailsTab_qtyBaseField = createSelector(
  ViewModelSelector, 
 (state: ColumnViewModelStates) => {return state.column4ViewModel.itemDetailsTab_qtyBaseField_Value}
);

export const selectSerialNumberTab_Color = createSelector(
  ViewModelSelector, 
 (state: ColumnViewModelStates) => {return state.column4ViewModel.serialNumberTab_Color}
);

export const selectItemDetailsTab_qtyBaseField_Color = createSelector(
  ViewModelSelector, 
 (state: ColumnViewModelStates) => {return state.column4ViewModel.itemDetailsTab_qtyBaseField_Color}
);

export const selectItemDetailsTab_itemType_Value = createSelector(
  ViewModelSelector, 
 (state: ColumnViewModelStates) => {return state.column4ViewModel.itemDetailsTab_itemType_Value}
);

export const selectDefaultPricingSchemeHdr = createSelector(
  ViewModelSelector, 
 (state: ColumnViewModelStates) => state.column4ViewModel.defaultPricingSchemeHdr
);

export const selectFIItemHdrGuid = createSelector(
   ViewModelSelector, 
  (state: ColumnViewModelStates) => state.column4ViewModel.fiItemHdrGuid
);

export const selectPricingScheme = createSelector(
   ViewModelSelector, 
  (state: ColumnViewModelStates) => state.column4ViewModel.pricingScheme
);

export const selectPricingSchemeAccessKey = createSelector(
   ViewModelSelector, 
  (state: ColumnViewModelStates) => state.column4ViewModel.pricingSchemeAccessKey
);

export const selectFIItem = createSelector(
 ViewModelSelector, 
(state: ColumnViewModelStates) => state.column4ViewModel.fiItem
);
