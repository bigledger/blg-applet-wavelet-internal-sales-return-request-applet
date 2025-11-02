import { Action, createReducer, on } from "@ngrx/store";
import { SalesReturnActions } from "../../../sales-return-controller/store/actions";
import { AttachmentActions } from "../actions";
import { attachmentAdapter, AttachmentState, initState } from "../states/atachment.states";

export const attachmentReducers = createReducer(
    initState,
    on(AttachmentActions.addAttachment, (state, action) => attachmentAdapter.addOne({
        id: state.ids.length.toString(),
        ...action.attachment
    }, state)),
    on(AttachmentActions.removeAttachment, (state, action) => attachmentAdapter.removeOne(action.id, state)),
    on(AttachmentActions.uploadAttachmentsSuccess, (state, action) => attachmentAdapter.removeAll(state)),
    on(SalesReturnActions.resetDraft, (state, action) => attachmentAdapter.removeAll(state))
)

export function reducers(state: AttachmentState | undefined, action: Action) {
    return attachmentReducers(state, action);
}