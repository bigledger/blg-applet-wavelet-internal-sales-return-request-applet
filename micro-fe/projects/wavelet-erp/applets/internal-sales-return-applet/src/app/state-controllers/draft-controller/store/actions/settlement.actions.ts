import { createAction, props } from "@ngrx/store";
import { bl_fi_generic_doc_line_RowClass } from "blg-akaun-ts-lib";

export const addSettlmentInit = createAction('[Draft: Settlement] Add Settlement Init', props<{ settlement: bl_fi_generic_doc_line_RowClass, pageIndex: number }>());
export const addSettlementSuccess = createAction('[Draft: Settlement] Add Settlement Success', props<{ settlement: bl_fi_generic_doc_line_RowClass }>());
export const addSettlementFailed = createAction('[Draft: Settlement] Add Settlement Failed');

export const editSettlementInit = createAction('[Draft: Settlement] Edit Settlement Init', props<{ settlement: bl_fi_generic_doc_line_RowClass, diffAmt: any, pageIndex: number }>());
export const editSettlementSuccess = createAction('[Draft: Settlement] Edit Settlement Success', props<{ settlement: bl_fi_generic_doc_line_RowClass, diffAmt: any }>());
export const editSettlementFailed = createAction('[Draft: Settlement] Edit Settlement Failed');

export const deleteExistingSettlementInit = createAction('[Draft: Settlement] Delete Existing Settlement Init', props<{ settlement: bl_fi_generic_doc_line_RowClass, diffAmt: any }>());

export const deleteSettlementInit = createAction('[Draft: Settlement] Delete Settlement Init', props<{ guid: string, diffAmt: any, pageIndex: number }>());

export const editSettlement = createAction('[Draft: Settlement] Edit Settlement', props<{ settlement: bl_fi_generic_doc_line_RowClass }>());
export const deleteSettlement = createAction('[Draft: Settlement] Delete Settlement', props<{ guid: string, diffAmt: any }>());
export const resetSettlement = createAction('[Draft: Settlement] Reset');
export const resetSettlementForEdit = createAction('[Draft: Settlement] Reset Settlement for Edit', props<{ settlement: bl_fi_generic_doc_line_RowClass[] }>())

export const updateLineTransactionDate = createAction('[Draft: Settlement] Update Line Transaction Date', props<{ transactionDate: any }>());
