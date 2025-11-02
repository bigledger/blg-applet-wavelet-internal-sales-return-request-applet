import { Action, createReducer, on } from '@ngrx/store';
import { initState } from '../states/file-import.states';
import { FileImportActions } from '../actions';
import { FileImportState } from '../states/file-import.states';
import { AttachmentActions } from '../../../draft-controller/store/actions';

export const FileImportFeatureKey = 'fileImport';
 
export const FileImportReducer = createReducer(
  initState,
  on(FileImportActions.GET_FILEIMPORT_SUCCESS, (state, action) => ({
    ...state,
    totalRecords: action.totalRecords,
  })),

  on(FileImportActions.GET_FILEIMPORT_FAILED, (state, action) => ({
    ...state,
    errorLog: [...state.errorLog, { timeStamp: new Date(), log: action.error }],
  })),

  on(FileImportActions.selectFileImportGuid, (state, action) => {
    return { ...state, selectedFileImportGuid: action.fileimportguid };
  }),

  on(FileImportActions.selectEntity, (state, action) => ({
    ...state,
    selectedEntity: action.fileimport,
    selectedEntityHdr: action.fileimport.bl_fi_internal_sales_return_import_file_hdr,
  })),

  on(AttachmentActions.uploadSRImportAttachmentsSuccess, (state, action) => ({
    ...state,
    requiresUpdate: true,
  })),

  on(FileImportActions.loadFileImportAllDataSuccess, (state, action) => {
    return { ...state, fileImportAllData: action.data };
  }),
  on(FileImportActions.loadFileImportErrorDataSuccess, (state, action) => {
    return { ...state, fileImportErrorData: action.data };
  }),
);

export function reducer(state: FileImportState | undefined, action: Action) {
  return FileImportReducer(state, action);
}