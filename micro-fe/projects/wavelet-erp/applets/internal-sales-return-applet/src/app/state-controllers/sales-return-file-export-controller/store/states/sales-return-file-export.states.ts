import { GenericDocFileExportContainerModel } from 'blg-akaun-ts-lib';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';

export interface SalesReturnFileExportState extends EntityState<GenericDocFileExportContainerModel> {
  selectedGuid: string;
  selectedReport: GenericDocFileExportContainerModel;
  draftData: any;
  totalRecords: number;
  updateAgGrid: boolean;
  draftTempReportContainer: GenericDocFileExportContainerModel;
}

export const SalesReturnFileExportAdapters: EntityAdapter<GenericDocFileExportContainerModel> = createEntityAdapter<GenericDocFileExportContainerModel>({
  selectId: a => a.bl_fi_generic_doc_file_export.guid.toString()
});

export const initState: SalesReturnFileExportState  = SalesReturnFileExportAdapters.getInitialState(
  {
    selectedGuid: null,
    selectedReport: null,
    draftData: null,
    totalRecords: 0,
    updateAgGrid: false,
    draftTempReportContainer: null
  }
);
