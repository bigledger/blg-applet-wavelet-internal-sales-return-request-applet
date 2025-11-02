import { createFeatureSelector } from '@ngrx/store';
import { WorkflowFeatureKey } from '../reducers/workflow.reducers';
import { WorkflowStates } from '../states';
import { WorkflowState } from '../states/workflow.states';

export const selectWorkflowFeature = createFeatureSelector<WorkflowState>(WorkflowFeatureKey);


export const selectDraftData = (state: WorkflowStates) => state.workflow.draftData;
export const selectAgGrid = (state: WorkflowStates) => state.workflow.updateAgGrid;

export const selectListCompanyWorkflow = (state: WorkflowStates) => state.workflow.loadedCompanyWorkflowListing;
export const selectedCompanyWorkflow = (state: WorkflowStates) => state.workflow.selectedCompanyWorkflow;