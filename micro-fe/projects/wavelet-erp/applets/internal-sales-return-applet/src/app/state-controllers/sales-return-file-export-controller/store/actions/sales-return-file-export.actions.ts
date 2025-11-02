import { createAction, props } from '@ngrx/store';
import { GenericDocFileExportContainerModel } from 'blg-akaun-ts-lib';
import { FormGroup } from '@angular/forms';

export const loadSalesReturnFileExportInit = createAction('[Sales Return File Export] Load Init', props<{ request: any }>());
export const loadSalesReturnFileExportSuccess = createAction('[Sales Return File Export] Load Success', props<{ totalRecords: number }>());
export const loadSalesReturnFileExportFailed = createAction('[Sales Return File Export] Load Failed', props<{ error: string }>());

export const selectGuid = createAction('[Sales Return File Export] Select Guid', props<{guid: string}>());
export const updateAgGridDone = createAction('[Sales Return File Export] Update AG Grid Done', props<{done: boolean}>() );
export const createSalesReturnFileExportContainerDraftInit = createAction('[Sales Return File Export] Create Container', props<{ salesReturnFileExport: GenericDocFileExportContainerModel }>());

export const saveSettings = createAction('[Sales Return File Export] Save Settings', props<{ settings: any }>());

export const createSalesReturnFileExportInit = createAction('[Sales Return File Export] create Init', props<{ salesReturnFileExport: GenericDocFileExportContainerModel }>());
export const createSalesReturnFileExportSuccess = createAction('[Sales Return File Export] create Success', props<{ salesReturnFileExport: GenericDocFileExportContainerModel }>());
export const createSalesReturnFileExportFailed = createAction('[Sales Return File Export] create Failed', props<{ error: string }>());

export const updateSalesReturnFileExportInit = createAction('[Sales Return File Export] Update Init', props<{ guid: string, salesReturnFileExport: FormGroup }>());
export const updateSalesReturnFileExportSuccess = createAction('[Sales Return File Export] Update Success', props<{salesReturnFileExport: GenericDocFileExportContainerModel}>());
export const updateSalesReturnFileExportFailure = createAction('[Sales Return File Export] Update Failure', props<{error: string}>());

export const deleteSalesReturnFileExportInit = createAction('[Sales Return File Export] Delete Init', props<{ guid: string }>());
export const deleteSalesReturnFileExportSuccess = createAction('[Sales Return File Export] Delete Success', props<{guid: string}>());
export const deleteSalesReturnFileExportFailure = createAction('[Sales Return File Export] Delete Failure', props<{error: string}>());