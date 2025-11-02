import { FormGroup } from '@angular/forms';
import { createAction, props } from '@ngrx/store';
import { CompanyContainerModel } from 'blg-akaun-ts-lib';

// export const loadCompanyInit = createAction('[Company] Load', props<{ limit: number, offset: number }>());
// export const loadCompanySuccess = createAction('[Company] Load Success', props<{ company: CompanyContainerModel[] }>());
// export const loadCompanyFailure = createAction('[Company] Load Failure');
export const loadCompanyInit = createAction('[Company] Load Init', props<{ request: any }>());
export const loadCompanySuccess = createAction('[Company] Load Success', props<{ totalRecords: number }>());
export const loadCompanyFailure = createAction('[Company] Load Failure', props<{error: string}>());

export const createCompanyInit = createAction('[Company] Create Init', props<{ company: CompanyContainerModel }>());
export const createCompanySuccess = createAction('[Company] Create Success', props<{ company: CompanyContainerModel }>());
export const createCompanyFailure = createAction('[Company] Create Failure', props<{error: string}>());

export const deleteCompanyInit = createAction('[Company] Delete Init', props<{ guid: string }>());
export const deleteCompanySuccess = createAction('[Company] Delete Success', props<{guid: string}>());
export const deleteCompanyFailure = createAction('[Company] Delete Failure', props<{error: string}>());

export const updateCompanyInit = createAction('[Company] Update Init', props<{ guid: string, company: FormGroup }>());
export const updateCompanySuccess = createAction('[Company] Update Success', props<{company: CompanyContainerModel}>());
export const updateCompanyFailure = createAction('[Company] Update Failure', props<{error: string}>());

export const selectGuid = createAction('[Company] Select Guid', props<{guid: string}>());

export const updateAgGridDone = createAction('[Company Update AG Grid Done', props<{done: boolean}>() );
