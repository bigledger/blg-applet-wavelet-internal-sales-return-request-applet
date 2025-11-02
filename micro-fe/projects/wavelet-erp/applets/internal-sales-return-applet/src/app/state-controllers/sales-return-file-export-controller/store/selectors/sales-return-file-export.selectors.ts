import { SalesReturnFileExportStates } from '../states';

export const selectSalesReturnFileExport = (state: SalesReturnFileExportStates) => state.salesReturnFileExport.selectedReport;
export const selectSalesReturnFileExportGuid = (state: SalesReturnFileExportStates) => state.salesReturnFileExport.selectedGuid;
export const selectDraftData = (state: SalesReturnFileExportStates) => state.salesReturnFileExport.draftData;
export const selectAgGrid = (state: SalesReturnFileExportStates) => state.salesReturnFileExport.updateAgGrid;
export const selectTempSalesReturnFileExportContainer = (state: SalesReturnFileExportStates) => state.salesReturnFileExport.draftTempReportContainer;