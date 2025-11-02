import { createAction, props } from "@ngrx/store";

export const setKOForImport_JSDocNo = createAction(
  "[Column 2 View Model] Set KO For JS Doc No",
  props<{ koForJSDocNo: string }>()
);
export const setKOForImport_SODocNo = createAction(
  "[Column 2 View Model] Set KO For SO Doc No",
  props<{ koForSODocNo: string }>()
);
export const setKOForImport_DODocNo = createAction(
  "[Column 2 View Model] Set KO For DO Doc No",
  props<{ koForDODocNo: string }>()
);
export const setKOForImport_SIDocNo = createAction(
  "[Column 2 View Model] Set KO For SI Doc No",
  props<{ koForSIDocNo: string }>()
);
export const setDeliveryDetailsTab_LoadedBranches = createAction(
  "[Column 2 View Model] Set Delivery Details Tab Loaded Branches",
  props<{ branches: [] }>()
);

export const setDeliveryDetailsTab_LoadedLocations = createAction(
  "[Column 2 View Model] Set Delivery Details Tab Loaded Locations",
  props<{ locations: [] }>()
);

export const setDeliveryDetailsTab_LoadedDeliveryRegions = createAction(
  "[Column 2 View Model] Set Delivery Details Tab Loaded Delivery Regions",
  props<{ deliveryRegions: [] }>()
);
