import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FileImportFeatureKey } from '../reducers/file-import.reducers';
import { FileImportStates } from '../states';
import { FileImportState, fileImportAdapter } from '../states/file-import.states';

export const selectFileImportFeature = createFeatureSelector<FileImportState>(FileImportFeatureKey);

export const selectfileImportFeature =
  createFeatureSelector<FileImportState>(FileImportFeatureKey);
export const selectfileImportGuid = (state: FileImportStates) =>
  state.fileImport.selectedFileImportGuid;
export const selectEntity = (state: FileImportStates) =>
  state.fileImport.selectedEntity;
export const selectRequiresUpdate = (state: FileImportStates) =>
  state.fileImport.requiresUpdate;
export const selectLocalOperationCount = (state: FileImportStates) =>
  state.fileImport.localOperationsCount;
export const totalRecord = (state: FileImportStates) =>
  state.fileImport.totalRecord;
export const selectHelperGuid = (state: FileImportStates) =>
  state.fileImport.selectedHelperGuid;
export const selectHelperEntity = (state: FileImportStates) =>
  state.fileImport.selectedHelperEntity;
export const selectFileImportAllData = (state: FileImportStates) =>
  state.fileImport.fileImportAllData;
export const selectFileImportErrorData = (state: FileImportStates) =>
  state.fileImport.fileImportErrorData;
