import * as fromFileImportReducers from './file-import.reducers';
import { ActionReducerMap } from '@ngrx/store';
import { FileImportStates } from '../states';

export const reducers: ActionReducerMap<FileImportStates> = {
  fileImport: fromFileImportReducers.reducer,
};
