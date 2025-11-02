import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BranchSettingsStates } from '../states';
import { BranchSettingsState } from '../states/branch-settings.states';

export const branchSettingsFeatureKey = 'branchSettings';

export const selectBranchSettingsFeature = createFeatureSelector<BranchSettingsState>(branchSettingsFeatureKey);

export const selectGuid = (state: BranchSettingsStates) => state.branchSettings.selectedGuid;
export const selectBranch = (state: BranchSettingsStates) => state.branchSettings.selectedBranch;
export const selectDefaultFormat = (state: BranchSettingsStates) => state.branchSettings.selectedDefaultFormat;
export const selectBranchSettlementMethodList = (state: BranchSettingsStates) => state.branchSettings.branchSettlementMethodList;