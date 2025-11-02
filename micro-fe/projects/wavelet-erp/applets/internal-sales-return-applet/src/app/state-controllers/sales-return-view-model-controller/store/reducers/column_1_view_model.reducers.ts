import { Action, createReducer, on } from "@ngrx/store";
import {InternalSalesReturnActions} from "../../../internal-sales-return-controller/store/actions"
import { Column1ViewModelActions } from "../actions";
import {
    initialState,
    Column1ViewModelState,
  } from "../states/column_1_view_model.states";


  export const Column1ViewModelReducer = createReducer(
    initialState,

    on(Column1ViewModelActions.setSalesReturnListing_State, (state, action) => ({
      ...state, salesReturnListingState: action.salesReturnListingState
    })),

    on(
      Column1ViewModelActions.setAdvanceSearch_CustomerField,
      (state, action) => ({
        ...state,
        advanceSearch_Customer_Field: action.customers,
      })
    ),
    on(Column1ViewModelActions.setAdvanceSearch_BranchField, (state, action) => ({
      ...state,
      advanceSearch_Branch_Field: action.branches,
    })),
    on(
      Column1ViewModelActions.setAdvanceSearch_CreationDateFromField,
      (state, action) => ({
        ...state,
        advanceSearch_CreationDateFrom_Field: action.date,
      })
    ),
    on(
      Column1ViewModelActions.setAdvanceSearch_CreationDateToField,
      (state, action) => ({
        ...state,
        advanceSearch_CreationDateTo_Field: action.date,
      })
    ),
    on(
      Column1ViewModelActions.setAdvanceSearch_TransactionDateFromField,
      (state, action) => ({
        ...state,
        advanceSearch_TransactionDateFrom_Field: action.date,
      })
    ),
    on(
      Column1ViewModelActions.setAdvanceSearch_TransactionDateToField,
      (state, action) => ({
        ...state,
        advanceSearch_TransactionDateTo_Field: action.date,
      })
    ),
    on(
      Column1ViewModelActions.setAdvanceSearch_SalesAgentField,
      (state, action) => ({
        ...state,
        advanceSearch_SalesAgent_Field: action.salesAgents,
      })
    ),
    on(Column1ViewModelActions.resetAdvanceSearch, (state, action) => ({
      ...state,
      searchCriteria: null,
      advanceSearch_Customer_Field: [],
      advanceSearch_Branch_Field: [],
      advanceSearch_CreationDateFrom_Field: null,
      advanceSearch_CreationDateTo_Field: null,
      advanceSearch_TransactionDateFrom_Field: null,
      advanceSearch_TransactionDateTo_Field: null
    })),
    on(Column1ViewModelActions.setGenDocListing_PreviousSnapshotGuid, (state, action) => ({
      ...state, genDocListing_PreviousSnapshotGuids: [...state.genDocListing_PreviousSnapshotGuids, action.snapshotGuid]
    })),
    on(Column1ViewModelActions.removeGenDocListing_PreviousSnapshotGuid, (state, action) => ({
      ...state, genDocListing_PreviousSnapshotGuids: [...state.genDocListing_PreviousSnapshotGuids.filter(a=>a!==action.snapshotGuid)]
    })),
    on(InternalSalesReturnActions.loadInternalSalesReturnSuccess, (state, action) => ({
      ...state, genDocListing_SnapshotGuid: action.snapshotGuid
    })),
    on(InternalSalesReturnActions.createInternalSalesReturnSuccess, (state, action) => ({
      ...state, refreshGenDocListing: true
    })),
    on(InternalSalesReturnActions.editInternalSalesReturnSuccess, (state, action) => ({
      ...state, refreshGenDocListing: true
    })),
    on(InternalSalesReturnActions.deleteInternalSalesReturnSuccess, (state, action) => ({
      ...state, refreshGenDocListing: true
    })),
    on(InternalSalesReturnActions.updatePostingStatus, (state, action) => ({
      ...state, refreshGenDocListing: true
    })),
    on(Column1ViewModelActions.resetGenDocLsiting, (state, action) => ({
      ...state, refreshGenDocListing: false
    })),
    on(Column1ViewModelActions.resetGenDocListing_SnapshotGuid, (state, action) => ({
      ...state, genDocListing_SnapshotGuid: null, genDocListing_PreviousSnapshotGuids:[]
    })),
    on(
      Column1ViewModelActions.setAdvanceSearch_OrderByField,
      (state, action) => ({
        ...state,
        advanceSearch_OrderBy_Field: action.orderBy,
      })
    ),
  );
  
  export function reducer(
    state: Column1ViewModelState | undefined,
    action: Action
  ) {
    return Column1ViewModelReducer(state, action);
  }
  