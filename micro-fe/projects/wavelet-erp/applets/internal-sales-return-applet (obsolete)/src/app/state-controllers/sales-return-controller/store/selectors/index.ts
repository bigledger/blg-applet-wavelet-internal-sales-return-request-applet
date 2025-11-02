import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSalesReturnSelectors from './sales-return.selectors';
import * as fromItemSelectors from './item.selectors';
import { SalesReturnStates } from '../states';

export { fromSalesReturnSelectors as SalesReturnSelectors };
export { fromItemSelectors as ItemSelectors };