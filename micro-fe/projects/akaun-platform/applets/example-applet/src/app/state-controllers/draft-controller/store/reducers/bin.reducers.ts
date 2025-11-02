import { Action, createReducer, on } from '@ngrx/store';
import { BinActions } from '../actions';
import { binAdapter, BinState, initState } from '../states/bin.states';

export const binReducers = createReducer(
    initState,
    on(BinActions.addBins, (state, action) => binAdapter.upsertMany(action.bins, state)),
    on(BinActions.updateBin, (state, action) => binAdapter.upsertOne(action.bin, state)),
    on(BinActions.resetBins, (state, action) => binAdapter.removeAll(state)),
);

export function reducers(state: BinState | undefined, action: Action) {
    return binReducers(state, action);
}
