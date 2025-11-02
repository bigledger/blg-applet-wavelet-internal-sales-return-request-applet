import { EntityState, createEntityAdapter } from '@ngrx/entity';
import {
  bl_fi_entity_credit_term_hdr_RowClass,
  bl_fi_entity_hdr_RowClass, bl_fi_generic_doc_ext_RowClass,
  bl_fi_mst_entity_ext_RowClass, bl_fi_mst_entity_line_RowClass, bl_fi_mst_entity_payment_method_RowClass, CreditLimitContainerModel, CreditTermContainerModel, EntityContainerModel, LabelContainerModel
} from 'blg-akaun-ts-lib';
// import { appletContainerModel, appletHdrRowClass, appletLineRowClass } from '../../../../shared/applet-service-component';

export interface CustomerState extends EntityState<EntityContainerModel> {
  selectedGuid: string;
  selectedEntity: EntityContainerModel;
  selectedLineItem: bl_fi_mst_entity_line_RowClass;
  errorLog: { timeStamp: Date, log: string }[];
  draft: EntityContainerModel;
  pmcDraft: bl_fi_mst_entity_ext_RowClass;
  totalRecords: number;
  // draftPayment: bl
  draftContainer: EntityContainerModel;
  extPayment: any[];
  extTax: any[];
  // extAddress: any[];
  // address: any[];
  hdrAddress: any;
  extContact: any[];
  selectExt: any[];
  onSaveFail: boolean;
  extLogin: any[]; extBranch: any[];
  contactLogin: any[];
  selectContactLine: any[];
  updateAgGrid: boolean;
  extTerm: any[];
  extLimit: any[];
  draftCatContainer: LabelContainerModel;
  selectedCatGuid: any;
  draftTermContainer: CreditTermContainerModel;
  selectedTermGuid: string;
  draftLimitContainer: CreditLimitContainerModel;
  selectedLimitGuid: string;
  currency: any;
  appLoginCreatedBy: any; appLoginModifiedBy: any;
  updatedCat: boolean; itemCategory: any; tempCat: any;
  tempRow: any;
  paymentConfig: bl_fi_mst_entity_payment_method_RowClass[];
  editPaymentConfig: any;
  selectedRow: any;
  selectedToggleMode: boolean,
}

export const customerAdapter = createEntityAdapter<EntityContainerModel>({
  selectId: a => a.bl_fi_mst_entity_hdr.guid.toString()
});

export const initState: CustomerState = customerAdapter.getInitialState({
  selectedGuid: null,
  selectedEntity: null,
  selectedLineItem: null,
  errorLog: [],
  draft: new EntityContainerModel(),
  pmcDraft: new bl_fi_mst_entity_ext_RowClass(),
  totalRecords: 0,
  draftContainer: null,
  extPayment: null,
  extTax: null,
  selectedRow: null,
  hdrAddress: null,
  extContact: null,
  selectExt: null,
  onSaveFail: null,
  extLogin: null, extBranch: null,
  contactLogin: null,
  selectContactLine: null,
  updateAgGrid: false,
  extTerm: null,
  extLimit: null,
  draftCatContainer: null,
  selectedCatGuid: null,
  draftTermContainer: null,
  selectedTermGuid: null,
  draftLimitContainer: null,
  selectedLimitGuid: null,
  currency: null,
  appLoginCreatedBy: null, appLoginModifiedBy: null,
  updatedCat: null, itemCategory: null, tempCat: null,
  tempRow: null,
  paymentConfig: [],
  editPaymentConfig: null,
  selectedToggleMode: false,
});
