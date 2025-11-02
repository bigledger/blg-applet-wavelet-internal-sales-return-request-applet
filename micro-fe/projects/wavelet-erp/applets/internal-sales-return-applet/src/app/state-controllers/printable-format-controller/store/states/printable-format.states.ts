import { PrintableFormatContainerModel } from 'blg-akaun-ts-lib';

export interface PrintableFormatState {
  selectedPrintableFormat: PrintableFormatContainerModel;
  draftData: any;
  totalRecords: number;
  updateAgGrid: boolean;
  defaultPrintableFormatGuid: string;
  defaultPrintableFormatName: string;
}

export const initState: PrintableFormatState = {
  selectedPrintableFormat: null,
  draftData: null,
  totalRecords: 0,
  updateAgGrid: false,
  defaultPrintableFormatGuid: null,
  defaultPrintableFormatName: null
};
