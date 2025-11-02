import { createAction, props } from "@ngrx/store";
import { bl_fi_generic_doc_hdr_RowClass, bl_fi_generic_doc_line_RowClass, GenericDocHdrContainerModel } from "blg-akaun-ts-lib";
import { BillingAddress, BillingInfo, ISCNDepartment, ISCNMain, ShippingAddress, ShippingInfo } from "../../../../models/internal-sales-return.model";

export const updateMain = createAction('[Draft: HDR] Update Main', props<{ form: ISCNMain }>());
export const updateDepartment = createAction('[Draft: HDR] Update Department', props<{ form: ISCNDepartment }>());
export const updateBillingInfo = createAction('[Draft: HDR] Update Billing', props<{ form: BillingInfo }>());
export const updateBillingAddress = createAction('[Draft: HDR] Update Billing Address', props<{ form: BillingAddress }>());
export const updateShippingInfo = createAction('[Draft: HDR] Update Shipping', props<{ form: ShippingInfo }>());
export const updateShippingAddress = createAction('[Draft: HDR] Update Shipping Address', props<{ form: ShippingAddress }>());
export const resetHDR = createAction('[Draft: HDR] Reset');
export const resetHDRForEdit = createAction('[Draft: HDR] Reset HDR for Edit', props<{ hdr: bl_fi_generic_doc_hdr_RowClass }>());
export const updateBalance = createAction('[Draft: HDR] Update Balance', props<{ pns: bl_fi_generic_doc_line_RowClass }>());
export const updateMainOnKOImport = createAction('[Draft: HDR] Update Main on KO Import', props<{ genDocHdr: GenericDocHdrContainerModel }>());
export const updateDeliveryType = createAction('[Draft: HDR Edit] Update Delivery Type', props<{ deliveryType: string }>());
export const updateSalesAgent = createAction('[Draft: HDR] Update Sales Agents', props<{ salesAgent: string }>());
export const setEntityBranchHdr = createAction('[Draft: HDR] Set Entity Branch Hdr', props<{ guid:string }>());
export const setBranchIntercompanySettingGuids = createAction('[Draft: HDR] Set Branch Intercompany Setting Guids', props<{ setting:any }>());