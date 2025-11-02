import { ViewColumnState } from "projects/shared-utilities/application-controller/store/states/view-col.states";


export interface ViewCacheState {
  internalSalesReturn: ViewColumnState;
  lineItems: ViewColumnState;
  printableFormatSettings: ViewColumnState;
  workflowSettings: ViewColumnState;
  reasonSettings: ViewColumnState;
  manualIntercompanyTransaction: ViewColumnState;
  fileExport: ViewColumnState;
  branchSettings: ViewColumnState;
  settlementMethodSettings: ViewColumnState;
  fileImport: ViewColumnState;
}

export const initialState: ViewCacheState = {
  internalSalesReturn: null,
  lineItems: null,
  printableFormatSettings: null,
  workflowSettings: null,
  reasonSettings: null,
  manualIntercompanyTransaction:null,
  fileExport: null,
  branchSettings: null,
  settlementMethodSettings: null,
  fileImport: null
};
