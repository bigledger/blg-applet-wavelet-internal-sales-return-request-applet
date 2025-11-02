import { Action, createReducer, on } from "@ngrx/store";
import { InternalSalesReturnActions } from "../../../internal-sales-return-controller/store/actions";
import { AttachmentActions } from "../actions";
import { attachmentAdapter, AttachmentState, initState } from "../states/attachment.states";

export const attachmentReducers = createReducer(
    initState,
    on(AttachmentActions.addAttachment, (state, action) => attachmentAdapter.addOne({
        id: state.ids.length.toString(),
        ...action.attachment
    }, state)),
    on(AttachmentActions.removeAttachment, (state, action) => attachmentAdapter.removeOne(action.id, state)),
    on(AttachmentActions.uploadAttachmentsSuccess, (state, action) => attachmentAdapter.removeAll(state)),
    on(AttachmentActions.deleteAttachmentSuccess, (state, action) => attachmentAdapter.removeAll(state)),
    on(InternalSalesReturnActions.resetDraft, (state, action) => attachmentAdapter.removeAll(state)),
    on(AttachmentActions.resetAttachments, (state, action) => attachmentAdapter.removeAll(state)),
    on(AttachmentActions.selectAttachment, (state, action) => attachmentAdapter.setOne({
        id: "0",
        ...action.attachment
    }, state)),
    on(AttachmentActions.replaceAttachment, (state, action) => attachmentAdapter.setOne({
        id: "0",
        ...action.attachment
    }, state))
)

export function reducers(state: AttachmentState | undefined, action: Action) {
    return attachmentReducers(state, action);
}
