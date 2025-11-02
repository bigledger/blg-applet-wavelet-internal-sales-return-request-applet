import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CompanyStates } from '../states';
import { companyAdapters, CompanyState } from '../states/company-states';

export const companyFeatureKey = 'company';

export const selectCompanyFeature = createFeatureSelector<CompanyState>(companyFeatureKey);

// Select GUID can be used for Edit and Delete
export const selectGuid = (state: CompanyStates) => state.company.selectedGuid;
export const selectRequiresUpdate = (state: CompanyStates) => state.company.requiresUpdate;
export const updateAgGrid = (state: CompanyStates) => state.company.updateAgGrid;
// This is an example of how to combine selectors
// export const combinedSelectors = createSelector(
//   selectGuid,
//   selectRemoveState,
//   (guid, onRemove) => ({guid, onRemove})
// )

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = companyAdapters.getSelectors(selectCompanyFeature);
