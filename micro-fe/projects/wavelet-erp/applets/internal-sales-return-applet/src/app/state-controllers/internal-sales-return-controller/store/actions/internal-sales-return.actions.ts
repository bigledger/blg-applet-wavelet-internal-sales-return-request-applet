import { createAction, props } from "@ngrx/store";
import {
  bl_fi_generic_doc_line_RowClass,
  bl_fi_mst_entity_line_RowClass,
  EntityContainerModel,
  GenericDocARAPContainerModel,
  GenericDocContainerModel,
  JsonDatatypeInterface,
  MembershipCardContainerModel,
  Pagination,
  PricingSchemeLinkContainerModel,
  GenericDocSearchCriteriaDtoModel,
  BranchContainerModel,
  FinancialItemContainerModel,
  AppletSettingFilterItemCategoryLinkContainerModel
} from "blg-akaun-ts-lib";

// export const loadInternalSalesReturnInit = createAction('[Internal Sales Return] Load Init', props<{ request: any }>());
// export const loadInternalSalesReturnSuccess = createAction('[Internal Sales Return Load Success', props<{ totalRecords: number }>());
// export const loadInternalSalesReturnFailed = createAction('[Internal Sales Return] Load Failed', props<{ error: string }>());

export const loadInternalSalesReturnInit = createAction(
  "[Internal Sales Return] Load Init",
  props<{ pagination: Pagination }>()
);
export const loadInternalSalesReturnSuccess = createAction(
  "[Internal Sales Return Load Success",
  props<{ salesReturns: GenericDocContainerModel[]; snapshotGuid?: string }>()
);
export const loadInternalSalesReturnFailed = createAction(
  "[Internal Sales Return] Load Failed",
  props<{ error: string }>()
);
export const searchSalesReturnInit = createAction(
  "[Purchase Order] Search Init",
  props<{ searchDto: GenericDocSearchCriteriaDtoModel }>()
);

export const selectEntity = createAction(
  "[Internal Sales Return] Select Entity",
  props<{
    entity: {
      entity: EntityContainerModel;
      contact: bl_fi_mst_entity_line_RowClass;
    };
  }>()
);
export const selectEntityOnEdit = createAction(
  "[Internal Sales Return] Select Entity On Edit",
  props<{
    entity: {
      entity: EntityContainerModel;
      contact: bl_fi_mst_entity_line_RowClass;
    };
  }>()
);
export const selectMember = createAction(
  "[Internal Sales Return] Select Member",
  props<{ member: MembershipCardContainerModel }>()
);
export const selectShippingAddress = createAction(
  "[Internal Sales Return] Select Shipping Address",
  props<{ shipping_address: JsonDatatypeInterface }>()
);
export const selectBillingAddress = createAction(
  "[Internal Sales Return] Select Billing Address",
  props<{ billing_address: JsonDatatypeInterface }>()
);
export const selectLineItem = createAction(
  "[Internal Sales Return] Select Line Item",
  props<{ lineItem: bl_fi_generic_doc_line_RowClass }>()
);
export const selectSalesReturnForEdit = createAction(
  "[Internal Sales Return] Select Internal Sales Return For Edit",
  props<{ genDoc: GenericDocContainerModel }>()
);
export const selectContraDoc = createAction(
  "[Internal Sales Return] Select Contra Doc",
  props<{ entity: GenericDocContainerModel }>()
);
export const selectContraLink = createAction(
  "[Internal Sales Return] Select Contra Link",
  props<{ link: GenericDocARAPContainerModel }>()
);
export const resetDraft = createAction(
  "[Internal Sales Return] Reset Internal Sales Return"
);
export const selectMode = createAction(
  "[Internal Sales Return] Select Internal Sales Return View Mode",
  props<{ mode: string }>()
);
export const selectSettlement = createAction(
  "[Internal Sales Return] Select Settlement",
  props<{ settlement: bl_fi_generic_doc_line_RowClass }>()
);
export const selectAttachmentGuid = createAction(
  "[Internal Sales Return] Select Attachment",
  props<{ guid: string }>()
);

export const selectPricingSchemeLink = createAction(
  "[Internal Sales Return] Select Pricing Scheme Link",
  props<{ item: any }>()
);
export const selectPricingSchemeLinkSuccess = createAction(
  "[Internal Sales Return] Select Pricing Link Scheme Success",
  props<{ pricing: PricingSchemeLinkContainerModel[] }>()
);
export const selectPricingSchemeLinkFailed = createAction(
  "[Internal Sales Return] Select Pricing Link Scheme Failed",
  props<{ error: string }>()
);

export const selectPricingScheme = createAction(
  "[Internal Sales Return]  Select Pricing Scheme",
  props<{ pricingScheme: any }>()
);
export const addPricingSchemeLinkInit = createAction(
  "[Internal Sales Return]  Add Pricing Scheme Link Init",
  props<{ link: PricingSchemeLinkContainerModel }>()
);
export const addPricingSchemeLinkSuccess = createAction(
  "[Internal Sales Return]  Add Pricing Scheme Link Success"
);
export const addPricingSchemeLinkFailed = createAction(
  "[Internal Sales Return]  Add Pricing Scheme Link Failed",
  props<{ error: string }>()
);
export const editPricingSchemeLinkInit = createAction(
  "[Internal Sales Return]  Edit Pricing Scheme Link Init",
  props<{ link: PricingSchemeLinkContainerModel }>()
);
export const editPricingSchemeLinkSuccess = createAction(
  "[Internal Sales Return]  Edit Pricing Scheme Link Success"
);
export const editPricingSchemeLinkFailed = createAction(
  "[Internal Sales Return]  Edit Pricing Scheme Link Failed",
  props<{ error: string }>()
);

export const editGenLineItemInit = createAction(
  "[Internal Sales Return] Edit Generic Doc Line Item Init"
);
export const editGenLineItemSuccess = createAction(
  "[Internal Sales Return] Edit Generic Doc Line Item Success"
);
export const editGenLineItemFailed = createAction(
  "[Internal Sales Return] Edit Generic Doc Line Item Failed",
  props<{ error: string }>()
);

export const createInternalSalesReturnInit = createAction(
  "[Internal Sales Return] Create Init"
);
export const createInternalSalesReturnSuccess = createAction(
  "[Internal Sales Return] Create Success",
  props<{ hdrGuid: string }>()
);
export const createInternalSalesReturnFailed = createAction(
  "[Internal Sales Return] Create Failed",
  props<{ error: string }>()
);

export const deleteInternalSalesReturnInit = createAction(
  "[Internal Sales Return] Delete Init"
);
export const deleteInternalSalesReturnSuccess = createAction(
  "[Internal Sales Return] Delete Success"
);
export const deleteInternalSalesReturnFailed = createAction(
  "[Internal Sales Return] Delete Failed",
  props<{ error: string }>()
);

export const editInternalSalesReturnInit = createAction(
  "[Internal Sales Return] Edit Init"
);
export const editInternalSalesReturnSuccess = createAction(
  "[Internal Sales Return] Edit Success",
  props<{ hdrGuid: string }>()
);
export const editInternalSalesReturnFailed = createAction(
  "[Internal Sales Return] Edit Failed",
  props<{ error: string }>()
);

export const printJasperPdfInit = createAction(
  "[Internal Sales Return] Print Jasper Pdf Init",
  props<{ guid: string }>()
);
export const printJasperPdfSuccess = createAction(
  "[Internal Sales Return] Print Jasper Pdf Success"
);
export const printJasperPdfFailed = createAction(
  "[Internal Sales Return] Print Jasper Pdf Failed"
);

export const openJasperPdfInit = createAction(
  '[Internal Sales Return] Open Jasper Pdf Init',
  props<{ guid: string }>()
);

export const openJasperPdfSuccess = createAction(
  '[InternalSalesReturn] Open Jasper Pdf Success'
);

export const openJasperPdfFailed = createAction(
  '[InternalSalesReturn] Open Jasper Pdf Failed',
  props<{ error: any }>()
);

export const addContra = createAction(
  "[Internal Sales Return] Add Contra",
  props<{ contraDoc: GenericDocARAPContainerModel }>()
);
export const addContraInit = createAction(
  "[Internal Sales Return] Add Contra Init"
);
export const addContraSuccess = createAction(
  "[Internal Sales Return] Add Contra Success"
);
export const addContraFailed = createAction(
  "[Internal Sales Return] Add Contra Failed",
  props<{ error: string }>()
);

export const editInternalSalesReturnBeforeContraInit = createAction(
  "[Internal Sales Return] Edit Before Contra Init"
);
export const editInternalSalesReturnBeforeContraSuccess = createAction(
  "[Internal Sales Return] Edit Before Contra Success"
);
export const editInternalSalesReturnBeforeContraFailed = createAction(
  "[Internal Sales Return] Edit Before Contra Failed",
  props<{ error: string }>()
);

export const deleteContraInit = createAction(
  "[Internal Sales Return] Delete Contra Init",
  props<{ guid: string, docHdrGuid: string }>()
);
export const deleteContraSuccess = createAction(
  "[Internal Sales Return] Delete Contra Success"
);
export const deleteContraFailed = createAction(
  "[Internal Sales Return] Delete Contra Failed",
  props<{ error: string }>()
);


export const editedGenDoc = createAction('[Internal Sales Return] Edited Generic Doc', props<{ edited: boolean }>());
export const recalculateDocBalance = createAction('[Internal Sales Return] Recalculate Doc Balance');
export const recalculateDocBalanceSuccess = createAction('[Internal Sales Return] Recalculate Doc Balance Success');

export const addMultipleContraInit = createAction(
  "[Internal Sales Return] Add Multiple Contra Init",
  props<{ contra: GenericDocARAPContainerModel[]}>()
);
export const addMultipleContraSucess = createAction(
  "[Internal Sales Return] Add Multiple Contra Success",
  props<{ contra: GenericDocARAPContainerModel[]}>()
);

export const addMultipleContraFailed = createAction(
  "[Internal Sales Return] Add Multiple Contra Failed",
  props<{ error: string}>()
);

export const resetAgGrid = createAction(
  "[Internal Sales Return] Reset Ag Grid Update"
);

export const updatePostingStatus = createAction(
  "[Internal Sales Return] Update Posting Status",
  props<{ status: any; doc: GenericDocContainerModel }>()
);
export const updatePostingStatusSuccess = createAction(
  "[Internal Sales Return] Update Posting Status Success",
  props<{ doc: GenericDocContainerModel }>()
);
export const updatePostingStatusFailed = createAction(
  "[Internal Sales Return] Update Posting Status Failed",
  props<{ error: string }>()
);

export const updateKnockoffListingConfig = createAction(
  "[Internal Sales Return] Update Knockoff Listing Config",
  props<{ settings: any }>()
);

export const creatInternalSalesReturnGenDocLinkSuccess = createAction(
  "[Internal Sales Return] Create Gen Doc Link Success"
);
export const createInternalSalesReturnGenDocLinkFailed = createAction(
  "[Internal Sales Return] Create Gen Doc Link Failed",
  props<{ error: string }>()
);
export const editInternalSalesReturnGenDocLinkSuccess = createAction(
  "[Internal Sales Return] Edit Gen Doc Link Success"
);
export const editInternalSalesReturnGenDocLinkFailed = createAction(
  "[Internal Sales Return] Edit Gen Doc Link Failed",
  props<{ error: string }>()
);
export const editInternalSalesReturnGenDocLinkFinalSuccess = createAction(
  "[Internal Sales Return] Edit Gen Doc Link on Final Success",
  props<{ status?: any; doc?: GenericDocContainerModel }>()
);
export const editInternalSalesReturnGenDocLinkFinalFailed = createAction(
  "[Internal Sales Return] Edit Gen Doc Link on Final Failed",
  props<{ error: string }>()
);
export const setEditMode = createAction(
  "[Internal Sales Return] Set Edit Mode",
  props<{ editMode: boolean }>()
);

export const selectCustomerForSalesReturn = createAction(
  "[Internal Sales Return] Search Select Customer For Sales Return",
  props<{ customerGuid: string }>()
);
export const selectInvoiceForSalesReturn = createAction(
  "[Internal Sales Return] Search Select Inovice For Sales Return",
  props<{ invoiceGuid: string }>()
);

export const loadContraInit = createAction(
  "[Contra] Load Init",
  props<{ request: any }>()
);
export const loadContraSuccess = createAction(
  "[Contra] Load Success",
  props<{ totalRecords: number }>()
);
export const loadContraFailure = createAction(
  "[Contra] Load Failure",
  props<{ error: string }>()
);

export const updateAgGridDone = createAction(
  "[Contra] Update AG Grid Done",
  props<{ done: boolean }>()
);

export const selectTotalRevenue = createAction(
  "[Contra] Select Total Revenue",
  props<{ totalRevenue: any }>()
);
export const selectTotalExpense = createAction(
  "[Contra] Select Total Expense",
  props<{ totalExpense: any }>()
);
export const selectTotalSettlement = createAction(
  "[Contra] Select Total Settlement",
  props<{ totalSettlement: any }>()
);
export const selectTotalContra = createAction(
  "[Contra] Select Contra Amount",
  props<{ totalContra: any }>()
);
export const selectDocOpenAmount = createAction(
  "[Contra] Select Doc Open Amount",
  props<{ docOpenAmount: any }>()
);
export const selectDocArapBalance = createAction(
  "[Contra] Select Doc ARAP Balance",
  props<{ docArapBalance: any }>()
);

export const refreshArapListing = createAction(
  "[Contra] Refresh Listing",
  props<{ refreshArapListing: boolean }>()
);
export const loadArapListingInit = createAction(
  "[Contra] Load Contra Init",
  props<{ pagination: Pagination }>()
);
export const loadArapListingSuccess = createAction(
  "[Contra] Load Contra Success",
  props<{ arapListing: GenericDocARAPContainerModel[] }>()
);
export const loadArapListingFailed = createAction(
  "[Contra] Load Contra Failed",
  props<{ error: string }>()
);

export const discardInit = createAction(
  "[Internal Sales Return] Discard Init",
  props<{ guids: string[]; fromEdit?: boolean }>()
);
export const discardComplete = createAction(
  "[Internal Sales Return] Discard Complete",
  props<{ total: number; successCount: number; failureCount: number }>()
);
export const discardFailure = createAction(
  "[Internal Sales Return] Discard Failure",
  props<{ error: any }>()
);

export const selectGUID = createAction(
  "[Internal Sales Return] Select GUID",
  props<{ guid: string }>()
);

export const updateAfterContra = createAction(
  "[Contra] Update Gen Doc After Contra",
  props<{ genDoc: GenericDocContainerModel }>()
);
export const updateAfterContraFailed = createAction(
  "[Contra] Update Gen Doc After Contra Failed",
  props<{ error: string }>()
);

export const resetContra = createAction("[Contra] Reset Contra");

export const voidSalesReturnInit = createAction(
  "[Internal Sales Return] Void  Init",
  props<{ status: any; doc: GenericDocContainerModel }>()
);
export const voidSalesReturnSuccess = createAction(
  "[Internal Sales Return] Void  Success",
  props<{ doc: any }>()
);
export const voidSalesReturnFailed = createAction(
  "[Internal Sales Return] Void  Failed",
  props<{ error: string }>()
);

export const getTotalRecords = createAction(
  "[Internal Sales Return] Get Total Records Init",
  props<{ searchDto: GenericDocSearchCriteriaDtoModel }>()
);
export const getTotalRecordsSuccess = createAction(
  "[Internal Sales Return] Get Total Records Success",
  props<{ totalRecords: number }>()
);
export const getTotalRecordsFailed = createAction(
  "[Internal Sales Return] Get Total Records Failed",
  props<{ error: string }>()
);

export const createTempSalesReturnInit = createAction(
  "[Internal Sales Return] Create Temp SR Init",
  props<{ doc: GenericDocContainerModel }>()
);
export const createTempSalesReturnSuccess = createAction(
  "[Internal Sales Return] Create Temp SR Success",
  props<{ response: GenericDocContainerModel }>()
);
export const createTempSalesReturnFailed = createAction(
  "[Internal Sales Return] Create Temp SR Failed",
  props<{ error: string }>()
);

export const convertToActiveInit = createAction(
  "[Internal Sales Return] Convert to Active Init"
);
export const convertToActiveSuccess = createAction(
  "[Internal Sales Return]  Convert to Active Success",
  props<{ hdrGuid: string }>()
);
export const convertToActiveFailed = createAction(
  "[Internal Sales Return] Convert to Active Failed",
  props<{ error: string }>()
);
export const resetconvertActionDispatchedState = createAction(
  "[Internal Sales Return] Reset Convert Action Dispatched State"
);

export const editSalesReturnFinalInit = createAction(
  "[Internal Sales Return] Edit and Final Init"
);
export const editSalesReturnFinalSuccess = createAction(
  "[Internal Sales Return] Edit and Final Success",
  props<{ status: any; doc: GenericDocContainerModel, hdrGuid?: string }>()
);
export const editSalesReturnFinalFailed = createAction(
  "[Internal Sales Return] Edit and Final Failed",
  props<{ error: string }>()
);

export const updateContraInit = createAction(
  "[Internal Sales Return] Save Contra Init",
  props<{ txn_date: string }>()
);
export const updateContraSuccess = createAction(
"[Internal Sales Return] Save Contra Success",
// props<{ txn_date: string }>()
);
export const updateContraFailed = createAction(
"[Internal Sales Return]  Save Contra Failed",
props<{ error: string }>()
);

export const printMultipleJasperPdfInit = createAction('[Internal Sales Return] Print Multiple Jasper Pdf Init', props<{ guids: string[], printable: string, preview: boolean, docNumbers: string[] }>());
export const printMultipleJasperPdfSuccess = createAction('[Internal Sales Return] Print Multiple Jasper Pdf Success');
export const printMultipleJasperPdfFailed = createAction('[Internal Sales Return] Print Multiple Jasper Pdf Failed');

export const loadRoundingItemSuccess = createAction('[Internal Sales Return]  Load Rounding Item Success', props<{ item: FinancialItemContainerModel,isRounding: boolean  }>());
export const loadRoundingItemFailed = createAction('[Internal Sales Return]  Load Rounding Item Failed', props<{err: String}>());
export const resetRoundingGroupDiscountItem = createAction('[Internal Sales Return]  Reset Rounding Group Discount Item');
export const loadGroupDiscountItemSuccess = createAction('[Internal Sales Return]  Load Group Discount Item Success', props<{ item: FinancialItemContainerModel }>());
export const loadGroupDiscountItemFailed = createAction('[Internal Sales Return]  Load Group Discount Item Failed', props<{err: String}>());
export const loadBranchCompany = createAction('[Internal Sales Return]  Load Branch Company', props<{ compGuid: any,branchGuid:any, changeDefault: boolean, branchObj: BranchContainerModel }>());
export const loadBranchCompanySuccess = createAction('[Internal Sales Return]  Load Branch Company Success', props<{ branch: any,company:any }>());
export const loadBranchCompanFailed = createAction('[Internal Sales Return]  Load Branch Company Failed', props<{err: String}>());
export const selectEInvoiceEnabled = createAction('[Internal Sales Return] Select E-invoice enabled', props<{ val: boolean}>());
export const selectCOA = createAction('[Internal Sales Return] Select COA', props<{ coa: any}>());
export const selectRoundingItem = createAction('[Internal Sales Return]  Select Rounding Item', props<{ item: FinancialItemContainerModel }>());

export const updateEInvoiceDetails = createAction('[E-Invoice] Update E-Invoice Details', props<{ form: any }>());
export const updateSingleGeneralDetails = createAction('[Internal Sales Return] Update Single General Details', props<{ form: any }>());
export const setIsEinvoiceSubmissionAnotherCustomer = createAction('[E-Invoice] Is E-Invoice Another customer', props<{ isEinvoiceSubmissionAnotherCustomer: boolean}>());
export const setEinvoiceSubmissionAnotherCustomerDetails = createAction('[E-Invoice] Set E-Invoice Another customer details', props<{ einvoiceSubmissionAnotherCustomerDetails: any}>());

export const printEInvoiceJasperPdfInit = createAction('[Internal Sales Return] Print E-Invoice Jasper Pdf Init', props<{ hdr: string }>());
export const printEInvoiceJasperPdfSuccess = createAction('[Internal Sales Return] Print E-Invoice Jasper Pdf Success');
export const printEInvoiceJasperPdfFailed = createAction('[Internal Sales Return] Print E-Invoice Jasper Pdf Failed');

export const selectSettingItemFilter = createAction('[Internal Sales Return] select Settings Item Filter', props<{branch: any}>());
export const selectSettingItemFilterSuccess = createAction('[Internal Sales Return] select Settings Item Filter Success', props<{setting: AppletSettingFilterItemCategoryLinkContainerModel[]}>());
export const selectSettingItemFilterFailed = createAction('[Internal Sales Return] select Settings Item Filter Failed', props<{error: string}>());
export const resetSettingItemFilter = createAction('[Internal Sales Return] Reset Selected Settings Item Filter');
export const saveSettingItemFilter = createAction('[Internal Sales Return] Save Settings Item Filter', props<{form: any, branch: any}>());
export const saveSettingItemFilterSuccess = createAction('[Internal Sales Return] Save Settings Item Filter Success');
export const saveSettingItemFilterFailed = createAction('[Internal Sales Return] Save Settings Item Filter Failed', props<{error: string}>());
export const loadSettingItemFilter = createAction('[Internal Sales Return] load Settings Item Filter');
export const loadSettingItemFilterSuccess = createAction('[Internal Sales Return] load Settings Item Filter Success', props<{setting: AppletSettingFilterItemCategoryLinkContainerModel[]}>());
export const loadSettingItemFilterFailed = createAction('[Internal Sales Return] load Settings Item Filter Failed', props<{error: string}>());

export const resetExpansionPanel = createAction('[Internal Sales Return] Reset Expansion Panel Index', props<{ resetIndex: boolean }>());

export const lockDocument = createAction('[Internal Sales Return] Lock Gen Doc');
export const unlockDocument = createAction('[Internal Sales Return] Unlock Gen Doc', props<{hdrGuid:string}>());
export const unlockDocumentSuccess = createAction('[Internal Sales Return] Unlock Gen Doc Success');
export const unlockDocumentFailed = createAction('[Internal Sales Return] Unlock Gen Doc Failed', props<{error: string}>());

export const updateTotalBin = createAction( '[Internal Sales Return] BinNumber Component Update Total', props<{ totalBin: number }>() );
 
export const selectRowData = createAction('[Internal Sales Return] Select Row Data', props<{rowData: []}>());
export const selectTotalRecords = createAction('[Internal Sales Return] Select Total Records', props<{totalRecords: number }>());
export const selectSearchItemRowData = createAction('[Internal Sales Return] Select Search Item Row Data', props<{rowData: []}>());
export const selectSearchItemTotalRecords = createAction('[Internal Sales Return] Select Search Item Total Records', props<{totalRecords: number }>());
export const selectFirstLoadListing = createAction('[Internal Sales Return] Select First Load Listing', props<{firstLoadListing: boolean }>());

export const einvoiceNtfQueueProcessInit = createAction('[Internal Sales Return] Notification Queue Process Init', props<{ dto: any}>());
export const einvoiceNtfQueueProcessSuccess = createAction('[Internal Sales Return] Notification Queue Process Success');
export const einvoiceNtfQueueProcessFailed = createAction('[Internal Sales Return] Notification Queue Process Failed', props<{error: string}>());

export const updateKOStatus = createAction('[Internal Sales Return] update KO Status', props<{status: string }>());

export const selectEInvoiceMainDocRef = createAction('[Internal Sales Return] Select EInvoice Main Doc Ref', props<{ toIrb: any }>());

export const addGroupDiscount = createAction('[Internal Sales Return] Add Group Discount', props<{discAmount: number, discPercentage: number}>());
export const addGroupDiscountSuccess = createAction('[Internal Sales Return] Add Group Discount Success', props<{discPercentage: number}>());
export const addGroupDiscountFailed = createAction('[Internal Sales Return] Add Group Discount Failed');
export const recalculateGroupDiscount = createAction('[Internal Sales Return] Recalculate Group Discount');
export const recalculateGroupDiscountSuccess = createAction('[Internal Sales Return] Recalculate Group Discount Success');
export const recalculateGroupDiscountFailed = createAction('[Internal Sales Return] Recalculate Group Discount Failed');

export const selectSettlementAdjustment = createAction(
  "[Internal Sales Return] Select Settlement Adjustment",
  props<{ settlementAdjustment: bl_fi_generic_doc_line_RowClass }>()
);

export const selectAdjustSettlement = createAction('[Internal Sales Return] Select Adjust Settlement', props<{guid: any}>());
export const selectAdjustSettlementSuccess = createAction('[Internal Sales Return] Select Adjust Settlement Success', props<{adjustment: any}>());
export const selectAdjustSettlementFailed = createAction('[Internal Sales Return] Select Adjust Settlement Failed');

export const selectEditAdjustment = createAction('[Internal Sales Return] Select Edit Settlement Adjustment', props<{value: boolean}>());

export const selectPricingSchemeGuid = createAction('[Internal Sales Return] Select Pricing Scheme Guid', props<{ guid: any }>());
export const selectChildAttributeLink = createAction('[Internal Sales Return] Select Child Attribute Link', props<{ link: any[] }>());
export const updateChildAttributeLink = createAction('[Internal Sales Return] Update Child Attribute Link', props<{ link: any[] }>());
export const selectChildItem = createAction('[Internal Sales Return] Select Child Item', props<{ child: any[] }>());
export const updateChildItem = createAction('[Internal Sales Return] Update Child Item', props<{ child: any }>());
export const selectChildItemPricingLink = createAction('[Internal Sales Return] Select Child Item Pricing Link', props<{ child: any }>());
export const selectChildItemPricingLinkSuccess = createAction('[Internal Sales Return] Select Child Item Pricing Link Success', props<{ price: any }>());
export const selectChildItemPricingLinkFailed = createAction('[Internal Sales Return] Select Child Item Pricing Link Failed', props<{ error: any }>());
export const selectPricingSchemeHdr = createAction('[Internal Sales Return] Select Pricing Scheme Hdr', props<{ pricingSchemeHdr: any }>());

export const setDelimeter = createAction('[Internal Sales Return] Set Delimeter ', props<{delimeter: any}>());

export const getCurrentCompanyDetails = createAction('[Internal Sales Return] Get Current Company Details Init', props<{ compDetails: any }>());