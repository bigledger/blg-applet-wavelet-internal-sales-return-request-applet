import { createAction, props } from '@ngrx/store';
import {
    BinModel,
    EntityContainerModel,
    GenericDocContainerModel,
    FinancialItemContainerModel,
    bl_fi_mst_entity_ext_RowClass,
    bl_fi_mst_entity_line_RowClass,
    bl_fi_generic_doc_line_RowClass,
    GenericDocARAPContainerModel,
} from 'blg-akaun-ts-lib';

export const loadJobSheetInit = createAction('[Job Sheet] Load Init', props<{ request: any }>());
export const loadJobSheetSuccess = createAction('[Job Sheet] Load Success', props<{ totalRecords: number}>());
export const loadJobSheetFailed = createAction('[Job Sheet] Load Failed', props<{error: string}>());

export const selectEntityInit = createAction('[Job Sheet] Select Entity Item Init', props<{ entity: GenericDocContainerModel }>());
export const selectEntityCustomerSuccess = createAction('[Job Sheet] Select Entity Customer Success', props<{ entity: EntityContainerModel }>());
export const selectEntityCustomerFailed = createAction('[Job Sheet] Select Entity Customer Failed', props<{error: string}>());

// export const selectCustomer = createAction('[Job Sheet] Select Customer', props<{ entity: EntityContainerModel }>());
export const selectCustomer = createAction('[Job Sheet] Select Customer', props<{ entity: {entity: EntityContainerModel, contact: bl_fi_mst_entity_line_RowClass} }>());
export const selectShippingAddress = createAction('[Job Sheet] Select Shipping Address', props<{ ext: bl_fi_mst_entity_ext_RowClass }>());
export const selectBillingAddress = createAction('[Job Sheet] Select Billing Address', props<{ ext: bl_fi_mst_entity_ext_RowClass }>());
export const selectBatch = createAction('[Job Sheet] Select Batch', props<{ batch: BinModel }>());
export const selectPayment = createAction('[Job Sheet] Select Payment', props<{ line: bl_fi_generic_doc_line_RowClass }>());

export const selectItem = createAction('[Job Sheet] Select Item Init', props<{ entity: FinancialItemContainerModel }>());
// export const selectItemSuccess = createAction('[JobSheet] Select Item Success', props<{ pricingScheme: bl_fi_mst_pricing_scheme_hdr_RowClass[] }>());
// export const selectItemFailed = createAction('[JobSheet] Select Item Failed', props<{error: string}>());

export const selectLineItemInit = createAction('[Job Sheet] Select Line Item Init', props<{ line: bl_fi_generic_doc_line_RowClass }>());
export const selectLineItemSuccess = createAction('[Job Sheet] Select Line Item Success', props<{ entity: FinancialItemContainerModel }>());
export const selectLineItemFailed = createAction('[Job Sheet] Select Line Item Failed', props<{error: string}>());
export const selectContraDoc = createAction('[Sales Order] Select Contra Doc', props<{ entity: GenericDocContainerModel }>());
export const selectContraLink = createAction('[Sales Order] Select Contra Link', props<{ link: GenericDocARAPContainerModel }>());

export const createJobSheetInit = createAction('[Job Sheet] Create Init');
export const createJobSheetSuccess = createAction('[Job Sheet] Create Success');
export const createJobSheetFailed = createAction('[Job Sheet] Create Failed', props<{error: string}>());

export const deleteJobSheetInit = createAction('[Job Sheet] Delete Init');
export const deleteJobSheetSuccess = createAction('[Job Sheet] Delete Success');
export const deleteJobSheetFailed = createAction('[Job Sheet] Delete Failed', props<{error: string}>());

export const editJobSheetInit = createAction('[Job Sheet] Edit Init');
export const editJobSheetSuccess = createAction('[Job Sheet] Edit Success');
export const editJobSheetFailed = createAction('[Job Sheet] Edit Failed', props<{error: string}>());

// export const selectCustomerEdit = createAction('[Job Sheet] Select Customer Edit', props<{ entity: EntityContainerModel }>());
export const selectCustomerEdit = createAction('[Job Sheet] Select Customer Edit', props<{ entity: {entity: EntityContainerModel, contact: bl_fi_mst_entity_line_RowClass} }>());
export const selectShippingAddressEdit = createAction('[Job Sheet] Select Shipping Address Edit', props<{ ext: bl_fi_mst_entity_ext_RowClass }>());
export const selectBillingAddressEdit = createAction('[Job Sheet] Select Billing Address Edit', props<{ ext: bl_fi_mst_entity_ext_RowClass }>());

export const resetAgGrid = createAction('[Job Sheet] Reset Ag Grid Update');

export const printJasperPdfInit = createAction('[Internal Job Sheet] Print Jasper Pdf Init');
export const printJasperPdfSuccess = createAction('[Internal Job Sheet] Print Jasper Pdf Success');
export const printJasperPdfFailed = createAction('[Internal Job Sheet] Print Jasper Pdf Failed');

export const addContraInit = createAction('[Internal Job Sheet] Add Contra Init', props<{ contra: GenericDocARAPContainerModel }>());
export const addContraSuccess = createAction('[Internal Job Sheet] Add Contra Success');
export const addContraFailed = createAction('[Internal Job Sheet] Add Contra Failed', props<{ error: string }>());

export const deleteContraInit = createAction('[Internal Job Sheet] Delete Contra Init');
export const deleteContraSuccess = createAction('[Internal Job Sheet] Delete Contra Success');
export const deleteContraFailed = createAction('[Internal Job Sheet] Delete Contra Failed', props<{ error: string }>());

export const selectJobSheetForEdit = createAction('[Internal Job Sheet] Select Internal Job Sheet For Edit', props<{ genDoc: GenericDocContainerModel }>());
