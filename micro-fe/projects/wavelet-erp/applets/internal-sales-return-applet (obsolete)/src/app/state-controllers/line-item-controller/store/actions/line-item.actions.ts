import { createAction, props } from '@ngrx/store';
import { bl_fi_generic_doc_line_RowClass, GenericDocContainerModel, bl_inv_bin_hdr_RowClass, bl_inv_batch_hdr_RowClass } from 'blg-akaun-ts-lib';

export const loadLineItemInit = createAction('[Line Item] Load Init', props<{ request: any }>());
export const loadLineItemSuccess = createAction('[Line Item] Load Success', props<{ totalRecords: number}>());
export const loadLineItemFailed = createAction('[Line Item] Load Failed', props<{ error: string }>());

export const selectLineItem = createAction('[Line Item] Select Line Item', props<{ lineItem: bl_fi_generic_doc_line_RowClass }>());
export const selectOrder = createAction('[Line Item] Select Order Line Item Success', props<{ genDoc: GenericDocContainerModel }>());

export const selectInvItem = createAction('[line Item] Select Inventory Item', props<{ invItem }>());
export const noInvItemFound = createAction('[Line Item] No Inventory Item Found');
export const selectBatch = createAction('[Line Item] Select Batch Number', props<{ batch: bl_inv_batch_hdr_RowClass }>());
export const selectBin = createAction('[Line Item] Select Bin Number', props<{ bin: bl_inv_bin_hdr_RowClass }>());

export const editGenLineItemInit = createAction('[Line Item] Edit Generic Doc Line Item Init', props<{ genDoc: GenericDocContainerModel }>());
export const editGenLineItemSuccess = createAction('[Line Item] Edit Generic Doc Line Item Success');
export const editGenLineItemFailed = createAction('[Line Item] Edit Generic Doc Line Item Failed', props<{ error: string }>());

export const resetAgGrid = createAction('[Line Item] Reset Ag Grid Update');
