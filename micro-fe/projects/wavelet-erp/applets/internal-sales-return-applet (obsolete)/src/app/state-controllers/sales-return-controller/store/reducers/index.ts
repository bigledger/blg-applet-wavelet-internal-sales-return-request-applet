import * as fromSalesReturnReducers from './sales-return.reducers';
import * as fromItemReducers from './item.reducers';

import { ActionReducerMap } from '@ngrx/store';
import { SalesReturnStates } from '../states';

export const SalesReturnFeatureKey = 'return';

export const reducers: ActionReducerMap<SalesReturnStates> = {
  salesReturn: fromSalesReturnReducers.reducer,
  item: fromItemReducers.reducer
};
