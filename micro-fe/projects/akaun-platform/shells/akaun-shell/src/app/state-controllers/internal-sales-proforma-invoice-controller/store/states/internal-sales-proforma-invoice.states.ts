import {
  bl_fi_generic_doc_line_RowClass,
  EntityContainerModel, GenericDocARAPContainerModel, GenericDocContainerModel, MembershipCardContainerModel, PricingSchemeLinkContainerModel
} from 'blg-akaun-ts-lib';

export interface InternalSalesProformaInvoiceState {
  selectedGRN: GenericDocContainerModel;
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
  updateAgGrid: boolean;
}

export const initState: InternalSalesProformaInvoiceState = {
  selectedGRN: null,
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
  updateAgGrid: false,
};
