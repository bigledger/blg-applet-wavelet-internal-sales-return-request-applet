import { createSelector } from '@ngrx/store';
import { selectDraftState } from '../..';
import { binAdapter } from '../states/bin.states';

export const selectBinState = createSelector(
  selectDraftState,
  (s1) => s1.bin
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = binAdapter.getSelectors(selectBinState);
