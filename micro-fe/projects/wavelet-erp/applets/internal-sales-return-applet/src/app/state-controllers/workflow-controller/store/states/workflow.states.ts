
import { CompanyWorkflowGendocProcessContainerModel } from "blg-akaun-ts-lib";

export interface WorkflowState {
  loadedCompanyWorkflowListing: CompanyWorkflowGendocProcessContainerModel[];
  selectedCompanyWorkflow: CompanyWorkflowGendocProcessContainerModel;
  draftData: any;
  totalRecords: number;
  updateAgGrid: boolean;
}

export const initState: WorkflowState = {
  loadedCompanyWorkflowListing: null,
  selectedCompanyWorkflow: null,
  draftData: null,
  totalRecords: 0,
  updateAgGrid: false,
};
