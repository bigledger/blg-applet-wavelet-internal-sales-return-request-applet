import { createFeatureSelector } from '@ngrx/store';
import { PrintableFormatFeatureKey } from '../reducers/printable-format.reducers';
import { PrintableFormatStates } from '../states';
import { PrintableFormatState } from '../states/printable-format.states';

export const selectPrintableFormatFeature = createFeatureSelector<PrintableFormatState>(PrintableFormatFeatureKey);

export const selectPrintableFormat = (state: PrintableFormatStates) => state.printableFormat.selectedPrintableFormat;
export const selectDraftData = (state: PrintableFormatStates) => state.printableFormat.draftData;
export const selectDefaultPrintableFormatGuid = (state: PrintableFormatStates) => state.printableFormat.defaultPrintableFormatGuid;
export const selectAgGrid = (state: PrintableFormatStates) => state.printableFormat.updateAgGrid;