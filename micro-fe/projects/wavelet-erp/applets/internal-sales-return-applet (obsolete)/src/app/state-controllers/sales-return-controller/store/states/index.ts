import * as fromSalesReturnStates from './sales-return.states';
import * as fromItemStates from './item.states';

export interface SalesReturnStates {
  salesReturn: fromSalesReturnStates.SalesReturnState;
  item: fromItemStates.ItemState;
}
