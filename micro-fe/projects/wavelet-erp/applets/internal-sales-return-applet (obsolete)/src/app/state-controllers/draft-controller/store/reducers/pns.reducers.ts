import { Action, createReducer, on } from "@ngrx/store";
import { SalesReturnActions } from "../../../sales-return-controller/store/actions";
import { PNSActions } from "../actions";
import { initState, pnsAdapter, PNSState } from "../states/pns.states";

export const pnsReducers = createReducer(
    initState,
    on(PNSActions.addPNS, (state, action) => pnsAdapter.addOne({
        guid: state.ids.length,
        ...action.pns
    }, state)),
    on(PNSActions.deletePNS, (state, action) => pnsAdapter.removeOne(action.guid, state)),
    on(PNSActions.editPNS, (state, action) => pnsAdapter.upsertOne(action.pns, state)),
    on(PNSActions.resetPNS, (state, action) => pnsAdapter.removeAll(state)),
    on(SalesReturnActions.selectReturnForEdit, (state, action) => 
        pnsAdapter.setAll(action.genDoc.bl_fi_generic_doc_line.filter(l => l.txn_type === 'PNS'), state)),
    on(SalesReturnActions.resetDraft, (state, action) => pnsAdapter.removeAll(state)),
)

export function reducers(state: PNSState | undefined, action: Action) {
    return pnsReducers(state, action);
}