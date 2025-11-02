import { Action, createReducer, on } from '@ngrx/store';
import { ViewCacheActions } from '../actions';
import { initialState, ViewCacheState } from '../states/view-cache.states';

export const viewCacheFeatureKey = 'viewCache';

export const viewCacheReducer = createReducer(
  initialState,
  on(ViewCacheActions.cacheCompany, (state, action) => ({...state, company: action.cache})),
  on(ViewCacheActions.cacheGeneric, (state, action) => ({...state, generic: action.cache})),
);

export function reducer(state: ViewCacheState | undefined, action: Action) {
  return viewCacheReducer(state, action);
}


