import { ActionReducerMap } from '@ngrx/store';
import { PrintableFormatStates } from '../states';
import * as fromPrintableFormatReducers from './printable-format.reducers';


export const reducers: ActionReducerMap<PrintableFormatStates> = {
  printableFormat: fromPrintableFormatReducers.reducer
};
