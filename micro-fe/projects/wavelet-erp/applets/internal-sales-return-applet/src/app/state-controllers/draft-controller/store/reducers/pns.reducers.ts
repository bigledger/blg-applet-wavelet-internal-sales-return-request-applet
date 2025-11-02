import { Action, createReducer, on } from "@ngrx/store";
import { InternalSalesReturnActions } from "../../../internal-sales-return-controller/store/actions";
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
    on(InternalSalesReturnActions.selectSalesReturnForEdit, (state, action) =>
        pnsAdapter.setAll(action.genDoc.bl_fi_generic_doc_line.filter(l => l.txn_type === 'PNS'), state)),
    on(InternalSalesReturnActions.resetDraft, (state, action) => pnsAdapter.removeAll(state)),
    on(PNSActions.updateDeliveryBranchAndLocation, (state, action) => {
        return pnsAdapter.updateMany(
          Object.keys(state.entities).map((id) => ({
            id: id, // Convert the id from string to the desired type (e.g., number)
            changes: {
              delivery_branch_guid: action.deliveryBranch,
              delivery_branch_code: action.deliveryBranchCode,
              delivery_location_guid: action.deliveryLocation,
              delivery_location_code: action.deliveryLocationCode,
            },
          })),
          state
        );
      }),
      on(PNSActions.updateDeliveryBranch, (state, action) => {
        return pnsAdapter.updateMany(
          Object.keys(state.entities).map((id) => ({
            id: id, // Convert the id from string to the desired type (e.g., number)
            changes: {
              delivery_branch_guid: action.deliveryBranch,
              delivery_branch_code: action.deliveryBranchCode,
            },
          })),
          state
        );
      }),
      on(PNSActions.updateDeliveryLocation, (state, action) => {
        return pnsAdapter.updateMany(
          Object.keys(state.entities).map((id) => ({
            id: id, // Convert the id from string to the desired type (e.g., number)
            changes: {
              delivery_location_guid: action.deliveryLocation,
              delivery_location_code: action.deliveryLocationCode,
            },
          })),
          state
        );
      }),
      on(PNSActions.updateTrackingID, (state, action) => {
        return pnsAdapter.updateMany(
          Object.keys(state.entities).map((id) => ({
            id: id, // Convert the id from string to the desired type (e.g., number)
            changes: {
              tracking_id: action.trackingID,
            },
          })),
          state
        );
      }),
      on(PNSActions.updateDeliveryType, (state, action) => {
        return pnsAdapter.updateMany(
          Object.keys(state.entities).map((id) => ({
            id: id, // Convert the id from string to the desired type (e.g., number)
            changes: {
              track_delivery_logic: action.deliveryType,
            },
          })),
          state
        );
      }),
      on(PNSActions.validatePNSSerialNoSuccess, PNSActions.mapToSerialNumberObjectSuccess, (state, action) => pnsAdapter.upsertOne(action.line, state)),
)

export function reducers(state: PNSState | undefined, action: Action) {
    return pnsReducers(state, action);
}