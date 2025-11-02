import { createSelector } from "@ngrx/store";
import { selectDraftState } from "../..";
import { attachmentAdapter } from "../states/attachment.states";

export const selectAttachmentState = createSelector(
  selectDraftState,
  (s1) => s1.attachment
)

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = attachmentAdapter.getSelectors(selectAttachmentState);