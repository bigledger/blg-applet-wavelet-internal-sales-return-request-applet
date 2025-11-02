import { ViewColumnState } from "projects/shared-utilities/application-controller/store/states/view-col.states";

export interface ViewCacheState {
  salesReturn: ViewColumnState;
  lineItems: ViewColumnState;
  printableFormatSettings: ViewColumnState;
}

export const initialState: ViewCacheState = {
  salesReturn: null,
  lineItems: null,
  printableFormatSettings: null
};
