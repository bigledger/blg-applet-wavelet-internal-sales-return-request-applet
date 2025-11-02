import { FinancialItemContainerModel } from "blg-akaun-ts-lib";

export interface Column4ViewModelState {
  itemDetailsTab_Color: string;
  serialNumberTab_Color: string;
  itemDetailsTab_qtyBaseField_Color: string;
  itemDetailsTab_qtyBaseField_Value: number;
  itemDetailsTab_itemType_Value: string;
  serialNumberTab_ScanTab_SerialNumbersListing: any[];
  fiItemHdrGuid: any;
  pricingSchemeAccessKey: any;
  pricingScheme: any;
  defaultPricingSchemeHdr: any;
  fiItem: FinancialItemContainerModel;
}

export const initialState: Column4ViewModelState = {
  itemDetailsTab_Color: null,
  serialNumberTab_Color: null,
  itemDetailsTab_qtyBaseField_Color: null,
  itemDetailsTab_qtyBaseField_Value: 0,
  itemDetailsTab_itemType_Value: null,
  serialNumberTab_ScanTab_SerialNumbersListing: [],
  fiItemHdrGuid: null,
  pricingSchemeAccessKey: null,
  pricingScheme: null,
  defaultPricingSchemeHdr: null,
  fiItem: null
};
