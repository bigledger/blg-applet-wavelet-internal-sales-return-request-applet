import { BranchContainerModel,BranchDefaultPrintableFormatHdrContainerModel,BranchSettlementMethodContainerModel } from "blg-akaun-ts-lib";
  
export interface BranchSettingsState {
    selectedGuid: any;
    selectedBranch: BranchContainerModel,
    selectedDefaultFormat: BranchDefaultPrintableFormatHdrContainerModel;
    branchSettlementMethodList: any[]
}
  
export const initialState: BranchSettingsState = {
    selectedGuid: null,
    selectedBranch: null,
    selectedDefaultFormat: null,
    branchSettlementMethodList: []
};