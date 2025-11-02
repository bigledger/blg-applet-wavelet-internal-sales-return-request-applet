import { createAction, props } from '@ngrx/store';
import { bl_fi_generic_doc_arap_contra_RowClass } from 'blg-akaun-ts-lib';

export const addContra = createAction('[Draft: Contra] Add Contra', props<{ contra: bl_fi_generic_doc_arap_contra_RowClass }>());
export const deleteContra = createAction('[Draft: Contra] Delete Contra', props<{ guid: string}>());
export const resetContra = createAction('[Draft: Contra] Reset');
export const resetContraForEdit = createAction('[Draft: Contra] Reset Contra for Edit', props<{ contra: bl_fi_generic_doc_arap_contra_RowClass[] }>() );
export const loadContraInit = createAction('[Draft: Contra] Load Contra Init', props<{ guid_doc_1_hdr: string}>());
export const loadContraSuccess = createAction('[Draft: Contra] Load Contra Success', props<{ contra: bl_fi_generic_doc_arap_contra_RowClass []}>());
export const loadContraFailed = createAction('[Draft: Contra] Load Contra Failed', props<{ error: string}>());
