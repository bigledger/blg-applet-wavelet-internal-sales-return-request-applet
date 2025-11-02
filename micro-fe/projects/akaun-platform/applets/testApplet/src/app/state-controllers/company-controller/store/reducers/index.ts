
import { ActionReducerMap } from '@ngrx/store';
import { CompanyStates } from '../states';

import * as fromCompanyReducers from './company.reducers';

export const reducers: ActionReducerMap<CompanyStates> = {
  company: fromCompanyReducers.companyReducer
};
