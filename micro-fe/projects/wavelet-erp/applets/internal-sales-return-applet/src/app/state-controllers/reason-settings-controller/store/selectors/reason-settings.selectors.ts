import { createFeatureSelector } from '@ngrx/store';
import { ReasonSettingFeatureKey } from '../reducers/reason-settings.reducers';
import { ReasonSettingStates } from '../states';
import { ReasonSettingState } from '../states/reason-settings-states';

export const selectReasonSettingFeature = createFeatureSelector<ReasonSettingState>(ReasonSettingFeatureKey);

export const selectReasonSetting = (state: ReasonSettingStates) => state.reasonSetting.selectedReasonSetting;
export const selectDraftData = (state: ReasonSettingStates) => state.reasonSetting.draftData;
// export const selectDefaultReasonSettingGuid = (state: ReasonSettingStates) => state.reasonSetting.defaultReasonSettingGuid;
// export const selectAgGrid = (state: ReasonSettingStates) => state.reasonSetting.updateAgGrid;

export const updateAgGrid = (state: ReasonSettingStates) => state.reasonSetting.updateAgGrid;