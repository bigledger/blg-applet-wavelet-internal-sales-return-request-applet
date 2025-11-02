import { ViewCacheStates } from '../states';

export const selectInternalSalesReturnCache = (state: ViewCacheStates) => state.viewCache.internalSalesReturn;
export const selectLineItemsCache = (state: ViewCacheStates) => state.viewCache.lineItems;
export const selectPrintableFormatSettingsCache = (state: ViewCacheStates) => state.viewCache.printableFormatSettings;
export const selectWorkflowSettingsCache = (state: ViewCacheStates) => state.viewCache.workflowSettings;
export const selectReasonSettingsCache = (state: ViewCacheStates) => state.viewCache.reasonSettings;
export const selectManualIntercompanyTransaction = (state: ViewCacheStates) => state.viewCache.manualIntercompanyTransaction;
export const selectFileExportCache = (state: ViewCacheStates) => state.viewCache.fileExport;
export const selectBranchSettingsCache = (state: ViewCacheStates) => state.viewCache.branchSettings;
export const selectSettlementMethodSettingsCache = (state: ViewCacheStates) => state.viewCache.settlementMethodSettings;
export const selectFileImportCache = (state: ViewCacheStates) => state.viewCache.fileImport;