import { Action, createReducer, on } from "@ngrx/store";
import { InternalJobSheetActions } from "../../../internal-job-sheet-controller/store/actions";
import { PaymentActions } from "../actions";
import { initState, paymentAdapter, PaymentState } from "../states/payment.states";

export const paymentReducers = createReducer(
    initState,
    on(PaymentActions.addPaymentSuccess, (state, action) => paymentAdapter.addOne({
        guid: state.ids.length,
        ...action.payment
    }, state)),
    on(PaymentActions.deletePayment, (state, action) => paymentAdapter.removeOne(action.guid, state)),
    on(PaymentActions.editPaymentSuccess, (state, action) => paymentAdapter.upsertOne(action.payment, state)),
    on(PaymentActions.resetPayment, (state, action) => paymentAdapter.removeAll(state)),
    // on(InternalJobSheetActions.editJobSheetInit, (state, action) =>
    //     paymentAdapter.setAll(action.genDoc.bl_fi_generic_doc_line.filter(l => l.txn_type === 'STL_MTHD'), state)),
)

export function reducers(state: PaymentState | undefined, action: Action) {
    return paymentReducers(state, action);
}
