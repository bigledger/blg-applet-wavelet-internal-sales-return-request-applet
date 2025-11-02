import * as fromViewCacheReducers from './view-cache.reducers';

import { ActionReducerMap } from '@ngrx/store';
import { ViewCacheStates } from '../states';

export const reducers: ActionReducerMap<ViewCacheStates> = {
  viewCache: fromViewCacheReducers.reducer
};
