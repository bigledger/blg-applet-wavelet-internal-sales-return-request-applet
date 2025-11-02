import { createAction, props } from '@ngrx/store';
import { bl_fi_generic_doc_line_RowClass, bl_fi_mst_entity_line_RowClass, EntityContainerModel, GenericDocARAPContainerModel, GenericDocContainerModel, JsonDatatypeInterface } from 'blg-akaun-ts-lib';

export const loadSalesReturnInit = createAction('[Sales Return] Load Init', props<{ request: any }>());
export const loadSalesReturnSuccess = createAction('[Sales Return] Load Success', props<{ totalRecords: number }>());
export const loadSalesReturnFailed = createAction('[Sales Return] Load Failed', props<{ error: string }>());

export const selectSalesAgent = createAction('[Sales Return] Select Sales Agent', props<{ guid: string, name: string }>());
export const selectMember = createAction('[Sales Return] Select Member', props<{ guid: string, cardNo: string, name: string }>());
export const selectEntity = createAction('[Sales Return] Select Entity', props<{ entity: { entity: EntityContainerModel, contact: bl_fi_mst_entity_line_RowClass } }>());
export const selectEntityOnEdit = createAction('[Sales Return] Select Entity On Edit', props<{ entity: { entity: EntityContainerModel, contact: bl_fi_mst_entity_line_RowClass } }>());
export const selectShippingAddress = createAction('[Sales Return] Select Shipping Address', props<{ shipping_address: JsonDatatypeInterface }>());
export const selectBillingAddress = createAction('[Sales Return] Select Billing Address', props<{ billing_address: JsonDatatypeInterface }>());
export const selectLineItem = createAction('[Sales Return] Select Line Item', props<{ lineItem: bl_fi_generic_doc_line_RowClass }>());
export const selectReturnForEdit = createAction('[Sales Return] Select Sales Return For Edit', props<{ genDoc: GenericDocContainerModel }>());
export const selectContraDoc = createAction('[Sales Return] Select Contra Doc', props<{ contraDoc: GenericDocContainerModel }>());
export const selectContraLink = createAction('[Sales Return] Select Contra Link', props<{ link: GenericDocARAPContainerModel }>());
export const resetDraft = createAction('[Sales Return] Reset Sales Return');
export const selectMode = createAction('[Sales Return] Select Sales Return View Mode', props<{ mode: string }>());
export const selectPayment = createAction('[Sales Return] Select Payment', props<{ payment: bl_fi_generic_doc_line_RowClass }>());

export const editGenLineItemInit = createAction('[Sales Return] Edit Generic Doc Line Item Init');
export const editGenLineItemSuccess = createAction('[Sales Return] Edit Generic Doc Line Item Success');
export const editGenLineItemFailed = createAction('[Sales Return] Edit Generic Doc Line Item Failed', props<{ error: string }>());

export const createSalesReturnsInit = createAction('[Sales Return] Create Init');
export const createSalesReturnSuccess = createAction('[Sales Return] Create Success');
export const createSalesReturnFailed = createAction('[Sales Return] Create Failed', props<{ error: string }>());

export const deleteSalesReturnInit = createAction('[Sales Return] Delete Init');
export const deleteSalesReturnSuccess = createAction('[Sales Return] Delete Success');
export const deleteSalesReturnFailed = createAction('[Sales Return] Delete Failed', props<{ error: string }>());

export const editSalesReturnInit = createAction('[Sales Return] Edit Init');
export const editSalesReturnSuccess = createAction('[Sales Return] Edit Success');
export const editSalesReturnFailed = createAction('[Sales Return] Edit Failed', props<{ error: string }>());

export const printJasperPdfInit = createAction('[Sales Return] Print Jasper Pdf Init');
export const printJasperPdfSuccess = createAction('[Sales Return] Print Jasper Pdf Success');
export const printJasperPdfFailed = createAction('[Sales Return] Print Jasper Pdf Failed');

export const addContraInit = createAction('[Sales Return] Add Contra Init', props<{ contraDoc: GenericDocARAPContainerModel }>());
export const addContraSuccess = createAction('[Sales Return] Add Contra Success');
export const addContraFailed = createAction('[Sales Return] Add Contra Failed', props<{ error: string }>());

export const deleteContraInit = createAction('[Sales Return] Delete Contra Init');
export const deleteContraSuccess = createAction('[Sales Return] Delete Contra Success');
export const deleteContraFailed = createAction('[Sales Return] Delete Contra Failed', props<{ error: string }>());

export const updatePostingStatusInit = createAction('[Sales Return] Update Posting Status Init', props<{ status: any, doc: GenericDocContainerModel }>());
export const updatePostingStatusSuccess = createAction('[Sales Return] Update Posting Status Success', props<{ doc: GenericDocContainerModel }>());
export const updatePostingStatusFailed = createAction('[Sales Return] Update Posting Status Failed', props<{ error: string }>());

export const resetAgGrid = createAction('[Sales Return] Reset Ag Grid Update');
