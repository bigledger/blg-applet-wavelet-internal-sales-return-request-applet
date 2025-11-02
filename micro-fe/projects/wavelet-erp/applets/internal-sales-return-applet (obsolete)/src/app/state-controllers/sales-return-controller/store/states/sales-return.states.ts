import { bl_fi_generic_doc_line_RowClass, EntityContainerModel, GenericDocARAPContainerModel, GenericDocContainerModel } from 'blg-akaun-ts-lib';

export interface SalesReturnState {
  selectedReturn: GenericDocContainerModel;
  totalRecords: number;
  selectedEntity: EntityContainerModel;
  selectedLineItem: any;
  selectedMode: string;
  selectedPayment: bl_fi_generic_doc_line_RowClass;
  selectedContraDoc: GenericDocContainerModel;
  selectedContraLink: GenericDocARAPContainerModel;
  updateAgGrid: boolean;
}

export const initState: SalesReturnState = {
  selectedReturn: null,
  totalRecords: 0,
  selectedEntity: null,
  selectedLineItem: null,
  selectedMode: null,
  selectedPayment: null,
  selectedContraDoc: null,
  selectedContraLink: null,
  updateAgGrid: false,
};
