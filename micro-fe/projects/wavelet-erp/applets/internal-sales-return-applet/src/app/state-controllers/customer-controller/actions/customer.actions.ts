import { FormGroup } from '@angular/forms';
import { createAction, props } from '@ngrx/store';
import { bl_fi_entity_credit_limit_hdr_RowClass, bl_fi_mst_comp_branch_location_entity_link_RowCLass, bl_fi_mst_entity_ext_RowClass, bl_fi_mst_entity_line_RowClass, bl_fi_mst_entity_login_subject_link_RowClass, bl_fi_mst_entity_payment_method_RowClass, CreditLimitContainerModel, CreditTermContainerModel, EntityContainerModel, EntityLoginSubjectLinkContainerModel, EntityPaymentMethodContainerModel, LabelContainerModel, LinkSubjectToGroupContainerModel, Pagination } from 'blg-akaun-ts-lib';

export const loadCustomerExtsInit = createAction('[Customer Applet] Load Init', props<{ request: any }>());
export const loadCustomerExtSuccess = createAction('[Customer Applet] Load Success', props<{ totalRecords: number }>());
export const loadCustomerExtFailed = createAction('[Customer Applet] Load Failed', props<{ error: string }>());

export const loadAddress = createAction('[Employee Applet] Load Address', props<{ allAddress: any }>());

export const startDraft = createAction('[Customer Applet] Draft Init');
export const updateDraft = createAction('[Customer Applet] Draft Update',
  props<{ entity?: EntityContainerModel, line?: bl_fi_mst_entity_line_RowClass }>());
export const resetDraft = createAction('[Customer Applet] Draft Reset');

export const selectBranchLine = createAction('[Supplier] Select Contact Line Ext', props<{ ext: any }>());

export const startPMCDraft = createAction('[Customer Applet] PMC Draft Init', props<{ form: FormGroup }>());

export const updatePMCDraft = createAction('[Customer Applet] PMC Draft Update', props<{ initCheck?: FormGroup, record?: any }>());
export const resetPMCDraft = createAction('[Customer Applet] PMC Draft Reset');

export const createContactLogin = createAction('[Customer Applet] Create Login Init', props<{ customerContactLogin: EntityLoginSubjectLinkContainerModel }>());

export const createLogin = createAction('[Customer Applet] Create Login Init', props<{ customerLogin: EntityLoginSubjectLinkContainerModel }>());

export const editBranchLine = createAction('[Supplier] Edit Branch Line', props<{ guid: string, ext: any }>());
export const createBranchLine = createAction('[Supplier] Create Branch Line', props<{ ext: bl_fi_mst_entity_line_RowClass }>());

export const createLoginFailed = createAction('[Customer Applet] Create Login Failed', props<{ error: string }>());

export const createLoginSuccess = createAction('[Customer Applet] Create Login Success', props<{ customerLogin: EntityLoginSubjectLinkContainerModel }>());

export const containerDraftUpdateLoginInit = createAction('[Customer] Update Init Container', props<{ customerLogin: EntityLoginSubjectLinkContainerModel }>());

export const createCustomer = createAction('[Customer Applet] Create Init', props<{ customerExt: EntityContainerModel }>());

export const createCustomerFailed = createAction('[Customer Applet] Create Failed', props<{ error: string }>());

export const createCustomerSuccess = createAction('[Customer Applet] Create Success', props<{ customerExt: EntityContainerModel }>());

export const selectCustomerExtGuid = createAction('[Customer Applet] Select Guid', props<{ guid: string }>());

export const selectCustomerExtEntity = createAction('[Customer Applet] Select Entity', props<{ entity: EntityContainerModel }>());

export const selectCustomerExtLineItem = createAction('[Customer Applet] Select Line Item', props<{ line: bl_fi_mst_entity_line_RowClass }>());

export const selectCustomerEditExt = createAction('[Customer] Select Edit Ext', props<{ ext: any }>());

export const resetCustomerEditExt = createAction('[Customer Applet] Customer Ext Reset');

export const selectContactLine = createAction('[Customer] Select Contact Line Ext', props<{ ext: any }>());

export const createContactLoginExt = createAction('[Customer] Create Login Ext', props<{ ext: any }>());

export const editContactLoginExt = createAction('[Customer] Edit Login Ext', props<{ guid: string, ext: any }>());

export const createLoginExt = createAction('[Customer] Create Login Ext', props<{ ext: any }>());

export const editLoginExt = createAction('[Customer] Edit Login Ext', props<{ guid: string, ext: any }>());

export const createPaymentConfigExt = createAction('[Customer] Create Payment Ext', props<{ ext: bl_fi_mst_entity_ext_RowClass }>());

export const editPaymentConfigExt = createAction('[Customer] Edit Payment Ext', props<{ guid: string, ext: any }>());

export const createCustomerTaxExt = createAction('[Customer] Create Tax Ext', props<{ ext: bl_fi_mst_entity_ext_RowClass }>());

export const editTaxExt = createAction('[Customer] Edit Tax Ext', props<{ guid: string, ext: any }>());

// export const createAddressExt = createAction('[Customer] Create Address Ext', props<{ ext: bl_fi_mst_entity_ext_RowClass }>());
export const createAddress = createAction('[Employee] Create Address', props<{ address: any }>());

// export const editAddressExt = createAction('[Customer] Edit Address Ext', props<{ guid: string, ext: any }>());
export const editAddress = createAction('[Employee] Edit Address', props<{ address: any }>());

export const resetAddress = createAction('[Customer] Reset Address');

export const createContactExt = createAction('[Customer] Create Contact Ext', props<{ ext: bl_fi_mst_entity_line_RowClass }>());

export const editContactLine = createAction('[Customer] Edit Contact Ext', props<{ guid: string, ext: any }>());

export const createContainerDraftInit = createAction('[Customer] Create Container', props<{ entity: any }>());

export const createContainerDraftLoginInit = createAction('[Customer] Create Login Container', props<{ customerLogin: any }>());

export const containerDraftUpdateInit = createAction('[Customer] Update Init Container', props<{ entity: EntityContainerModel }>());
export const containerDraftUpdateFailed = createAction('[Customer] Update Failed Container', props<{ status: boolean }>());
export const containerDraftUpdateSuccess = createAction('[Customer] Update Success Container', props<{ entity: any }>());

export const updateAgGridDone = createAction('[Customer] Update Ag Grid Done', props<{ status: boolean }>());

export const containerCatDraftUpdateInit = createAction('[Customer] Update Category Init Container', props<{ entityCat: LabelContainerModel }>());
export const containerCatDraftUpdateFailed = createAction('[Customer] Update Category Failed Container', props<{ status: boolean }>());
export const containerCatDraftUpdateSuccess = createAction('[Customer] Update Category Success Container', props<{ entityCat: any }>());
export const createCatCustomer = createAction('[Customer Applet] Create Category Init', props<{ customerCat: LabelContainerModel }>());

export const createCatCustomerSuccess = createAction('[Customer Applet] Create Category Success', props<{ customerCat: LabelContainerModel }>());
export const selectCustomerCatGuid = createAction('[Customer Category Applet] Select Category Guid', props<{ guid: string }>());

export const createContainerCatDraftInit = createAction('[Customer Category] Create Category Container', props<{ entity: any }>());

//ACTIONS FOR CUSTOMER EDIT CREDIT TERM AND LIMIT
export const addNewCreditTermSuccess = createAction('[Customer] Create Success', props<{ entity: any }>());
export const addNewCreditTermFailed = createAction('[Customer] Create Failed', props<{ error: string }>());
export const addNewCreditTerm = createAction('[Customer] Create new credit term', props<{ addNewCreditTerm: CreditTermContainerModel }>());

export const addNewCreditLimit = createAction('[Customer] Create new credit limit', props<{ addNewCreditLimit: CreditLimitContainerModel }>());
export const addNewCreditLimitFailed = createAction('[Customer] Create Failed', props<{ error: string }>());
export const addNewCreditLimitSuccess = createAction('[Customer] Create Success', props<{ entity: any }>());

export const createTermExt = createAction('[Customer] Create Term Ext', props<{ ext: bl_fi_mst_entity_ext_RowClass }>());
export const createLimitExt = createAction('[Customer] Create Limit Ext', props<{ ext: bl_fi_mst_entity_ext_RowClass }>());
export const editTermLine = createAction('[Customer] Edit Term Ext', props<{ guid: string, ext: any }>());
export const editLimitLine = createAction('[Customer] Edit Limit Ext', props<{ guid: string, ext: any }>());

//ACTIONS FOR CREDIT LIMIT MODULE
export const containerLimitDraftUpdateInit = createAction('[Customer] Update Limit Init Container', props<{ entityLimit: CreditLimitContainerModel }>());
export const containerLimitDraftUpdateFailed = createAction('[Customer] Update Limit Failed Container', props<{ status: boolean }>());
export const containerLimitDraftUpdateSuccess = createAction('Customer] Update Limit Success Container', props<{ entityLimit: any }>());
export const createLimitCustomer = createAction('[Customer] Create Limit Init', props<{ customerLimit: CreditLimitContainerModel }>());
export const createLimitCustomerSuccess = createAction('[Customer] Create Limit Success', props<{ customerLimit: CreditLimitContainerModel }>());
export const selectCustomerLimitGuid = createAction('[Customer] Select Limit Guid', props<{ guid: string }>());
export const createContainerLimitDraftInit = createAction('[Customer] Create Limit Container', props<{ entity: any }>());
export const containerDraftLimitUpdateSuccess = createAction('[Customer] Update Success Container', props<{ entityLimit: any }>());

//ACTIONS FOR CREDIT TERM MODULE
export const containerTermDraftUpdateInit = createAction('[Customer] Update Term Init Container', props<{ entityTerm: CreditTermContainerModel }>());
export const containerTermDraftUpdateFailed = createAction('[Customer] Update Term Failed Container', props<{ status: boolean }>());
export const containerTermDraftUpdateSuccess = createAction('[Customer] Update Limit Success Container', props<{ entityTerm: any }>());
export const createTermCustomer = createAction('[Customer] Create Term Init', props<{ customerTerm: CreditTermContainerModel }>());
export const createTermCustomerSuccess = createAction('[Customer] Create Term Success', props<{ customerTerm: CreditTermContainerModel }>());
export const selectCustomerTermGuid = createAction('[Customer] Select Term Guid', props<{ guid: string }>());
export const createContainerTermDraftInit = createAction('[Customer] Create Term Container', props<{ entity: any }>());
export const containerDraftTermUpdateSuccess = createAction('[Customer] Update Success Container', props<{ entityTerm: any }>());

export const getCurrency = createAction('[Employee] Get Currency', props<{ currency: any }>());

export const getCurrencySuccess = createAction('[Employee Applet] Get Currency Success', props<{ currency: any }>());
export const getCurrencyFailed = createAction('[Employee Applet]  Get Currency  Failed', props<{ error: string }>());

export const getAppLoginCreatedBy
  = createAction('[Item Applet] Get App Login Principle CreatedBy Container Init', props<{ appLoginCreatedBy: any; }>());

export const getAppLoginModifiedBy
  = createAction('[Item Applet] Get App Login Principle AppLogin ModifiedBy Container Init', props<{ appLoginModifiedBy: any; }>());

export const itemCategory = createAction('[Item Applet] Get Item Category Container', props<{ category: any, updated: boolean }>());

export const addNewPaymentConfig = createAction('[Payment Config] Add New Payment Config', props<{ paymentConfig: bl_fi_mst_entity_payment_method_RowClass }>());
export const createNewPaymentConfig = createAction('[Payment Config] Create New Payment Config', props<{ model: EntityPaymentMethodContainerModel }>());
export const createNewPaymentConfigSuccess = createAction('[Payment Config] Create New Payment Config Success', props<{ model: EntityPaymentMethodContainerModel[] }>());
export const createNewPaymentConfigFail = createAction('[Payment Config] Create New Payment Config Fail', props<{ error: string }>());

export const selectEditPaymentConfig = createAction('[Payment Config] Select Payment Config for Edit', props<{ paymentConfig: any }>());
export const editSelectedPaymentConfig = createAction('[Payment Config] Edit Payment Config', props<{ paymentConfig: EntityPaymentMethodContainerModel }>());
export const editSelectedPaymentConfigSuccess = createAction('[Payment Config] Edit Payment Config Success', props<{ paymentConfig: EntityPaymentMethodContainerModel }>());
export const editSelectedPaymentConfigFail = createAction('[Payment Config] Edit Payment Config Fail', props<{ error: string }>());

export const selectedRow = createAction('[Customer Applet] Selected Row', props<{ row: any[] }>())

export const selectToggleMode = createAction('[Customer Applet] Toggle Mode Trigerred', props<{ SelectedToggleMode: boolean }>());