import { FormGroup } from '@angular/forms';
import { createAction, props } from '@ngrx/store';
import { PrintableFormatContainerModel, ServiceReturnReasonContainerModel } from 'blg-akaun-ts-lib';

export const loadReasonSettingInit = createAction('[Reason Setting] Load Init', props<{ request: any }>());
export const loadReasonSettingSuccess = createAction('[Reason Setting] Load Success', props<{ totalRecords: number }>());
export const loadReasonSettingFailed = createAction('[Reason Setting] Load Failed', props<{ error: string }>());

export const createReasonSettingInit = createAction(
    "[Reason Setting] Create Reason Init",
    props<{ reasonSetting: ServiceReturnReasonContainerModel }>()
  );
  
  export const createReasonSettingSuccess = createAction('[Reason Setting] Create Success', props<{
    reasonSetting: ServiceReturnReasonContainerModel;
  }>());
export const createReasonSettingFailed = createAction('[Reason Setting] Create Failed', props<{ error: string }>());

export const deleteReasonSettingInit = createAction('[Reason Setting] Delete Init', props<{ guid: string }>());
export const deleteReasonSettingSuccess = createAction('[Reason Setting] Delete Success');
export const deleteReasonSettingFailed = createAction('[Reason Setting] Delete Failed', props<{ error: string }>());

export const updateReasonSettingInit = createAction('[Reason Setting] Update Init', props<{ guid: string, reasonSetting: FormGroup }>());
export const updateReasonSettingSuccess = createAction('[Reason Setting] Update Success');
export const updateReasonSettingFailed = createAction('[Reason Setting] Update Failed', props<{ error: string }>());

// export const selectDefaultReasonSettingInit = createAction('[Reason Setting] Select Default Init', props<{ defaultReasonSettingGuid: string }>());
// export const selectDefaultFormatSuccess = createAction('[Reason Setting] Select Default Success');
// export const selectDefaultFormatFailed = createAction('[Reason Setting] Select Default Failed', props<{ error: string }>());

export const selectReasonSettingForEdit = createAction('[Reason Setting] Select Reason Setting For Edit', props<{ reasonSetting: any }>());

export const resetAgGrid = createAction('[Reason Setting] Reset Ag Grid Update');

export const updateAgGridDone = createAction('[Reason Setting] Update AG Grid Done', props<{done: boolean}>());