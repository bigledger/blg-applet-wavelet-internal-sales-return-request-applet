import { Action, createReducer, on } from '@ngrx/store';
import { ItemActions } from '../actions';
import { initState } from '../states/item.states';
import { ItemState } from '../states/item.states';

export const ItemReducer = createReducer(
  initState,
  on(ItemActions.selectInvItem, (state, action) => ({
    ...state,
    selectedInvItem: action.invItem
  })),
  on(ItemActions.selectSerial, (state, action) => ({
    ...state,
    selectedSerial: action.serial
  })),
  on(ItemActions.selectBatch, (state, action) => ({
    ...state,
    selectedBatch: action.batch
  })),
  on(ItemActions.selectBin, (state, action) => ({
    ...state,
    selectedBin: action.bin
  })),
);

export function reducer(state: ItemState | undefined, action: Action) {
  return ItemReducer(state, action);
}