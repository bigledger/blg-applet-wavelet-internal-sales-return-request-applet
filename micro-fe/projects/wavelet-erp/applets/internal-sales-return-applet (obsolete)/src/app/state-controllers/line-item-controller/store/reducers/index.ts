import * as fromLineItemReducers from './line-item.reducers';

import { ActionReducerMap } from '@ngrx/store';
import { LineItemStates } from '../states';

export const reducers: ActionReducerMap<LineItemStates> = {
  lineItem: fromLineItemReducers.reducer
};
