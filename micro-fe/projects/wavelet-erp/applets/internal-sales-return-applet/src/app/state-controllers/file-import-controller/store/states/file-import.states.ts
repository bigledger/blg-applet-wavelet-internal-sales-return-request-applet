import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import {
  SalesReturnFileImportContainerModel,
  PurchaseInvoiceFileImportHelperContainerModel
} from 'blg-akaun-ts-lib';

export interface FileImportState {
  selectedFileImportGuid: string;
  selectedEntity: SalesReturnFileImportContainerModel;
  localOperationsCount: number;
  errorLog: { timeStamp: Date; log: string }[];
  requiresUpdate: boolean;
  totalRecord: number;
  selectedHelperGuid: string;
  selectedHelperEntity: PurchaseInvoiceFileImportHelperContainerModel;
  fileImportAllData: any[];
  fileImportErrorData: any[];
}

export const fileImportAdapter: EntityAdapter<SalesReturnFileImportContainerModel> =
  createEntityAdapter<SalesReturnFileImportContainerModel>({
    selectId: (a) => a.bl_fi_internal_sales_return_import_file_hdr.guid.toString(),
  });

export const initState: FileImportState = {
  selectedFileImportGuid: null,
  selectedEntity: null,
  localOperationsCount: 0,
  errorLog: [],
  requiresUpdate: false,
  totalRecord: 0,
  selectedHelperGuid: null,
  selectedHelperEntity: null,
  fileImportAllData: [],
  fileImportErrorData: [],
}; 