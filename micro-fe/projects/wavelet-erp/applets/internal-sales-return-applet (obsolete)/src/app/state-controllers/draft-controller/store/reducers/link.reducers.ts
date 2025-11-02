import { Action, createReducer, on } from "@ngrx/store";
import { SalesReturnActions } from "../../../sales-return-controller/store/actions";
import { LinkActions } from "../actions";
import { initState, linkAdapter, LinkState } from "../states/link.states";

export const linkReducers = createReducer(
    initState,
    on(LinkActions.addLink, (state, action) => linkAdapter.addOne({
        guid: state.ids.length,
        ...action.link
    }, state)),
    on(LinkActions.deleteLink, (state, action) => linkAdapter.removeOne(action.guid, state)),
    on(LinkActions.editLink, (state, action) => linkAdapter.upsertOne(action.link, state)),
    on(LinkActions.resetLink, (state, action) => linkAdapter.removeAll(state)),
    on(SalesReturnActions.selectReturnForEdit, (state, action) => linkAdapter.setAll(action.genDoc.bl_fi_generic_doc_link, state)),
    on(SalesReturnActions.resetDraft, (state, action) => linkAdapter.removeAll(state)),
)

export function reducers(state: LinkState | undefined, action: Action) {
    return linkReducers(state, action);
}