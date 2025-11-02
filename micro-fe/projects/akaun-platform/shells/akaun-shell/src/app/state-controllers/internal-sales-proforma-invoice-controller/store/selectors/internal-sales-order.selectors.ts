import { createFeatureSelector } from '@ngrx/store';
import { internalSalesOrderFeatureKey } from '../reducers/internal-sales-proforma-invoice.reducers';
import { InternalSalesProformaInvoiceStates } from '../states';
import { InternalSalesProformaInvoiceState } from '../states/internal-sales-proforma-invoice.states';

export const selectInternalSalesOrderFeature = createFeatureSelector<InternalSalesProformaInvoiceState>(internalSalesOrderFeatureKey);

export const selectEntity = (state: InternalSalesProformaInvoiceStates) => state.salesOrder.selectedEntity;
export const selectTotalRecords = (state: InternalSalesProformaInvoiceStates) => state.salesOrder.totalRecords;
export const selectCustomer = (state: InternalSalesProformaInvoiceStates) => state.salesOrder.selectedCustomer;
export const selectShippingAddress = (state: InternalSalesProformaInvoiceStates) => state.salesOrder.selectedShippingAddress;
export const selectBillingAddress = (state: InternalSalesProformaInvoiceStates) => state.salesOrder.selectedBillingAddress;
export const selectItem = (state: InternalSalesProformaInvoiceStates) => state.salesOrder.selectedItem;
export const selectAgGrid = (state: InternalSalesProformaInvoiceStates) => state.salesOrder.updateAgGrid;
export const selectLineItem = (state: InternalSalesProformaInvoiceStates) => state.salesOrder.selectedLineItem;
export const selectBatch = (state: InternalSalesProformaInvoiceStates) => state.salesOrder.selectedBatch;
