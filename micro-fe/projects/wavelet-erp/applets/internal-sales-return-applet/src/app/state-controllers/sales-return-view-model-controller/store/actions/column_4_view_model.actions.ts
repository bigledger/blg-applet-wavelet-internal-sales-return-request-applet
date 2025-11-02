import { createAction, props } from "@ngrx/store";
import { FinancialItemContainerModel } from "blg-akaun-ts-lib";

export const processSerialNumberListing_AddSerialNumber = createAction(
  "[Column 4 View Model] Process Serial Number Listing - Add Serial Number",
  props<{ serialNumberListing: string [] }>()
);

export const processSerialNumberListing_RemoveSerialNumber = createAction(
  "[Column 4 View Model] Process Serial Number Listing - Remove Serial Number",
  props<{ serialNumberListing: any [] }>()
);

export const processUpdateBaseQuantity = createAction(
  "[Column 4 View Model] Process Update Item Base Quantity",
  props<{ baseQuantity: number }>()
);

export const setBaseQuantityFieldColor = createAction(
  "[Column 4 View Model] Set Base Quantity Field Color",
  props<{ color: string }>()
);

export const setSerialNumberTabFieldColor = createAction(
  "[Column 4 View Model] Set Serial Number Tab Color",
  props<{ color: string }>()
);

export const setSerialNumberTab_ScanTab_SerialNumbersListing = createAction(
  "[Column 4 View Model] Set Serial Number Tab Listing",
  props<{ serialNumberListing: string [] }>()
);

export const setItemDetailsTab_qtyBaseField_Value = createAction(
  "[Column 4 View Model] Set Item Base Quantity",
  props<{ baseQuantity: number }>()
);

export const setItemDetailsTab_itemType_Value = createAction(
  "[Column 4 View Model] Set Item Type",
  props<{ itemType: string }>()
);

export const processSerialNumberListing_CheckStatus= createAction(
  "[Column 4 View Model] Process Serial Number Listing - Check Status",
  props<{ serialNumberListing: any  }>()
);

export const processSerialNumberListing_CheckStatusSuccess= createAction(
  "[Column 4 View Model] Process Serial Number Listing - Check Status Success"
);


export const processSerialNumberListing_Reset = createAction(
  "[Column 4 View Model] Process Serial Number Listing - Reset"
);

export const updateSerialNumberTab_ScanTab_SerialNumbersListing = createAction(
  "[Column 4 View Model] Update Serial Number Tab Listing",
  props<{ serialNumberListing: any [] }>()
);

export const processSerialNumberListing_AddSerialNumberSuccess = createAction(
  "[Column 4 View Model] Process Serial Number Listing - Add Serial Number Success"
);

export const processSerialNumberListing_RemoveSerialNumberSuccess = createAction(
  "[Column 4 View Model] Process Serial Number Listing - Remove Serial Number Success"
);

export const processUpdateBaseQuantitySuccess = createAction(
  "[Column 4 View Model] Process Update Item Base Quantity Success"
);

export const processSerialNumberListing_CheckDuplicate= createAction(
  "[Column 4 View Model] Process Serial Number Listing - Check Duplicate"
);


export const setFIItemHdrGuid = createAction(
  "[Column 4 View Model] Set FI Item GUID",
  props<{ fiItemHdrGuid: any }>()
);

export const setPricingSchemeAccessKey = createAction(
  "[Column 4 View Model] Set Pricing Scheme Access Key",
  props<{ pricingSchemeAccessKey: any }>()
);

export const setPricingScheme = createAction(
  "[Column 4 View Model] Set Pricing Scheme",
  props<{ pricingScheme: any }>()
);

export const setDefaultPricingSchemeHdr = createAction(
  "[Column 4 View Model] Set Default Pricing Scheme Hdr",
  props<{ defaultPricingSchemeHdr: any }>()
);

export const setFIItem = createAction(
  "[Column 4 View Model] Set FI Item",
  props<{ fiItem: FinancialItemContainerModel }>()
);

