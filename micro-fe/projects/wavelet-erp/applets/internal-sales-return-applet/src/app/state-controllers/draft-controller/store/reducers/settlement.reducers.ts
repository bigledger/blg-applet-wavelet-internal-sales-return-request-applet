import { Action, createReducer, on } from "@ngrx/store";
import { InternalSalesReturnActions } from "../../../internal-sales-return-controller/store/actions";
import { SettlementActions } from "../actions";
import { initState, settlementAdapter, settlementState } from "../states/settlement.states";

export const settlementReducers = createReducer(
    initState,
    on(SettlementActions.addSettlementSuccess, (state, action) => settlementAdapter.addOne({
        guid: state.ids.length,
        ...action.settlement
    }, state)),
    on(SettlementActions.deleteSettlement, (state, action) => settlementAdapter.removeOne(action.guid, state)),
    on(SettlementActions.editSettlementSuccess, (state, action) => settlementAdapter.upsertOne(action.settlement, state)),
    on(SettlementActions.resetSettlement, (state, action) => settlementAdapter.removeAll(state)),
    on(InternalSalesReturnActions.selectSalesReturnForEdit, (state, action) =>
        settlementAdapter.setAll(action.genDoc.bl_fi_generic_doc_line.filter(l => l.txn_type === 'STL_MTHD'), state)),
    on(InternalSalesReturnActions.resetDraft, (state, action) => settlementAdapter.removeAll(state)),
    on(SettlementActions.updateLineTransactionDate, (state, action) => {
        return settlementAdapter.updateMany(
          Object.keys(state.entities).map((id) => ({
            id: id, // Convert the id from string to the desired type (e.g., number)
            changes: {
              date_txn : action.transactionDate,
            },
          })),
          state
        );
      }),
)

export function reducers(state: settlementState | undefined, action: Action) {
    return settlementReducers(state, action);
}