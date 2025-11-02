import * as fromInternalSalesOrderReducers from './internal-sales-proforma-invoice.reducers'

import { ActionReducerMap } from '@ngrx/store';
import { InternalSalesProformaInvoiceStates } from '../states';

export const reducers: ActionReducerMap<InternalSalesProformaInvoiceStates> = {
  salesOrder: fromInternalSalesOrderReducers.reducer
};
