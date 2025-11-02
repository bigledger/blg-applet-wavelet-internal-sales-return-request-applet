import { createFeatureSelector, createSelector } from '@ngrx/store';
import { customerFeatureKey } from '../reducers/customer.reducers';
import { CustomerStates } from '../states';
import { customerAdapter, CustomerState } from '../states/customer.states';

export const selectCustomerFeature = createFeatureSelector<CustomerState>(customerFeatureKey);

// export const selectContainer = createSelector(
//   selectCustomerFeature,
//   (entities) => entities.draftContainer
// );
export const selectRowCat = (state: CustomerStates) => state.customer.tempRow;
export const selectTempCat = (state: CustomerStates) => state.customer.tempCat;
export const selectItemCategory = (state: CustomerStates) => state.customer.itemCategory;
export const selectUpdatedCat = (state: CustomerStates) => state.customer.updatedCat;

export const selectAppLoginCreatedBy = (state: CustomerStates) => state.customer.appLoginCreatedBy;
export const selectAppLoginModifiedBy = (state: CustomerStates) => state.customer.appLoginModifiedBy;

export const selectGuid = (state: CustomerStates) => state.customer.selectedGuid;
export const selectEntity = (state: CustomerStates) => state.customer.selectedEntity;
export const selectLineItem = (state: CustomerStates) => state.customer.selectedLineItem;

export const selectContainer = (state: CustomerStates) => state.customer.draftContainer;

export const selectPaymentConfig = (state: CustomerStates) => state.customer.extPayment;
export const selectNewPaymentConfig = (state: CustomerStates) => state.customer.paymentConfig;
export const selectLogin = (state: CustomerStates) => state.customer.extLogin;
export const selectTax = (state: CustomerStates) => state.customer.extTax;
// export const selectAddress = (state: CustomerStates) => state.customerExt.extAddress;
// export const selectAddressExt = (state: CustomerStates) => state.customerExt.extAddress;
export const selectAddress = (state: CustomerStates) => state.customer.hdrAddress;
export const selectBranch = (state: CustomerStates) => state.customer.extBranch;
export const selectContact = (state: CustomerStates) => state.customer.extContact;
export const selectTerm = (state: CustomerStates) => state.customer.extTerm;
export const selectLimit = (state: CustomerStates) => state.customer.extLimit;

export const selectExt = (state: CustomerStates) => state.customer.selectExt;
export const selectAgGrid = (state: CustomerStates) => state.customer.
  updateAgGrid;

export const onSaveFail = (state: CustomerStates) => state.customer.
  onSaveFail;

// if callaggrid=false equal to default and savefail=true
// if callagrid =true equal to savefail false
// default savefail=true

export const selectContactLine = (state: CustomerStates) => state.customer.selectContactLine;

export const selectDraft = (state: CustomerStates) => state.customer.draft;
export const selectPMCDraft = (state: CustomerStates) => state.customer.pmcDraft;

export const selectCatContainer = (state: CustomerStates) => state.customer.draftCatContainer;
export const selectCatGuid = (state: CustomerStates) => state.customer.selectedCatGuid;
//TERM
export const selectTermContainer = (state: CustomerStates) => state.customer.draftTermContainer;
export const selectTermGuid = (state: CustomerStates) => state.customer.selectedTermGuid;
//LIMIT
export const selectLimitContainer = (state: CustomerStates) => state.customer.draftLimitContainer;
export const selectLimitGuid = (state: CustomerStates) => state.customer.selectedLimitGuid;

export const selectCurrency = (state: CustomerStates) => state.customer.currency;
export const selectedRow = (state: CustomerStates) => state.customer.selectedRow;
export const selectToggleMode = (state: CustomerStates) => state.customer.selectedToggleMode;

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = customerAdapter.getSelectors(selectCustomerFeature);
