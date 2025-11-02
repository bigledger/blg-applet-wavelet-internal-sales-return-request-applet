import { createAction, props } from "@ngrx/store";
import { bl_fi_generic_doc_line_RowClass } from "blg-akaun-ts-lib";

export const addPaymentInit = createAction('[Draft: Settlement Adjustment] Add Payment Init', props<{ payment: bl_fi_generic_doc_line_RowClass, pageIndex: number }>());
export const addPaymentSuccess = createAction('[Draft: Settlement Adjustment] Add Payment Success', props<{ payment: bl_fi_generic_doc_line_RowClass }>());
export const addPaymentFailed = createAction('[Draft: Settlement Adjustment] Add Payment Failed');

export const editPaymentInit = createAction('[Draft: Settlement Adjustment] Edit Payment Init', props<{ payment: bl_fi_generic_doc_line_RowClass, diffAmt: any, pageIndex: number }>());
export const editPaymentSuccess = createAction('[Draft: Settlement Adjustment] Edit Payment Success', props<{ payment: bl_fi_generic_doc_line_RowClass, diffAmt: any }>());
export const editPaymentFailed = createAction('[Draft: Settlement Adjustment] Edit Payment Failed');

export const deleteExistingPaymentInit = createAction('[Draft: Settlement Adjustment] Delete Existing Payment Init', props<{ payment: bl_fi_generic_doc_line_RowClass, diffAmt: any }>());

export const deletePaymentInit = createAction('[Draft: Settlement Adjustment] Delete Payment Init', props<{ guid: string, diffAmt: any, pageIndex: number }>());
export const editPayment = createAction('[Draft: Settlement Adjustment] Edit Payment', props<{ payment: bl_fi_generic_doc_line_RowClass }>());
export const deletePayment = createAction('[Draft: Settlement Adjustment] Delete Payment', props<{ guid: string, diffAmt: any }>());

export const resetPayment = createAction('[Draft: Settlement Adjustment] Reset');
export const resetPaymentForEdit = createAction('[Draft: Settlement Adjustment] Reset Payment for Edit', props<{ payment: bl_fi_generic_doc_line_RowClass[] }>() )

export const updateLineTransactionDate = createAction('[Draft: Settlement Adjustment] Update Line Transaction Date', props<{ transactionDate: any }>());
export const adjustSettlement = createAction('[Draft: Settlement Adjustment] Adjust Settlement');
export const adjustSettlementSuccess = createAction('[Draft: Settlement Adjustment] Adjust Settlement Success');
export const adjustSettlementFailed = createAction('[Draft: Settlement Adjustment] Adjust Settlement Failed');
