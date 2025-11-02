import { createAction, props } from '@ngrx/store';
import { bl_fi_generic_doc_line_RowClass } from 'blg-akaun-ts-lib';

export const addPNS = createAction('[Draft: PNS] Add PNS', props<{ pns: bl_fi_generic_doc_line_RowClass }>());
export const editPNS = createAction('[Draft: PNS] Edit PNS', props<{ pns: bl_fi_generic_doc_line_RowClass }>());
export const deletePNS = createAction('[Draft: PNS] Delete PNS', props<{ guid: string}>());
export const resetPNS = createAction('[Draft: PNS] Reset');
export const resetPNSForEdit = createAction('[Draft: PNS] Reset PNS for Edit', props<{ pns: bl_fi_generic_doc_line_RowClass[] }>() );
export const updateDeliveryBranchAndLocation = createAction('[Draft: PNS] Update Delivery Branch and Location', props<{ deliveryBranch?: string,deliveryBranchCode?: string, deliveryLocation?: string, deliveryLocationCode?: string }>());
export const updateDeliveryBranch = createAction('[Draft: PNS] Update Delivery Branch', props<{ deliveryBranch?: string,deliveryBranchCode?: string }>());
export const updateDeliveryLocation = createAction('[Draft: PNS] Update Delivery Location', props<{ deliveryLocation?: string, deliveryLocationCode?: string }>());
export const updateTrackingID = createAction('[Draft: PNS] Update Tracking ID', props<{ trackingID: string }>());
export const updateDeliveryType = createAction('[Draft: PNS] Update Delivery Type', props<{ deliveryType: string }>());

export const mapToSerialNumberObject = createAction('[Draft: PNS] Map PNS Serial No to serial number object', props<{ line: bl_fi_generic_doc_line_RowClass, postingStatus: string }>())
export const mapToSerialNumberObjectSuccess = createAction('[Draft: PNS] Map PNS Serial No to serial number object Success', props<{ line: bl_fi_generic_doc_line_RowClass }>())
export const validatePNSSerialNo = createAction('[Draft: PNS] Validate PNS Serial No', props<{ line: bl_fi_generic_doc_line_RowClass }>())
export const validatePNSSerialNoSuccess = createAction('[Draft: PNS]Validate PNS Serial No Success', props<{ line: bl_fi_generic_doc_line_RowClass }>())
export const validatePNSNoSerialNo = createAction('[Draft: PNS] Validate PNS No Serial No', props<{ line: bl_fi_generic_doc_line_RowClass }>())