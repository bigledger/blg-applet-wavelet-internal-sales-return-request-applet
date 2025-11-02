import { ViewColumnState } from "projects/shared-utilities/application-controller/store/states/view-col.states";


export interface ViewCacheState {
  company: ViewColumnState;
  generic: ViewColumnState;
}

export const initialState: ViewCacheState = {
  company: null,
  generic: null
};
