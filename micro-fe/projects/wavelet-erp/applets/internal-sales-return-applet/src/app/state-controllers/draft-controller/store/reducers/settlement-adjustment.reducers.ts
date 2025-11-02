import { Action, createReducer, on } from "@ngrx/store";
import { SettlementAdjustmentActions } from "../actions";
import { initState, settlementAdjustmentAdapter, SettlementAdjustmentState } from "../states/settlement-adjustment.states";
import {InternalSalesReturnActions} from "../../../internal-sales-return-controller/store/actions";

export const settlementAdjustmentReducers = createReducer(
    initState,
    on(SettlementAdjustmentActions.addPaymentSuccess, (state, action) => settlementAdjustmentAdapter.addOne({
        guid: state.ids.length,
        ...action.payment
    }, state)),
    on(SettlementAdjustmentActions.deletePayment, (state, action) => settlementAdjustmentAdapter.removeOne(action.guid, state)),
    on(SettlementAdjustmentActions.editPaymentSuccess, (state, action) => settlementAdjustmentAdapter.upsertOne(action.payment, state)),
    on(SettlementAdjustmentActions.resetPayment, (state, action) => settlementAdjustmentAdapter.removeAll(state)),
    on(InternalSalesReturnActions.selectSalesReturnForEdit, (state, action) =>
        settlementAdjustmentAdapter.setAll(action.genDoc.bl_fi_generic_doc_line.filter(l => l.txn_type === 'STL_MTHD'), state)),
    on(InternalSalesReturnActions.resetDraft, (state, action) => settlementAdjustmentAdapter.removeAll(state)),
    on(SettlementAdjustmentActions.updateLineTransactionDate, (state, action) => {
        return settlementAdjustmentAdapter.updateMany(
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

export function reducers(state: SettlementAdjustmentState | undefined, action: Action) {
    return settlementAdjustmentReducers(state, action);
}
