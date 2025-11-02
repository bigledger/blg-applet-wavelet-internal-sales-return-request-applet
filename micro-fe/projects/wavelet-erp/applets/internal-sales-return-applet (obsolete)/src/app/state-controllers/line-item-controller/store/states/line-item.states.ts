import {
  bl_fi_generic_doc_line_RowClass,
  GenericDocContainerModel,
} from 'blg-akaun-ts-lib';

export interface LineItemState {
  selectedOrder: GenericDocContainerModel;
  selectedLineItem: bl_fi_generic_doc_line_RowClass;
  selectedInvItem: any;
  selectedBatch: any;
  selectedBin: any;
  totalRecords: number;
  updateAgGrid: boolean;
}

export const initState: LineItemState = {
  selectedOrder: null,
  selectedLineItem: null,
  selectedInvItem: null,
  selectedBatch: null,
  selectedBin: null,
  totalRecords: 0,
  updateAgGrid: false,
};
