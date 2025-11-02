import { ActionReducerMap } from '@ngrx/store';
import { InternalSalesReturnStates } from '../states';
import * as fromInternalSalesReturnReducers from './internal-sales-return.reducers';


export const reducers: ActionReducerMap<InternalSalesReturnStates> = {
  internalSalesReturn: fromInternalSalesReturnReducers.reducer
};
