import * as fromAttachmentStates from './atachment.states';
import * as fromPNSStates from './pns.states';
import * as fromPaymentStates from './payment.states';
import * as fromLinkStates from './link.states';
import { bl_fi_generic_doc_hdr_RowClass } from 'blg-akaun-ts-lib';

export interface DraftStates {
    attachment: fromAttachmentStates.AttachmentState,
    pns: fromPNSStates.PNSState,
    payment: fromPaymentStates.PaymentState,
    link: fromLinkStates.LinkState
    hdr: bl_fi_generic_doc_hdr_RowClass,
}