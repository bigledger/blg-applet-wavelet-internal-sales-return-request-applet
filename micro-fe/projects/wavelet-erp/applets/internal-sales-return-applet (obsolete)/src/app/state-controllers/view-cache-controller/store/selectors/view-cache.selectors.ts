import { ViewCacheStates } from '../states';

export const selectSICache = (state: ViewCacheStates) => state.viewCache.salesReturn;
export const selectLineItemsCache = (state: ViewCacheStates) => state.viewCache.lineItems;
export const selectPrintableFormatSettingsCache = (state: ViewCacheStates) => state.viewCache.printableFormatSettings;