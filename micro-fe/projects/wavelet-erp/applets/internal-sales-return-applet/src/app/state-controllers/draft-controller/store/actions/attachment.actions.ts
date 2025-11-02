import { createAction, props } from "@ngrx/store";
import { bl_fi_generic_doc_ext_RowClass } from "blg-akaun-ts-lib";
import { Attachment } from "../../../../models/attachment.model";

export const addAttachment = createAction('[Draft: Attachment] Add Attachment', props<{ attachment: Attachment }>());
export const replaceAttachment = createAction('[Draft: Attachment] Replace Attachment', props<{ attachment: Attachment }>());
export const removeAttachment = createAction('[Draft: Attachment] Remove Attachment', props<{ id: string }>());
export const selectAttachment = createAction('[Draft: Attachment] Select Attachment', props<{ attachment: Attachment }>());
export const resetAttachments = createAction('[Draft: Attachment] Reset Attachments');

export const uploadAttachmentsInit = createAction('[Draft: Attachment] Upload Attachments Init');
export const uploadAttachmentsSuccess = createAction('[Draft: Attachment] Upload Attachments Success', props<{attachment: any}>());
export const uploadAttachmentsFailed = createAction('[Draft: Attachment] Upload Attachments Failed');

export const deleteAttachmentInit = createAction('[Draft: Attachment] Delete Attachments Init');
export const deleteAttachmentSuccess = createAction('[Draft: Attachment] Delete Attachments Success', props<{ ext: bl_fi_generic_doc_ext_RowClass }>());
export const deleteAttachmentFailed = createAction('[Draft: Attachment] Delete Attachments Failed');

export const downloadAttachmentInit = createAction('[Draft: Attachment] Download Attachments Init');
export const downloadAttachmentSuccess = createAction('[Draft: Attachment] Download Attachments Success');
export const downloadAttachmentFailed = createAction('[Draft: Attachment] Download Attachments Failed');

export const uploadSRImportAttachmentsInit = createAction('[Draft: Attachment] Upload SR Import Attachments Init');
export const uploadSRImportAttachmentsSuccess = createAction('[Draft: Attachment] Upload SR Import Attachments Success', props<{attachment: any}>());
export const uploadSRImportAttachmentsFailed = createAction('[Draft: Attachment] Upload SR Import Attachments Failed');
