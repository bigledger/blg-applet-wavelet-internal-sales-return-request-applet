import * as fromCustomerReducers from './customer.reducers';

import { ActionReducerMap } from '@ngrx/store';
import { CustomerStates } from '../states';

export const reducerss: ActionReducerMap<CustomerStates> = {
  customer: fromCustomerReducers.reducer
};
