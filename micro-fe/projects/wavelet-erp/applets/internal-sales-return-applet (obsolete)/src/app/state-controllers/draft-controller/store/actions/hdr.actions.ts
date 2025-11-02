import { createAction, props } from "@ngrx/store";
import { bl_fi_generic_doc_line_RowClass } from "blg-akaun-ts-lib";
import { BillingAddress, BillingInfo, ShippingAddress, ShippingInfo, SIDepartment, SIMain, SIPosting } from "../../../../models/sales-return.model";

export const updateMain = createAction('[Draft: HDR] Update Main', props<{ form: SIMain }>());
export const updateDepartment = createAction('[Draft: HDR] Update Department', props<{ form: SIDepartment }>());
export const updatePosting = createAction('[Draft: HDR] Update Posting', props<{ form: SIPosting }>());
export const updateBillingInfo = createAction('[Draft: HDR] Update Billing', props<{ form: BillingInfo }>());
export const updateBillingAddress = createAction('[Draft: HDR] Update Billing Address', props<{ form: BillingAddress }>());
export const updateShippingInfo = createAction('[Draft: HDR] Update Shipping', props<{ form: ShippingInfo }>());
export const updateShippingAddress = createAction('[Draft: HDR] Update Shipping Address', props<{ form: ShippingAddress }>());
export const updateBalance = createAction('[Draft: HDR] Update Balance', props<{ pns: bl_fi_generic_doc_line_RowClass }>());
export const resetHDR = createAction('[Draft: HDR] Reset');