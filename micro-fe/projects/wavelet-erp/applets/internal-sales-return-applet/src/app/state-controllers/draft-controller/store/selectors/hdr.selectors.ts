import { createSelector } from "@ngrx/store";
import { selectDraftState } from "../..";

export const selectHdr = createSelector(
  selectDraftState,
  (s1) => s1.hdr
)

export const selectSegment = (state) => state.draft.hdr.guid_segment
export const selectProfitCenter = (state) => state.draft.hdr.guid_profit_center
export const selectProject = (state) => state.draft.hdr.guid_project
export const selectDimension = (state) => state.draft.hdr.guid_dimension
export const selectPurchaserName = (state) => state.draft.hdr.property_json?.purchaser?.purchaserName
export const selectEntityName = (state) => state.draft.hdr.doc_entity_hdr_json?.entityName
export const selectRecipientName = (state) => state.draft.hdr.delivery_entity_json?.shippingInfo?.name
export const selectLocation = (state) => state.draft.hdr.guid_store
export const selectBranchGuid = (state) => state.draft.hdr.guid_branch
