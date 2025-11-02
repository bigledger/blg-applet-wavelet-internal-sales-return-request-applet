import { createAction, props } from "@ngrx/store";
import { bl_fi_generic_doc_ext_RowClass } from "blg-akaun-ts-lib";
import { Attachment } from "../../../../models/attachment.model";

export const addAttachment = createAction('[Draft: Attachment] Add Attachment', props<{attachment: Attachment}>());
export const removeAttachment = createAction('[Draft: Attachment] Remove Attachment', props<{id: string}>());

export const uploadAttachmentsInit = createAction('[Draft: Attachment] Upload Attachments Init');
export const uploadAttachmentsSuccess = createAction('[Draft: Attachment] Upload Attachments Success',
props<{ext: bl_fi_generic_doc_ext_RowClass[]}>());
export const uploadAttachmentsFailed = createAction('[Draft: Attachment] Upload Attachments Failed');
