import * as fromInternalJobSheetReducers from './internal-job-sheet.reducers';

import { ActionReducerMap } from '@ngrx/store';
import { InternalJobSheetStates } from '../states';

export const reducers: ActionReducerMap<InternalJobSheetStates> = {
  jobSheet: fromInternalJobSheetReducers.reducer
};
