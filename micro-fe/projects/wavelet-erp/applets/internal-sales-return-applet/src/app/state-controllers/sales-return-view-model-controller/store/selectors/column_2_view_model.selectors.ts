import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ColumnViewModelStates } from "../states";
import { columnViewModelFeatureKey } from "../reducers";

export const ViewModelSelector = createFeatureSelector<ColumnViewModelStates>(
  columnViewModelFeatureKey
);

export const selectKOForImport_JSDocNo = createSelector(
  ViewModelSelector,
  (state: ColumnViewModelStates) => state.column2ViewModel.KOForJSDocNo
);

export const selectKOForImport_SODocNo = createSelector(
  ViewModelSelector,
  (state: ColumnViewModelStates) => state.column2ViewModel.KOForSODocNo
);

export const selectKOForImport_DODocNo = createSelector(
  ViewModelSelector,
  (state: ColumnViewModelStates) => state.column2ViewModel.KOForDODocNo
);

export const selectKOForImport_SIDocNo = createSelector(
  ViewModelSelector,
  (state: ColumnViewModelStates) => state.column2ViewModel.KOForSIDocNo
);

export const selectDeliveryDetailsTab_LoadedBranches = createSelector(
  ViewModelSelector,
  (state: ColumnViewModelStates) =>
    state.column2ViewModel.deliveryDetailsTab_loadedBranches
);

export const selectDeliveryDetailsTab_LoadedLocations = createSelector(
  ViewModelSelector,
  (state: ColumnViewModelStates) =>
    state.column2ViewModel.deliveryDetailsTab_loadedLocations
);

export const selectDeliveryDetailsTab_LoadedDeliveryRegions = createSelector(
  ViewModelSelector,
  (state: ColumnViewModelStates) =>
    state.column2ViewModel.deliveryDetailsTab_loadedDeliveryRegions
);
