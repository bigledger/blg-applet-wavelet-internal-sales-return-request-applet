import { createSelector } from "@ngrx/store";
import { selectDraftState } from "../..";
import { contraAdapter } from "../states/contra.states";

export const selectContraState = createSelector(
  selectDraftState,
  (s1) => s1.contra
)

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = contraAdapter.getSelectors(selectContraState);

export const selectContraEntities = createSelector(
  selectContraState,
  state => state.entities
);

export const selectContraNew = createSelector(
  selectContraEntities,
  entities =>
    (Object.values(entities)
      .filter(entity => !entity.status)
      .map(entity => (Number(entity.amount_contra) || 0) )
      .reduce((acc, amount) => acc + amount, 0)
    )
);

export const selectContraNewList = createSelector(
  selectContraEntities,
  entities =>
    (Object.values(entities)
      .filter(entity => !entity.status)
    )
);
