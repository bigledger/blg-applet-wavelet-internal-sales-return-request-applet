import * as fromColumn1ViewModelReducers from './column_1_view_model.reducers';
import * as fromColumn2ViewModelReducers from './column_2_view_model.reducers';
import * as fromColumn4ViewModelReducers from './column_4_view_model.reducers';

import { ActionReducerMap } from '@ngrx/store';
import { ColumnViewModelStates } from '../states';


export const columnViewModelFeatureKey = 'salesReturnColumnViewModels';

export const columnViewModelReducers: ActionReducerMap<ColumnViewModelStates> = {
  column1ViewModel: fromColumn1ViewModelReducers.reducer,
  column2ViewModel: fromColumn2ViewModelReducers.reducer,
  column4ViewModel: fromColumn4ViewModelReducers.reducer
};
