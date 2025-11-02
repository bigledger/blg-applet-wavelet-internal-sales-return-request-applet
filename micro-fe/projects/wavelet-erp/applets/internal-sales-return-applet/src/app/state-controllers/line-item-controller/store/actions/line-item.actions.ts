import { createAction, props } from '@ngrx/store';
import { bl_fi_generic_doc_line_RowClass, GenericDocContainerModel, PricingSchemeLinkContainerModel } from 'blg-akaun-ts-lib';

export const loadLineItemInit = createAction('[Line Item] Load Init', props<{ request: any }>());
export const loadLineItemSuccess = createAction('[Line Item] Load Success', props<{ totalRecords: number }>());
export const loadLineItemFailed = createAction('[Line Item] Load Failed', props<{ error: string }>());

export const selectLineItem = createAction('[Line Item] Select Line Item', props<{ lineItem: bl_fi_generic_doc_line_RowClass }>());
export const selectSalesReturn = createAction('[Line Item] Select Return Line Item Success', props<{ genDoc: GenericDocContainerModel }>());

export const selectPricingSchemeLink = createAction('[Line Item] Select Pricing Scheme Link', props<{ item: any }>());
export const selectPricingSchemeLinkSuccess = createAction('[Line Item] Select Pricing Link Scheme Success', props<{ pricing: PricingSchemeLinkContainerModel[] }>());
export const selectPricingSchemeLinkFailed = createAction('[Line Item] Select Pricing Link Scheme Failed', props<{ error: string }>());

export const selectPricingScheme = createAction('[Line Item] Select Pricing Scheme', props<{ pricingScheme: any }>());
export const addPricingSchemeLinkInit = createAction('[Line Item] Add Pricing Scheme Link Init', props<{ link: PricingSchemeLinkContainerModel }>());
export const addPricingSchemeLinkSuccess = createAction('[Line Item] Add Pricing Scheme Link Success');
export const addPricingSchemeLinkFailed = createAction('[Line Item] Add Pricing Scheme Link Failed', props<{ error: string }>());
export const editPricingSchemeLinkInit = createAction('[Line Item] Edit Pricing Scheme Link Init', props<{ link: PricingSchemeLinkContainerModel }>());
export const editPricingSchemeLinkSuccess = createAction('[Line Item] Edit Pricing Scheme Link Success');
export const editPricingSchemeLinkFailed = createAction('[Line Item] Edit Pricing Scheme Link Failed', props<{ error: string }>());

export const editGenLineItemInit = createAction('[Line Item] Edit Generic Doc Line Item Init', props<{ genDoc: GenericDocContainerModel }>());
export const editGenLineItemSuccess = createAction('[Line Item] Edit Generic Doc Line Item Success');
export const editGenLineItemFailed = createAction('[Line Item] Edit Generic Doc Line Item Failed', props<{ error: string }>());

export const resetAgGrid = createAction('[Line Item] Reset Ag Grid Update');
export const selectTotalRecords = createAction('[Line Item] Select Total Records', props<{ totalRecords: number }>());
export const selectRowData = createAction('[Line Item] Select Row Data', props<{ rowData: [] }>());
export const selectGuid = createAction('[Line Item] Select Guid', props<{ guid: any }>());
export const selectFirstLoadListing = createAction('[Line Item] Select First Load Listing', props<{firstLoadListing: boolean }>());