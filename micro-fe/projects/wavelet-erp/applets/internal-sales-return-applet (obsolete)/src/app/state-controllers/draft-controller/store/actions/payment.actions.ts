import { createAction, props } from "@ngrx/store";
import { bl_fi_generic_doc_line_RowClass } from "blg-akaun-ts-lib";

export const addPaymentInit = createAction('[Draft: Payment] Add Payment Init', props<{ payment: bl_fi_generic_doc_line_RowClass, pageIndex: number }>());
export const addPaymentSuccess = createAction('[Draft: Payment] Add Payment Success', props<{ payment: bl_fi_generic_doc_line_RowClass }>());
export const addPaymentFailed = createAction('[Draft: Payment] Add Payment Failed');

export const editPaymentInit = createAction('[Draft: Payment] Edit Payment Init', props<{ payment: bl_fi_generic_doc_line_RowClass, diffAmt: any, pageIndex: number }>());
export const editPaymentSuccess = createAction('[Draft: Payment] Edit Payment Success', props<{ payment: bl_fi_generic_doc_line_RowClass, diffAmt: any }>());
export const editPaymentFailed = createAction('[Draft: Payment] Edit Payment Failed');

export const deleteExistingPaymentInit = createAction('[Draft: Payment] Delete Existing Payment Init', props<{ payment: bl_fi_generic_doc_line_RowClass, diffAmt: any }>());
// export const deleteExistingPaymentSuccess = createAction('[Draft: Payment] Delete Existing Payment Success', props<{ payment: bl_fi_generic_doc_line_RowClass, diffAmt: any }>());
// export const deleteExistingPaymentFailed = createAction('[Draft: Payment] Delete Existing Payment Failed');

export const deletePaymentInit = createAction('[Draft: Payment] Delete Payment Init', props<{ guid: string, diffAmt: any, pageIndex: number }>());
// export const deletePaymentSuccess = createAction('[Draft: Payment] Delete Payment Success', props<{ payment: bl_fi_generic_doc_line_RowClass, diffAmt: any }>());
// export const deletePaymentFailed = createAction('[Draft: Payment] Delete Payment Failed');

export const editPayment = createAction('[Draft: Payment] Edit Payment', props<{ payment: bl_fi_generic_doc_line_RowClass }>());
export const deletePayment = createAction('[Draft: Payment] Delete Payment', props<{ guid: string, diffAmt: any }>());
export const resetPayment = createAction('[Draft: Payment] Reset');