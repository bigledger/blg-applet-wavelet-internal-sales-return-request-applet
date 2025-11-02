import { createSelector } from "@ngrx/store";
import { selectDraftState } from "../..";
import { paymentAdapter } from "../states/payment.states";

export const selectSettlementState = createSelector(
  selectDraftState,
  (s1) => s1.payment
)
 
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = paymentAdapter.getSelectors(selectSettlementState);