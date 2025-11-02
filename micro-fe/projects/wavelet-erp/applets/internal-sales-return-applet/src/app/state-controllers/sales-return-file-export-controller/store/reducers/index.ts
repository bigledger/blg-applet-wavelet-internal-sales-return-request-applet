import { ActionReducerMap } from '@ngrx/store';
import { SalesReturnFileExportStates} from '../states';
import * as fromSalesReturnFileExportReducers from './sales-return-file-export.reducers';

export const reducers: ActionReducerMap<SalesReturnFileExportStates> = {
  salesReturnFileExport: fromSalesReturnFileExportReducers.reducer
};