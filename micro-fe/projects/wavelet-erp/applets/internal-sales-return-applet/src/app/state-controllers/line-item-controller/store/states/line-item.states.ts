import {
  bl_fi_generic_doc_line_RowClass,
  GenericDocContainerModel,
  PricingSchemeLinkContainerModel
} from 'blg-akaun-ts-lib';

export interface LineItemState {
  selectedSalesReturn: GenericDocContainerModel;
  selectedLineItem: bl_fi_generic_doc_line_RowClass;
  selectedPricingScheme: any;
  pricingSchemeLink: PricingSchemeLinkContainerModel[];
  totalRecords: number;
  updateAgGrid: boolean;
  rowData: any[];
  selectedGuid: null;
  firstLoadListing: boolean;
}

export const initState: LineItemState = {
  selectedSalesReturn: null,
  selectedLineItem: null,
  selectedPricingScheme: null,
  pricingSchemeLink: null,
  totalRecords: 0,
  updateAgGrid: false,
  rowData: [],
  selectedGuid: null,
  firstLoadListing: true
};
