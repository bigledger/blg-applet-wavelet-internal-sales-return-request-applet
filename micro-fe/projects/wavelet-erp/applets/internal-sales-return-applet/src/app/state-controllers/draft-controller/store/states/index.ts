import { bl_fi_generic_doc_hdr_RowClass } from 'blg-akaun-ts-lib';
import * as fromAttachmentStates from './attachment.states';
import * as fromLinkStates from './link.states';
import * as fromPNSStates from './pns.states';
import * as fromSettlementStates from './settlement.states';
import * as fromContraStates from './contra.states';
import * as fromSettlementAdjustmentStates from './settlement-adjustment.states';

export interface DraftStates {
    attachment: fromAttachmentStates.AttachmentState,
    pns: fromPNSStates.PNSState,
    settlement: fromSettlementStates.settlementState,
    link: fromLinkStates.LinkState
    hdr: bl_fi_generic_doc_hdr_RowClass,
    contra: fromContraStates.ContraState,
    settlementAdjustment: fromSettlementAdjustmentStates.SettlementAdjustmentState,
}
