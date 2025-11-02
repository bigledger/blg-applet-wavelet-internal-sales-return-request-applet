import { Action, createReducer, on } from '@ngrx/store';
import { BranchSettingsActions } from '../actions';
import { BranchSettingsStates } from '../states';
import { initialState } from '../states/branch-settings.states';
export const branchSettingsFeatureKey = 'branchSettings';
export const branchSettingsReducer = createReducer(
initialState,
  on(BranchSettingsActions.selectBranchSettlementMethodListSucess, (state, action) => ({...state,  branchSettlementMethodList: action.container})),
  on(BranchSettingsActions.selectDefaultPrintableFormatSucess, (state, action) => ({...state,  selectedDefaultFormat: action.container})),
  on(BranchSettingsActions.selectBranch, (state, action) => {
    state.selectedBranch = action.branch;
    state.selectedGuid = action.branch.bl_fi_mst_branch.guid;
    return state;
  }),
);

export function reducer(state: BranchSettingsStates | undefined, action: Action) {
    return branchSettingsReducer(state.branchSettings, action);
}