import { createFeatureSelector, createSelector } from '@ngrx/store';
import { InternalSalesReturnFeatureKey } from '../reducers/internal-sales-return.reducers';
import { InternalSalesReturnStates } from '../states';
import { InternalSalesReturnState } from '../states/internal-sales-return.states';
export const selectInternalSalesReturnFeature = createFeatureSelector<InternalSalesReturnState>(InternalSalesReturnFeatureKey);

export const selectTotalRecords = (state: InternalSalesReturnStates) => state.internalSalesReturn.totalRecords;
export const selectSalesReturns = (state: InternalSalesReturnStates) => state.internalSalesReturn.loadedGenDocs;
export const selectSalesReturnDocument = createSelector( selectInternalSalesReturnFeature, (state) => state.selectedSalesReturn );
export const selectEntity = (state: InternalSalesReturnStates) => state.internalSalesReturn.selectedEntity;
export const selectMember = (state: InternalSalesReturnStates) => state.internalSalesReturn.selectedMember;
export const selectLineItem = (state: InternalSalesReturnStates) => state.internalSalesReturn.selectedLineItem;
export const selectSalesReturn = (state: InternalSalesReturnStates) => state.internalSalesReturn.selectedSalesReturn;
export const selectMode = (state: InternalSalesReturnStates) => state.internalSalesReturn.selectedMode;
export const selectSettlement = (state: InternalSalesReturnStates) => state.internalSalesReturn.selectedSettlement;
export const refreshGenDocListing = (state: InternalSalesReturnStates) => state.internalSalesReturn.refreshGenDocListing;
export const selectContraDoc = (state: InternalSalesReturnStates) => state.internalSalesReturn.selectedContraDoc;
export const selectContraLink = (state: InternalSalesReturnStates) => state.internalSalesReturn.selectedContraLink;
export const selectPrintableFormatGuid = (state: InternalSalesReturnStates) => state.internalSalesReturn.selectedPrintableFormatGuid;
export const selectAttachmentGuid = (state: InternalSalesReturnStates) => state.internalSalesReturn.selectedAttachmentGuid;
export const selectPricingScheme = (state: InternalSalesReturnStates) => state.internalSalesReturn.selectedPricingScheme;
export const selectKnockoffListingConfig = (state: InternalSalesReturnStates) => state.internalSalesReturn.knockoffListingConfig;
export const selectEditMode = (state: InternalSalesReturnStates) => state.internalSalesReturn.editMode;
export const selectCustomerForSalesReturn = (state: InternalSalesReturnStates) => state.internalSalesReturn.selectedCustomerForSalesReturn;
export const selectInvoiceForSalesReturn = (state: InternalSalesReturnStates) => state.internalSalesReturn.selectedInvoiceForSalesReturn;
export const updateAgGrid = (state: InternalSalesReturnStates) => state.internalSalesReturn.updateContraAgGrid;
export const selectedTotalRevenue = (state: InternalSalesReturnStates) => state.internalSalesReturn.totalRevenue;
export const selectedTotalExpense = (state: InternalSalesReturnStates) => state.internalSalesReturn.totalExpense;
export const selectedTotalSettlement = (state: InternalSalesReturnStates) => state.internalSalesReturn.totalSettlement;
export const selectedTotalContra = (state: InternalSalesReturnStates) => state.internalSalesReturn.totalContra
export const selectedDocOpenAmount = (state: InternalSalesReturnStates) => state.internalSalesReturn.docOpenAmount;
export const selectedDocArapBalance = (state: InternalSalesReturnStates) => state.internalSalesReturn.docArapBalance;
export const selectRefreshArapValue = (state: InternalSalesReturnStates) => state.internalSalesReturn.refreshArapListing;
export const selectArapListing = (state: InternalSalesReturnStates) => state.internalSalesReturn.loadedArap;
export const selectGuid = (state: InternalSalesReturnStates) => state.internalSalesReturn.selectedGuid;
export const selectInvItem = (state: InternalSalesReturnStates) => state.internalSalesReturn.selectedInvItem;
export const selectIsEinvoiceSubmissionAnotherCustomer  = (state: InternalSalesReturnStates) => state.internalSalesReturn.isEinvoiceSubmissionAnotherCustomer;
export const selectItemCategoryFilter = (state: InternalSalesReturnStates) => state.internalSalesReturn.selectedItemCategoryFilter;
export const selectCategoryGroupList = (state: InternalSalesReturnStates) => state.internalSalesReturn.categoryGroupList;
export const selectKoStatus = (state: InternalSalesReturnStates) => state.internalSalesReturn.koStatus
export const selectSettlementAdjustment = (state: InternalSalesReturnStates) => state.internalSalesReturn.selectedSettlementAdjustment;

export const selectInternalSalesReturns = createSelector(
  selectInternalSalesReturnFeature,
  (state) => state.selectedSalesReturn
);

export const selectTotalBin = createSelector(
  selectInternalSalesReturnFeature,
  (state) => state.totalBin
);

export const getPricingSchemeLinks = createSelector(
  selectInternalSalesReturnFeature,
  (state) => state.pricingSchemeLink
);

export const selectTempDoc = createSelector(
  selectInternalSalesReturnFeature,
  (state) => state.createdTempDoc
);

export const getMyConversionActionState = createSelector(
  selectInternalSalesReturnFeature,
  (state) => state.convertActionDispatched
);

export const selectAddedContraDoc = createSelector(
  selectInternalSalesReturnFeature,
  (state) => state.addedContraDoc
);

export const selectEInvoiceEnabled = createSelector(
  selectInternalSalesReturnFeature,
  (state) => state.eInvoiceEnabled
);

export const selectCOA = createSelector(
  selectInternalSalesReturnFeature,
  (state) => state.selectedCOA
);

export const selectRoundingFiveCent = createSelector(
  selectInternalSalesReturnFeature,
  (state) => state.roundingFiveCent
);

export const selectGroupDiscountItem = createSelector(
  selectInternalSalesReturnFeature,
  (state) => state.groupDiscountItem
);

export const selectGroupDiscountPercentage = createSelector(
  selectInternalSalesReturnFeature,
  (state) => state.groupDiscountPercentage
);

export const selectResetExpansionPanel = createSelector(
  selectInternalSalesReturnFeature,
  (state) => state.resetExpansionPanel
);

export const selectGenDocLock = createSelector(
  selectInternalSalesReturnFeature,
  (state) => state.docLock
);

export const selectRowData = createSelector(
  selectInternalSalesReturnFeature,
  (state) => state.rowData
);
export const selectSearchItemRowData = createSelector(
  selectInternalSalesReturnFeature,
  (state) => state.searchItemRowData
);
export const selectSearchItemTotalRecords = createSelector(
  selectInternalSalesReturnFeature,
  (state) => state.searchItemTotalRecords
);
export const selectFirstLoadListing = createSelector(
  selectInternalSalesReturnFeature,
  (state) => state.firstLoadListing
);

export const selectSettlementMethodAdjustment = createSelector(
  selectInternalSalesReturnFeature,
  (state) => state.settlementMethodAdjustment
);

export const selectEditAdjustment = createSelector(
  selectInternalSalesReturnFeature,
  (state) => state.isEditAdjustment
);

export const selectPricingSchemeGuid = createSelector(
  selectInternalSalesReturnFeature,
  (state) => state.pricingSchemeGuid
);
export const selectSelectedChildAttributeLink = createSelector(
  selectInternalSalesReturnFeature,
  (state) => state.selectedChildAttributeLink
);

export const selectChildItems = createSelector(
  selectInternalSalesReturnFeature,
  (state) => state.childItems
);

export const selectPricingSchemeHdr = createSelector(
  selectInternalSalesReturnFeature,
  (state) => state.selectedPricingSchemeHdr
);

export const selectDelimeter = createSelector(
  selectInternalSalesReturnFeature,
  (state) => state.delimeter
);

export const selectCurrentCompanyDetails = createSelector(
  selectInternalSalesReturnFeature,
  (state) => state.compDetails
);
