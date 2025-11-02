import { Action, createReducer, on } from '@ngrx/store';
import { ViewCacheActions } from '../actions';
import { initialState, ViewCacheState } from '../states/view-cache.states';

export const viewCacheFeatureKey = 'viewCache';

export const viewCacheReducer = createReducer(
  initialState,
  on(ViewCacheActions.cacheInternalSalesReturn, (state, action) => ({ ...state, internalSalesReturn: action.cache })),
  on(ViewCacheActions.cacheLineItems, (state, action) => ({ ...state, lineItems: action.cache })),
  on(ViewCacheActions.cachePrintableFormatSettings, (state, action) => ({ ...state, printableFormatSettings: action.cache })),
  on(ViewCacheActions.cacheReasonSettings, (state, action) => ({ ...state, reasonSettings: action.cache })),
  on(ViewCacheActions.cacheWorkflowSettings, (state, action) => ({ ...state, workflowSettings: action.cache })),
  on(ViewCacheActions.cacheManualIntercompanyTransaction, (state, action) => ({ ...state, manualIntercompanyTransaction: action.cache })),
  on(ViewCacheActions.cacheBranchSettings, (state, action) => ({...state, branchSettings: action.cache})),
  on(ViewCacheActions.cacheSettlementMethodSettings, (state, action) => ({...state, settlementMethodSettings: action.cache})),
);

export function reducer(state: ViewCacheState | undefined, action: Action) {
  return viewCacheReducer(state, action);
}


