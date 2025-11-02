import {
  AppletSettingFilterItemCategoryLinkContainerModel,
  bl_fi_generic_doc_line_RowClass,
  EntityContainerModel, GenericDocARAPContainerModel, GenericDocContainerModel, MembershipCardContainerModel, PricingSchemeLinkContainerModel,
  FinancialItemContainerModel,
  LabelListContainerModel
} from 'blg-akaun-ts-lib';

export interface InternalSalesReturnState {
  selectedSalesReturn: GenericDocContainerModel;
  loadedGenDocs: GenericDocContainerModel[];
  totalRecords: number;
  selectedEntity: EntityContainerModel;
  selectedMember: MembershipCardContainerModel,
  selectedLineItem: any;
  selectedPricingScheme: any;
  selectedMode: string;
  selectedSettlement: bl_fi_generic_doc_line_RowClass;
  selectedContraDoc: GenericDocContainerModel;
  selectedContraLink: GenericDocARAPContainerModel;
  selectedPrintableFormatGuid: string;
  selectedAttachmentGuid: string;
  pricingSchemeLink: PricingSchemeLinkContainerModel[];
  knockoffListingConfig: any;
  refreshGenDocListing: boolean;
  editMode: boolean;
  selectedCustomerForSalesReturn: string;
  selectedInvoiceForSalesReturn: string;
  updateContraAgGrid: boolean;
  errorLog: {timeStamp: Date, log: string}[];
  totalContraRecords: number;
  totalRevenue : any;
  totalExpense : any;
  totalSettlement : any;
  totalContra: any;
  docOpenAmount : any;
  docArapBalance : any;
  loadedArap : any;
  refreshArapListing : boolean;
  selectedGuid: string;
  selectedInvItem: any;
  createdTempDoc: GenericDocContainerModel;
  convertActionDispatched: boolean;
  addedContraDoc: GenericDocARAPContainerModel;
  roundingFiveCent: boolean;
  roundingItem: FinancialItemContainerModel;
  groupDiscountItem: FinancialItemContainerModel;
  groupDiscountPercentage: number;
  eInvoiceEnabled: boolean;
  selectedCOA: any;
  isEinvoiceSubmissionAnotherCustomer: boolean;
  intercompanyBranches: any[];
  validIntercompanyBranch: any;
  selectedIntercompanyBranch: any;
  selectedItemCategoryFilter: AppletSettingFilterItemCategoryLinkContainerModel[];
  categoryGroupList: LabelListContainerModel[];
  resetExpansionPanel: boolean;
  docLock:boolean;
  rowData: any[];
  searchItemRowData: any[];
  searchItemTotalRecords: number;
  firstLoadListing: boolean;
  koStatus: string;
  selectedSettlementAdjustment: bl_fi_generic_doc_line_RowClass;
  settlementMethodAdjustment: any;
  isEditAdjustment: boolean;
  pricingSchemeGuid : any;
  childItems: any[];
  selectedChildAttributeLink: any[];
  selectedPricingSchemeHdr: string;
  delimeter: string;
  totalBin: number;
  compDetails: any;
}

export const initState: InternalSalesReturnState = {
  selectedSalesReturn: null,
  loadedGenDocs: null,
  totalRecords: 0,
  selectedEntity: null,
  selectedMember: null,
  selectedLineItem: null,
  selectedPricingScheme: null,
  selectedMode: null,
  selectedSettlement: null,
  selectedContraDoc: null,
  selectedContraLink: null,
  selectedPrintableFormatGuid: null,
  selectedAttachmentGuid: null,
  pricingSchemeLink: null,
  knockoffListingConfig: null,
  refreshGenDocListing: false,
  editMode: false,
  selectedCustomerForSalesReturn: null,
  selectedInvoiceForSalesReturn: null,
  updateContraAgGrid: false,
  errorLog: [],
  totalContraRecords: 0,
  totalRevenue: 0,
  totalExpense: 0,
  totalSettlement: 0,
  totalContra : 0,
  docOpenAmount : 0,
  docArapBalance : 0,
  loadedArap: null,
  refreshArapListing : true,
  selectedGuid: null,
  selectedInvItem: null,
  createdTempDoc: null,
  convertActionDispatched: false,
  addedContraDoc: null,
  roundingFiveCent: null,
  roundingItem: null,
  groupDiscountItem: null,
  groupDiscountPercentage: null,
  eInvoiceEnabled: false,
  selectedCOA: null,
  isEinvoiceSubmissionAnotherCustomer: false,
  intercompanyBranches: [],
  validIntercompanyBranch: null,
  selectedIntercompanyBranch: null,
  selectedItemCategoryFilter: [],
  categoryGroupList: [],
  resetExpansionPanel: null,
  docLock: false,
  rowData: [],
  searchItemRowData: [],
  searchItemTotalRecords: 0,
  firstLoadListing: true,
  koStatus: null,
  selectedSettlementAdjustment: null,
  settlementMethodAdjustment: null,
  isEditAdjustment: false,
  pricingSchemeGuid: null,
  childItems: [],
  selectedChildAttributeLink: [],
  selectedPricingSchemeHdr: null,
  delimeter: null,
  totalBin: 0,
  compDetails: null
};
