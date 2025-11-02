import { Action, createReducer, on } from '@ngrx/store';
import { ViewCacheActions } from '../actions';
import { initialState, ViewCacheState } from '../states/view-cache.states';

export const viewCacheFeatureKey = 'viewCache';

export const viewCacheReducer = createReducer(
  initialState,
  on(ViewCacheActions.cacheSI, (state, action) => ({...state, salesReturn: action.cache})),
  on(ViewCacheActions.cacheLineItems, (state, action) => ({...state, lineItems: action.cache})),
  on(ViewCacheActions.cachePrintableFormatSettings, (state, action) => ({ ...state, printableFormatSettings: action.cache })),
);

export function reducer(state: ViewCacheState | undefined, action: Action) {
  return viewCacheReducer(state, action);
}


