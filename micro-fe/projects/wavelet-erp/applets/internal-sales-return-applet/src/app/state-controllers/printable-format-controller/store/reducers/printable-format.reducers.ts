import { Action, createReducer, on } from '@ngrx/store';
import { PrintableFormatActions } from '../actions';
import { initState, PrintableFormatState } from '../states/printable-format.states';

export const PrintableFormatFeatureKey = 'printableFormat';

export const PrintableFormatReducer = createReducer(
  initState,
  on(PrintableFormatActions.loadPrintableFormatSuccess, (state, action) =>
    ({ ...state, totalRecords: action.totalRecords })),
  on(PrintableFormatActions.createPrintableFormatInit, (state, action) => ({
    ...state, draftData: action.draftData
  })),
  on(PrintableFormatActions.createPrintableFormatSuccess, (state, action) => ({
    ...state, updateAgGrid: true
  })),
  on(PrintableFormatActions.editPrintableFormatInit, (state, action) => ({
    ...state, draftData: action.draftData
  })),
  on(PrintableFormatActions.editPrintableFormatSuccess, (state, action) => ({
    ...state, updateAgGrid: true
  })),
  on(PrintableFormatActions.deletePrintableFormatSuccess, (state, action) => ({
    ...state, updateAgGrid: true
  })),
  on(PrintableFormatActions.selectPrintableFormatForEdit, (state, action) =>
    ({ ...state, selectedPrintableFormat: action.printableFormat })),
  on(PrintableFormatActions.resetAgGrid, (state, action) => ({
    ...state, updateAgGrid: false
  })),
  on(PrintableFormatActions.selectDefaultPrintableFormatInit, (state, action) =>
    ({ ...state, defaultPrintableFormatGuid: action.defaultPrintableFormatGuid, defaultPrintableFormatName: action.defaultPrintableFormatName })),
);

export function reducer(state: PrintableFormatState | undefined, action: Action) {
  return PrintableFormatReducer(state, action);
}
