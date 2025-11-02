import { createAction, props } from '@ngrx/store';
import { bl_fi_generic_doc_link_RowClass } from 'blg-akaun-ts-lib';

export const addLink = createAction('[Draft: Link] Add Link', props<{ link: bl_fi_generic_doc_link_RowClass }>());
export const editLink = createAction('[Draft: Link] Edit Link', props<{ link: bl_fi_generic_doc_link_RowClass }>());
export const deleteLink = createAction('[Draft: Link] Delete Link', props<{ guid: string}>());
export const resetLink = createAction('[Draft: Link] Reset');
export const resetLinkForEdit = createAction('[Draft: Link] Reset Link for Edit', props<{ link: bl_fi_generic_doc_link_RowClass[] }>());
