export interface Column2ViewModelState {
    KOForJSDocNo:string;
    KOForSODocNo: string;
    KOForDODocNo: string;
    KOForSIDocNo: string;
    deliveryDetailsTab_loadedBranches: [];
    deliveryDetailsTab_loadedLocations: [];
    deliveryDetailsTab_loadedDeliveryRegions: [];
  }
  
  export const initialState: Column2ViewModelState = {
    KOForJSDocNo: null,
    KOForSODocNo: null,
    KOForDODocNo: null,
    KOForSIDocNo: null,
    deliveryDetailsTab_loadedBranches: [],
    deliveryDetailsTab_loadedLocations: [],
    deliveryDetailsTab_loadedDeliveryRegions: [],
  };
  