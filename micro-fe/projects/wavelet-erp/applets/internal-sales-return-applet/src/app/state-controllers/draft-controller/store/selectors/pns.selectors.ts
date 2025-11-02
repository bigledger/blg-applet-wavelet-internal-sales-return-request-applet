import { createSelector } from "@ngrx/store";
import { selectDraftState } from "../..";
import { pnsAdapter } from "../states/pns.states";

export const selectPNSState = createSelector(
  selectDraftState,
  (s1) => s1.pns
)
 
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = pnsAdapter.getSelectors(selectPNSState);