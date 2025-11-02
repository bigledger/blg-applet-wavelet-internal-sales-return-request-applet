import { Action, createReducer, on } from '@ngrx/store';
import {SalesReturnFileExportActions} from '../actions';
import {initState, SalesReturnFileExportState, SalesReturnFileExportAdapters} from '../states/sales-return-file-export.states';


export const SalesReturnFileExportFeatureKey = 'salesReturnFileExport';

export const SalesReturnFileExportReducer = createReducer(
  initState,
  on(SalesReturnFileExportActions.loadSalesReturnFileExportSuccess, (state, action) =>
    ({ ...state, totalRecords: action.totalRecords })),

  on(SalesReturnFileExportActions.selectGuid, (state, action) => ({
    ...state,
    selectedGuid: action.guid,
  })),
  on(SalesReturnFileExportActions.updateAgGridDone, (state, action) => ({
    ...state,
    updateAgGrid: action.done,
  })),

  on(SalesReturnFileExportActions.createSalesReturnFileExportContainerDraftInit, (state, action) => ({
    ...state,
    draftTempReportContainer: action.salesReturnFileExport,
  })),

  on(SalesReturnFileExportActions.createSalesReturnFileExportSuccess, (state, action) => ({
    ...state,
    updateAgGrid: true,
    draftTempReportContainer: null,
  })),

  on(SalesReturnFileExportActions.updateSalesReturnFileExportSuccess, (state, action) => ({
    ...state,
    updateAgGrid: true,
    draftTempReportContainer: null,
  })),

  on(SalesReturnFileExportActions.deleteSalesReturnFileExportSuccess, (state, action) => ({
      ...state,
      updateAgGrid: true,
      draftTempReportContainer: null,
  })),
);

export function reducer(state: SalesReturnFileExportState | undefined, action: Action) {
  return SalesReturnFileExportReducer(state, action);
}
