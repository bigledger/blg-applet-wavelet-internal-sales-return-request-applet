import { createSelector } from "@ngrx/store";
import { selectDraftState } from "../..";
import { settlementAdapter } from "../states/settlement.states";

export const selectSettlementState = createSelector(
  selectDraftState,
  (s1) => s1.settlement
)

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = settlementAdapter.getSelectors(selectSettlementState);

export const selectSettlementEntities = createSelector(
  selectSettlementState,
  state => state.entities
);


export const selectTotalSettlement= createSelector(
  selectSettlementEntities,
  entities =>
    Object.values(entities)
      .filter(entity => entity.status === 'ACTIVE')
      .map(entity => parseFloat(entity.amount_txn?.toString()) || 0)
      .reduce((acc, amount) => acc + amount, 0)
);
