import { createAction, props } from '@ngrx/store';
import { CompanyContainerModel, CompanyWorkflowGendocProcessContainerModel, Pagination } from 'blg-akaun-ts-lib';


export const loadCompanyInit = createAction('[Workflow Settings] Load Company Listing Init', props<{ pagination: Pagination }>());
export const loadCompanySuccess = createAction('[Workflow Settings] Load Company Listing Success',  props<{ company: any [] }>());
export const loadCompanyFailed = createAction('[Workflow Settings] Load Company Listing Failed', props<{ error: string }>());

export const resetAgGrid = createAction('[Workflow Settings] Reset Ag Grid Update');

export const selectCompanyWorkflow = createAction('[Workflow Settings] Select Company', props<{ companyWorkflow:  CompanyWorkflowGendocProcessContainerModel }>());
export const setRefreshBool = createAction('[Workflow Settings] Set Refresh Boolean', props<{ refresh: boolean }>());

export const createCompanyWorkflowInit = createAction('[Workflow Settings] Company Workflow Create Init', props<{ container:  CompanyWorkflowGendocProcessContainerModel }>());
export const createCompanyWorkflowSuccess = createAction('[Workflow Settings] Company Workflow Create Success', props<{ container: CompanyWorkflowGendocProcessContainerModel }>());
export const createCompanyWorkflowFailed = createAction('[Workflow Settings] Company Workflow Create Failed', props<{ error: string }>());


export const updateCompanyWorkflowInit = createAction('[Workflow Settings] Company Workflow Update Init', props<{ container:  CompanyWorkflowGendocProcessContainerModel }>());
export const updateCompanyWorkflowSuccess = createAction('[Workflow Settings] Company Workflow Update Success', props<{ container: CompanyWorkflowGendocProcessContainerModel }>());
export const updateCompanyWorkflowFailed = createAction('[Workflow Settings] Company Workflow Update Failed', props<{ error: string }>());


export const deleteCompanyWorkflowInit = createAction('[Workflow Settings] Delete CompanyWorkflow Init', props<{ guid: string }>());
export const deleteCompanyWorkflowSuccess = createAction('[Workflow Settings] Delete CompanyWorkflow Success', props<{ guid: string }>());
export const deleteCompanyWorkflowFailure = createAction('[Workflow Settings] Delete CompanyWorkflow Failure', props<{ error: string }>());