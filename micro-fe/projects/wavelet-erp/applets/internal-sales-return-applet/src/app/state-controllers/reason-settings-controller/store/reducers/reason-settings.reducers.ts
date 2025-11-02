import { Action, createReducer, on } from '@ngrx/store';
import { ReasonSettingActions } from '../actions';
import { initState, ReasonSettingState } from '../states/reason-settings-states';

export const ReasonSettingFeatureKey = 'reasonSetting';

export const ReasonSettingReducer = createReducer(
  initState,
  on(ReasonSettingActions.loadReasonSettingSuccess, (state, action) =>
    ({ ...state, totalRecords: action.totalRecords })),
  on(ReasonSettingActions.createReasonSettingSuccess, (state, action) => ({
    ...state, updateAgGrid: true
  })),
  // on(ReasonSettingActions.updateReasonSettingInit, (state, action) => ({
  //   ...state, draftData: action.draftData
  // })),
  on(ReasonSettingActions.updateReasonSettingSuccess, (state, action) => ({
    ...state, updateAgGrid: true
  })),
  on(ReasonSettingActions.deleteReasonSettingSuccess, (state, action) => ({
    ...state, updateAgGrid: true
  })),
  on(ReasonSettingActions.selectReasonSettingForEdit, (state, action) =>
    ({ ...state, selectedReasonSetting: action.reasonSetting })),
  // on(ReasonSettingActions.selectDefaultReasonSettingInit, (state, action) =>
  //   ({ ...state, defaultReasonSettingGuid: action.defaultReasonSettingGuid })),
  on(ReasonSettingActions.resetAgGrid, (state, action) => ({
    ...state, updateAgGrid: false
  })),
  on(ReasonSettingActions.updateAgGridDone, (state, action) => ({...state, updateAgGrid: action.done}))

);

export function reducer(state: ReasonSettingState | undefined, action: Action) {
  return ReasonSettingReducer(state, action);
}
