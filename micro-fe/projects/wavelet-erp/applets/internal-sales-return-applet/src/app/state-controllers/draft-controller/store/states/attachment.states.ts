import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Attachment } from "../../../../models/attachment.model";

export interface AttachmentState extends EntityState<Attachment> {}

export const attachmentAdapter: EntityAdapter<Attachment> = createEntityAdapter<Attachment>();

export const initState: AttachmentState = attachmentAdapter.getInitialState();