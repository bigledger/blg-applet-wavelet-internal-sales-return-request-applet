import { createAction, props } from '@ngrx/store';
import { bl_fi_generic_doc_line_RowClass } from 'blg-akaun-ts-lib';

export const addPNS = createAction('[Draft: PNS] Add PNS', props<{ pns: bl_fi_generic_doc_line_RowClass }>());
export const editPNS = createAction('[Draft: PNS] Edit PNS', props<{ pns: bl_fi_generic_doc_line_RowClass }>());
export const deletePNS = createAction('[Draft: PNS] Delete PNS', props<{ guid: string}>());
export const resetPNS = createAction('[Draft: PNS] Reset');