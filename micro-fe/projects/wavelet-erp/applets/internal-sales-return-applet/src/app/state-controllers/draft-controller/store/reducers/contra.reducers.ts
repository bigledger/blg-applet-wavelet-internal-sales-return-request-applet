import { Action, createReducer, on } from "@ngrx/store";
import { ContraActions } from "../actions";
import { initState, contraAdapter, ContraState } from "../states/contra.states";
import {InternalSalesReturnActions} from "../../../internal-sales-return-controller/store/actions";

export const contraReducers = createReducer(
    initState,
    on(ContraActions.addContra, (state, action) => contraAdapter.addOne({
        guid: state.ids.length,
        ...action.contra
    }, state)),
    on(ContraActions.deleteContra, (state, action) => contraAdapter.removeOne(action.guid, state)),
    on(ContraActions.resetContra, (state, action) => contraAdapter.removeAll(state)),
    on(InternalSalesReturnActions.addMultipleContraSucess, (state, action) => contraAdapter.removeAll(state)),
    on(ContraActions.loadContraSuccess, (state, action) =>
      contraAdapter.setAll(action.contra.filter(a => a.status === 'ACTIVE'), state)),
)

export function reducers(state: ContraState | undefined, action: Action) {
    return contraReducers(state, action);
}
