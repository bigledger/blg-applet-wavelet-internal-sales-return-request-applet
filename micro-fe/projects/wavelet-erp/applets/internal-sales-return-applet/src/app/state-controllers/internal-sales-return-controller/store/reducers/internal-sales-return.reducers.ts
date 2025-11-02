import { Action, createReducer, on } from '@ngrx/store';
import { InternalSalesReturnActions } from '../actions';
import { initState, InternalSalesReturnState } from '../states/internal-sales-return.states';

export const InternalSalesReturnFeatureKey = 'internalSalesReturn';

export const InternalSalesReturnReducer = createReducer(
  initState,
  on(InternalSalesReturnActions.updateKOStatus, (state, action) =>
    ({ ...state, koStatus: action.status })),
  on(InternalSalesReturnActions.loadGroupDiscountItemSuccess, (state, action) =>
    ({ ...state, groupDiscountItem: action.item})),
  on(InternalSalesReturnActions.loadRoundingItemSuccess, (state, action) =>
    ({ ...state, roundingItem: action.item, roundingFiveCent: action.isRounding})),
  on(InternalSalesReturnActions.selectCOA, (state, action) => ({
    ...state, selectedCOA:  action.coa
  })),
  on(InternalSalesReturnActions.loadRoundingItemSuccess, (state, action) =>
    ({ ...state, roundingItem: action.item, roundingFiveCent: action.isRounding})),
    on(InternalSalesReturnActions.selectRoundingItem, (state, action) =>
    ({ ...state, roundingItem: action.item})),
  on(InternalSalesReturnActions.selectEInvoiceEnabled, (state, action) => ({
    ...state, eInvoiceEnabled:  action.val
  })),
  on(InternalSalesReturnActions.loadInternalSalesReturnSuccess, (state, action) =>
    ({ ...state, loadedGenDocs: action.salesReturns })),

  on(InternalSalesReturnActions.selectEntity, (state, action) =>
    ({ ...state, selectedEntity: action.entity.entity })),

  on(InternalSalesReturnActions.selectEntityOnEdit, (state, action) =>
    ({ ...state, selectedEntity: action.entity.entity })),

  on(InternalSalesReturnActions.selectMember, (state, action) =>
    ({ ...state, selectedMember: action.member })),

  on(InternalSalesReturnActions.selectLineItem, (state, action) =>
    ({ ...state, selectedLineItem: action.lineItem })),

  on(InternalSalesReturnActions.selectSalesReturnForEdit, (state, action) =>
    ({ ...state, selectedSalesReturn: action.genDoc })),

  on(InternalSalesReturnActions.selectMode, (state, action) =>
    ({ ...state, selectedMode: action.mode })),

  on(InternalSalesReturnActions.selectSettlement, (state, action) =>
    ({ ...state, selectedSettlement: action.settlement })),

  on(InternalSalesReturnActions.selectAttachmentGuid, (state, action) =>
    ({ ...state, selectedAttachmentGuid: action.guid })),

  on(InternalSalesReturnActions.createInternalSalesReturnSuccess, (state, action) => ({
    ...state, refreshGenDocListing: true,
  })),
  on(InternalSalesReturnActions.editInternalSalesReturnSuccess, (state, action) => ({
    ...state, refreshGenDocListing: true, convertActionDispatched: false
  })),
  on(InternalSalesReturnActions.deleteInternalSalesReturnSuccess, (state, action) => ({
    ...state, refreshGenDocListing: true
  })),
  on(InternalSalesReturnActions.resetAgGrid, (state, action) => ({
    ...state, refreshGenDocListing: false
  })),
  on(InternalSalesReturnActions.selectContraDoc, (state, action) => ({
    ...state,
    selectedContraDoc: action.entity
  })),
  on(InternalSalesReturnActions.selectContraLink, (state, action) => ({
    ...state,
    selectedContraLink: action.link
  })),
  on(InternalSalesReturnActions.printJasperPdfInit, (state, action) => ({
    ...state,
    selectedPrintableFormatGuid: action.guid
  })),
  on(InternalSalesReturnActions.openJasperPdfInit, (state, action) => ({
    ...state,
    selectedPrintableFormatGuid: action.guid
  })),
  on(InternalSalesReturnActions.selectPricingScheme, (state, action) => ({
    ...state,
    selectedPricingScheme: action.pricingScheme
  })),

  on(InternalSalesReturnActions.selectPricingSchemeLinkSuccess, (state, action) =>
  ({
    ...state, pricingSchemeLink: action.pricing
  })),

  on(InternalSalesReturnActions.updatePostingStatusSuccess, (state, action) => ({
    ...state, refreshGenDocListing: true, convertActionDispatched: false
  })),
  on(InternalSalesReturnActions.updateKnockoffListingConfig, (state, action) => ({
    ...state,
    knockoffListingConfig: action.settings
  })),
  on(InternalSalesReturnActions.setEditMode, (state, action) => ({
    ...state, editMode: action.editMode
  })),
  on(InternalSalesReturnActions.selectCustomerForSalesReturn, (state, action) => ({
    ...state, selectedCustomerForSalesReturn: action.customerGuid
  })),
  on(InternalSalesReturnActions.selectInvoiceForSalesReturn, (state, action) => ({
    ...state, selectedInvoiceForSalesReturn: action.invoiceGuid
  })),
  on(InternalSalesReturnActions.updateAgGridDone, (state, action) => ({...state, updateContraAgGrid: action.done})),
  on(InternalSalesReturnActions.selectTotalRevenue, (state, action) => ({...state, totalRevenue: action.totalRevenue})),
  on(InternalSalesReturnActions.selectTotalExpense, (state, action) => ({...state, totalExpense: action.totalExpense})),
  on(InternalSalesReturnActions.selectTotalSettlement, (state, action) => ({...state, totalSettlement: action.totalSettlement})),

  on(InternalSalesReturnActions.selectTotalContra, (state, action) => ({...state, totalContra: action.totalContra})),
  on(InternalSalesReturnActions.selectDocOpenAmount, (state, action) => ({...state, docOpenAmount: action.docOpenAmount})),
  on(InternalSalesReturnActions.selectDocArapBalance, (state, action) => ({...state, docArapBalance: action.docArapBalance})),
  on(InternalSalesReturnActions.refreshArapListing, (state, action) => ({...state, refreshArapListing: action.refreshArapListing})),
  on(
    InternalSalesReturnActions.loadArapListingSuccess,
    (state, action) => ({ ...state, loadedArap: action.arapListing })
  ),
  on(InternalSalesReturnActions.discardComplete, (state, action) => ({ ...state, refreshGenDocListing: action.successCount > 0 ? true : false })),
  on(InternalSalesReturnActions.selectGUID, (state, action) => ({
    ...state,
    selectedGuid: action.guid
  })),
  on(InternalSalesReturnActions.resetContra, (state, action) => ({
    ...state,
    totalContraRecords: 0,
    totalContra : 0,
    docOpenAmount : 0,
    docArapBalance : 0,
    loadedArap : null
  })),
  on(InternalSalesReturnActions.voidSalesReturnSuccess, (state, action) => ({
    ...state, refreshGenDocListing: true
  })),
  on(InternalSalesReturnActions.getTotalRecordsSuccess, (state, action) => ({ ...state, totalRecords: action.totalRecords })),
  on(InternalSalesReturnActions.createTempSalesReturnSuccess, (state, action) =>
  ({ ...state, createdTempDoc: action.response, koAttachments:[] })),
  on(InternalSalesReturnActions.convertToActiveSuccess, (state, action) => ({
    ...state, refreshGenDocListing: true, koAttachments: [], convertActionDispatched: true
  })),
  on(InternalSalesReturnActions.resetconvertActionDispatchedState, (state, action) => ({
    ...state, convertActionDispatched: false
  })),
  on(InternalSalesReturnActions.resetDraft, (state) => ({ ...state, convertActionDispatched:false, docLock: false })),
  on(InternalSalesReturnActions.addContra, (state, action) => ({
    ...state, addedContraDoc: action.contraDoc
  })),
  on(InternalSalesReturnActions.setIsEinvoiceSubmissionAnotherCustomer, (state, action) => ({
    ...state, isEinvoiceSubmissionAnotherCustomer: action.isEinvoiceSubmissionAnotherCustomer
  })),
  on(InternalSalesReturnActions.selectSettingItemFilterSuccess, (state, action) =>
    ({...state, selectedItemCategoryFilter:action.setting})),
  on(InternalSalesReturnActions.resetSettingItemFilter, (state, action) =>
    ({...state, selectedItemCategoryFilter:[]})),
  on(InternalSalesReturnActions.resetExpansionPanel, (state, action) => ({
    ...state, resetExpansionPanel: action.resetIndex
  })),
  on(InternalSalesReturnActions.lockDocument, (state, action) => ({
    ...state, docLock: true
  })),
  on(InternalSalesReturnActions.selectRowData, (state, action) =>
    ({...state, rowData: action.rowData})),
  on(InternalSalesReturnActions.selectTotalRecords, (state, action) =>
    ({...state, totalRecords: action.totalRecords})),
  on(InternalSalesReturnActions.selectSearchItemRowData, (state, action) =>
    ({...state, searchItemRowData: action.rowData})),
  on(InternalSalesReturnActions.selectSearchItemTotalRecords, (state, action) =>
    ({...state, searchItemTotalRecords: action.totalRecords})),
  on(InternalSalesReturnActions.selectFirstLoadListing, (state, action) =>
    ({...state, firstLoadListing: action.firstLoadListing})),
  on(InternalSalesReturnActions.addGroupDiscountSuccess, (state, action) => ({
    ...state, groupDiscountPercentage: action.discPercentage
  })),
  on(InternalSalesReturnActions.loadGroupDiscountItemSuccess, (state, action) => ({
    ...state, groupDiscountItem: action.item
  })),
  on(InternalSalesReturnActions.selectSettlementAdjustment, (state, action) => ({
    ...state,
    selectedSettlementAdjustment: action.settlementAdjustment,
  })),
  on(InternalSalesReturnActions.selectAdjustSettlementSuccess, (state, action) => ({...state, settlementMethodAdjustment: action.adjustment})),
  on(InternalSalesReturnActions.selectEditAdjustment, (state, action) => ({...state, isEditAdjustment: action.value})),
  on(InternalSalesReturnActions.selectPricingSchemeGuid, (state, action) => ({
    ...state, pricingSchemeGuid: action.guid
  })),
  on(InternalSalesReturnActions.updateChildItem, (state, action) => {
    const updatedChildItems = state.childItems.map(obj =>
      obj.guid === action.child.guid ? { ...obj, ...action.child } : obj
    );
    return {
      ...state,
      childItems: updatedChildItems
    };
  }),
  on(InternalSalesReturnActions.selectPricingSchemeHdr, (state, action) => ({
    ...state, selectedPricingSchemeHdr: action.pricingSchemeHdr
  })),
  on(InternalSalesReturnActions.selectChildItem, (state, action) => ({
    ...state, childItems: action.child
  })),
  on(InternalSalesReturnActions.setDelimeter, (state, action) => ({
    ...state, delimeter: action.delimeter,
  })),
  on(InternalSalesReturnActions.updateTotalBin, (state, action) => ({
    ...state,
    totalBin: action.totalBin
  })),
  on(InternalSalesReturnActions.getCurrentCompanyDetails, (state, action) => ({
    ...state, compDetails: action.compDetails
  })),
);

export function reducer(state: InternalSalesReturnState | undefined, action: Action) {
  return InternalSalesReturnReducer(state, action);
}
