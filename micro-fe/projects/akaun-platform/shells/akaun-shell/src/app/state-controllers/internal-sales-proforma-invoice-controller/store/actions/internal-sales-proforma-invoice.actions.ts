import { createAction, props } from '@ngrx/store';
import { BinModel, bl_fi_generic_doc_line_RowClass, bl_fi_mst_entity_ext_RowClass, bl_fi_mst_entity_line_RowClass, EntityContainerModel, FinancialItemContainerModel, GenericDocContainerModel } from 'blg-akaun-ts-lib';

export const loadSalesOrdersInit = createAction('[Sales Proforma Invoice] Load Init', props<{ request: any }>());
export const loadSalesOrderSuccess = createAction('[Sales Proforma Invoice] Load Success', props<{ totalRecords: number}>());
export const loadSalesOrderFailed = createAction('[Sales Proforma Invoice] Load Failed', props<{error: string}>());

export const selectEntityInit = createAction('[Sales Proforma Invoice] Select Entity Item Init', props<{ entity: GenericDocContainerModel }>());
export const selectEntityCustomerSuccess = createAction('[Sales Proforma Invoice] Select Entity Customer Success', props<{ entity: EntityContainerModel }>());
export const selectEntityCustomerFailed = createAction('[Sales Proforma Invoice] Select Entity Customer Failed', props<{error: string}>());

export const selectCustomer = createAction('[Sales Proforma Invoice] Select Customer', props<{ entity: {entity: EntityContainerModel, contact: bl_fi_mst_entity_line_RowClass} }>());
export const selectShippingAddress = createAction('[Sales Proforma Invoice] Select Shipping Address', props<{ ext: bl_fi_mst_entity_ext_RowClass }>());
export const selectBillingAddress = createAction('[Sales Proforma Invoice] Select Billing Address', props<{ ext: bl_fi_mst_entity_ext_RowClass }>());
export const selectBatch = createAction('[Sales Proforma Invoice] Select Batch', props<{ batch: BinModel }>());

export const selectItem = createAction('[Sales Proforma Invoice] Select Item Init', props<{ entity: FinancialItemContainerModel }>());

export const selectLineItemInit = createAction('[Sales Proforma Invoice] Select Line Item Init', props<{ line: bl_fi_generic_doc_line_RowClass }>());
export const selectLineItemSuccess = createAction('[Sales Proforma Invoice] Select Line Item Success', props<{ entity: FinancialItemContainerModel }>());
export const selectLineItemFailed = createAction('[Sales Proforma Invoice] Select Line Item Failed', props<{error: string}>());

export const createSalesOrdersInit = createAction('[Sales Proforma Invoice] Create Init');
export const createSalesOrderSuccess = createAction('[Sales Proforma Invoice] Create Success');
export const createSalesOrderFailed = createAction('[Sales Proforma Invoice] Create Failed', props<{error: string}>());

export const deleteSalesOrdersInit = createAction('[Sales Proforma Invoice] Delete Init');
export const deleteSalesOrderSuccess = createAction('[Sales Proforma Invoice] Delete Success');
export const deleteSalesOrderFailed = createAction('[Sales Proforma Invoice] Delete Failed', props<{error: string}>());

export const editSalesOrdersInit = createAction('[Sales Proforma Invoice] Edit Init');
export const editSalesOrderSuccess = createAction('[Sales Proforma Invoice] Edit Success');
export const editSalesOrderFailed = createAction('[Sales Proforma Invoice] Edit Failed', props<{error: string}>());

export const selectCustomerEdit = createAction('[Sales Proforma Invoice] Select Customer Edit', props<{ entity: {entity: EntityContainerModel, contact: bl_fi_mst_entity_line_RowClass} }>());
export const selectShippingAddressEdit = createAction('[Sales Proforma Invoice] Select Shipping Address Edit', props<{ ext: bl_fi_mst_entity_ext_RowClass }>());
export const selectBillingAddressEdit = createAction('[Sales Proforma Invoice] Select Billing Address Edit', props<{ ext: bl_fi_mst_entity_ext_RowClass }>());

export const resetAgGrid = createAction('[Sales Proforma Invoice] Reset Ag Grid Update');

export const printJasperPdfInit = createAction('[Sales Proforma Invoice] Print Jasper Pdf Init');
export const printJasperPdfSuccess = createAction('[Sales Proforma Invoice] Print Jasper Pdf Success');
export const printJasperPdfFailed = createAction('[Sales Proforma Invoice] Print Jasper Pdf Failed');

export const resetSalesOrder = createAction('[Sales Proforma Invoice] Reset');
export const resetSalesOrderEdit = createAction('[Sales Proforma Invoice] Reset Edit');
