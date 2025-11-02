import { ActionReducerMap } from '@ngrx/store';
import { BranchSettingsStates } from '../states';

import * as fromBranchSettingsReducers from './branch-settings.reducers';

export const reducers: ActionReducerMap<BranchSettingsStates> = {
    branchSettings: fromBranchSettingsReducers.branchSettingsReducer
};