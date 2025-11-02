import { createSelector } from "@ngrx/store";
import { selectDraftState } from "../..";
import { linkAdapter } from "../states/link.states";

export const selectLinkState = createSelector(
  selectDraftState,
  (s1) => s1.link
)
 
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = linkAdapter.getSelectors(selectLinkState);