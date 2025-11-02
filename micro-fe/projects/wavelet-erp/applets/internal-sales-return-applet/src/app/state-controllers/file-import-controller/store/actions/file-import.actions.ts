import { createAction, props } from '@ngrx/store';
import { SalesReturnFileImportContainerModel, PurchaseInvoiceFileImportHelperContainerModel } from 'blg-akaun-ts-lib';

export const GET_FILEIMPORT_SUCCESS = createAction(
  "[FileImport] LoadSuccess",
  props<{ fileimport: SalesReturnFileImportContainerModel[]; totalRecords: number }>()
);
export const GET_FILEIMPORT_FAILED = createAction(
  "[FileImport] LoadFailure",
  props<{ error: any }>()
);
export const FILEIMPORT_CREATE_INIT = createAction(
  "[FileImport] Create Init",
  props<{ fileimport: any }>()
);

export const selectFileImportGuid = createAction(
  "[FileImport] Select Guid",
  props<{ fileimportguid: any }>()
);
export const selectEntity = createAction(
  "[FileImport] Select Entity",
  props<{ fileimport: SalesReturnFileImportContainerModel }>()
);
export const setRequiresUpdate = createAction(
  "[FileImport] Set Update Options",
  props<{ update: boolean }>()
);

export const GET_HELPER_CHECKING_SUCCESS = createAction(
  "[FileImport] LoadSuccess",
  props<{ helper: PurchaseInvoiceFileImportHelperContainerModel[]; totalRecords: number }>()
);
export const GET_HELPER_CHECKING_FAILED = createAction(
  "[FileImport] LoadFailure",
  props<{ error: any }>()
);
export const HELPER_CHECKING_CREATE_INIT = createAction(
  "[FileImport] Create Init",
  props<{ helper: any }>()
);

export const loadFileImportAllData = createAction(
  '[FileImport] Load Data',
  props<{ fileImportHdrGuid: any }>()
);
export const loadFileImportAllDataSuccess = createAction(
  '[FileImport] Load Data Success',
  props<{ data: any[] }>()
);
export const loadFileImportAllDataFailure = createAction(
  '[FileImport] Load Data Failure',
  props<{ error: any }>()
);

export const loadFileImportErrorData = createAction(
  '[FileImport] Load Data Error',
  props<{ fileImportHdrGuid: any }>()
);
export const loadFileImportErrorDataSuccess = createAction(
  '[FileImport] Load Data Error Success',
  props<{ data: any[] }>()
);
export const loadFileImportErrorDataFailure = createAction(
  '[FileImport] Load Data Error Failure',
  props<{ error: any }>()
);
