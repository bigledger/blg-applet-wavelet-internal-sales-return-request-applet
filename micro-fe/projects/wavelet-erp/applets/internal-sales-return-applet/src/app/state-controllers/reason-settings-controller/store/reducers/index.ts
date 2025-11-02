import { ActionReducerMap } from '@ngrx/store';
import { ReasonSettingStates } from '../states';
import * as fromReasonSettingReducers from './reason-settings.reducers';


export const reducers: ActionReducerMap<ReasonSettingStates> = {
    reasonSetting: fromReasonSettingReducers.reducer
};
