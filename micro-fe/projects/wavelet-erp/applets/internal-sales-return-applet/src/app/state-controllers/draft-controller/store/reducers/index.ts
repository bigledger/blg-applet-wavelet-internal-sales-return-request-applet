import { ActionReducerMap } from '@ngrx/store';
import { DraftStates } from '../states';
import * as fromAttachmentReducers from './attachment.reducers';
import * as fromHDRReducers from './hdr.reducers';
import * as fromLinkReducers from './link.reducers';
import * as fromPNSReducers from './pns.reducers';
import * as fromSettlementReducers from './settlement.reducers';
import * as fromContraReducers from './contra.reducers';
import * as fromSettlementAdjustmentReducers from './settlement-adjustment.reducers';

export const draftReducers: ActionReducerMap<DraftStates> = {
    attachment: fromAttachmentReducers.reducers,
    pns: fromPNSReducers.reducers,
    settlement: fromSettlementReducers.reducers,
    link: fromLinkReducers.reducers,
    hdr: fromHDRReducers.reducers,
    contra: fromContraReducers.reducers,
    settlementAdjustment: fromSettlementAdjustmentReducers.reducers,
}
