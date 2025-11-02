import { ActionReducerMap } from '@ngrx/store';
import { WorkflowStates } from '../states';
import * as fromWorkflowReducers from './workflow.reducers';


export const reducers: ActionReducerMap<WorkflowStates> = {
  workflow: fromWorkflowReducers.reducer
};
