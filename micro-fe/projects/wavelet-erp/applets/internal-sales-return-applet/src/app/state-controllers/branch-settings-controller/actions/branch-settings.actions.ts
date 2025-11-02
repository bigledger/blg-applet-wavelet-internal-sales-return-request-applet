import { FormGroup } from '@angular/forms';
import { createAction, props } from '@ngrx/store';
import { BranchContainerModel,BranchDefaultPrintableFormatHdrContainerModel, BranchSettlementMethodContainerModel } from "blg-akaun-ts-lib";

export const selectBranch = createAction('[Branch Settings] Select Branch', props<{ branch: BranchContainerModel }>());
export const selectGuid = createAction('[Branch Settings] Select Branch', props<{ guid: any }>());

export const loadSettlementMethodInit = createAction('[Branch Settings] Load Settlement Method Init', props<{ request: any }>());
export const loadSettlementMethodSuccess = createAction('[Branch Settings] Load Settlement Method Success');
export const loadSettlementMethodFailure = createAction('[Branch Settings] Load Settlement Method Failure', props<{ error: string }>());

export const addSettlementMethodInit = createAction('[Branch Settings] Add Settlement Methods Init', props<{branchGuid: string, method: string[]}>());
export const addSettlementMethodSucess = createAction('[Branch Settings] Add Settlement Methods Success');
export const addSettlementMethodFailure = createAction('[Branch Settings] Add Settlement Methods Failure', props<{error: string}>());

export const addDefaultPrintableFormatInit = createAction('[Branch Settings] Add Default Printable Format Init', props<{container: BranchDefaultPrintableFormatHdrContainerModel}>());
export const addDefaultPrintableFormatSucess = createAction('[Branch Settings] Add Default Printable Format Success', props<{container: BranchDefaultPrintableFormatHdrContainerModel}>());
export const addDefaultPrintableFormatFailure = createAction('[Branch Settings] Add Default Printable Format Failure', props<{error: string}>());

export const selectDefaultPrintableFormatInit = createAction('[Branch Settings] Select Default Printable Format Init', props<{branchGuid:any, serverDocType: string}>());
export const selectDefaultPrintableFormatSucess = createAction('[Branch Settings] Select Default Printable Format Success', props<{container: BranchDefaultPrintableFormatHdrContainerModel}>());
export const selectDefaultPrintableFormatFailure = createAction('[Branch Settings] Select Default Printable Format Failure', props<{error: string}>());

export const editDefaultPrintableFormatInit = createAction('[Branch Settings] Edit Default Printable Format Init', props<{container: BranchDefaultPrintableFormatHdrContainerModel}>());
export const editDefaultPrintableFormatSucess = createAction('[Branch Settings] Edit Default Printable Format Success', props<{container: BranchDefaultPrintableFormatHdrContainerModel}>());
export const editDefaultPrintableFormatFailure = createAction('[Branch Settings] Edit Default Printable Format Failure', props<{error: string}>());

export const selectBranchSettlementMethodListInit = createAction('[Branch Settings] Select Branch Settlement Method Init', props<{branchGuid:any}>());
export const selectBranchSettlementMethodListSucess = createAction('[Branch Settings] Select Branch Settlement Method Success', props<{container: any[]}>());
export const selectBranchSettlementMethodListFailure = createAction('[Branch Settings] Select Branch Settlement Method Failure', props<{error: string}>());

export const updateBranchDetails = createAction('[Branch Settings]Update Branch Details', props<{guid: any, form: any}>());
export const updateBranchDetailsSuccess = createAction('[Branch Settings] Update Branch Details Success');
export const updateBranchDetailsFailed = createAction('[Branch Settings] Update Branch Details Failed', props<{error: string}>());