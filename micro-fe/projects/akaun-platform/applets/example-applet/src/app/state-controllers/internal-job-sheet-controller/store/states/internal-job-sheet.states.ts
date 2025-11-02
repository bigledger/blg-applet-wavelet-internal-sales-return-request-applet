import {
  BinModel,
  bl_fi_generic_doc_line_RowClass,
  bl_fi_mst_entity_ext_RowClass,
  EntityContainerModel,
  FinancialItemContainerModel,
  GenericDocARAPContainerModel,
  GenericDocContainerModel
} from 'blg-akaun-ts-lib';

export interface InternalJobSheetState {
  selectedEntity: GenericDocContainerModel;
  totalRecords: number;
  // selectedCustomer: EntityContainerModel;
  selectedCustomer: EntityContainerModel;
  selectedShippingAddress: bl_fi_mst_entity_ext_RowClass;
  selectedBillingAddress: bl_fi_mst_entity_ext_RowClass;
  selectedItem: FinancialItemContainerModel;
  selectedLineItem: bl_fi_generic_doc_line_RowClass;
  selectedPayment: bl_fi_generic_doc_line_RowClass;
  updateAgGrid: boolean;
  selectedBatch: BinModel;
  selectedContraDoc: GenericDocContainerModel;
  selectedContraLink: GenericDocARAPContainerModel;
  selectedJobSheet: GenericDocContainerModel;
}

export const initState: InternalJobSheetState = {
  selectedEntity: null,
  totalRecords: 0,
  selectedCustomer: null,
  selectedShippingAddress: null,
  selectedBillingAddress: null,
  selectedItem: null,
  selectedLineItem: null,
  updateAgGrid: false,
  selectedBatch: null,
  selectedPayment: null,
  selectedContraDoc: null,
  selectedContraLink: null,
  selectedJobSheet:null,
};
