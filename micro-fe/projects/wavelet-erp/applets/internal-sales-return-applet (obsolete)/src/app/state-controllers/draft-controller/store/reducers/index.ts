import { ActionReducerMap } from '@ngrx/store';
import { DraftStates } from '../states';
import * as fromAttachmentReducers from './attachment.reducers';
import * as fromPNSReducers from './pns.reducers';
import * as fromPaymentReducers from './payment.reducers';
import * as fromLinkReducers from './link.reducers';
import * as fromHDRReducers from './hdr.reducers';

export const draftReducers: ActionReducerMap<DraftStates> = {
    attachment: fromAttachmentReducers.reducers,
    pns: fromPNSReducers.reducers,
    payment: fromPaymentReducers.reducers,
    link: fromLinkReducers.reducers,
    hdr: fromHDRReducers.reducers,
}