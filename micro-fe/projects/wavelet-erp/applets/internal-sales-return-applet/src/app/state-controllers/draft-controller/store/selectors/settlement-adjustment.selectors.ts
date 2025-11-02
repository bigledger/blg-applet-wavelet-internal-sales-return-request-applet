import { createSelector } from "@ngrx/store";
import { selectDraftState } from "../..";
import { settlementAdjustmentAdapter } from "../states/settlement-adjustment.states";

export const selectSettlementAdjustmentState = createSelector(
  selectDraftState,
  (s1) => s1.settlementAdjustment
)

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = settlementAdjustmentAdapter.getSelectors(selectSettlementAdjustmentState);

export const selectSettlementAdjustmentEntities = createSelector(
  selectSettlementAdjustmentState,
  state => state.entities
);

export const selectTotalSettlementAdjustment = createSelector(
  selectSettlementAdjustmentEntities,
  entities =>
    Object.values(entities)
      .filter(entity => entity.status === 'ACTIVE')
      .map(entity => parseFloat(entity.amount_txn?.toString()) || 0)
      .reduce((acc, amount) => acc + amount, 0)
);
