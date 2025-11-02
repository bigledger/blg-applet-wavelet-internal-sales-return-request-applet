import { Action, createReducer, on } from '@ngrx/store';
import { WorkflowActions } from '../actions';
import { WorkflowStates } from '../states';
import { initState, WorkflowState } from '../states/workflow.states';
// import { PrintableFormatActions } from '../actions';

export const WorkflowFeatureKey = 'workflow';

export const WorkflowReducer = createReducer(
  initState,
  on(WorkflowActions.loadCompanySuccess, (state, action) =>
  ({ ...state, loadedCompanyWorkflowListing: action.company })),

  on(WorkflowActions.selectCompanyWorkflow, (state, action) =>
  ({ ...state, selectedCompanyWorkflow: action.companyWorkflow })),

  on(WorkflowActions.resetAgGrid, (state, action) => ({
    ...state, updateAgGrid: false
  })),
  on(WorkflowActions.setRefreshBool, (state, action) =>
  ({ ...state, updateAgGrid: action.refresh })),
  on(WorkflowActions.createCompanyWorkflowSuccess, (state, action) => ({
    ...state, updateAgGrid: true
  })),
  on(WorkflowActions.updateCompanyWorkflowSuccess, (state, action) => ({
    ...state, updateAgGrid: true
  })),
  on(WorkflowActions.deleteCompanyWorkflowSuccess, (state, action) => ({
    ...state, updateAgGrid: true
  })),
);

export function reducer(state: WorkflowState | undefined, action: Action) {
  return WorkflowReducer(state, action);
}
