import { PrintableFormatContainerModel } from 'blg-akaun-ts-lib';

export interface PrintableFormatState {
  selectedPrintableFormat: PrintableFormatContainerModel;
  draftData: any;
  defaultPrintableFormatGuid: string,
  totalRecords: number;
  updateAgGrid: boolean;
}

export const initState: PrintableFormatState = {
  selectedPrintableFormat: null,
  draftData: null,
  defaultPrintableFormatGuid: null,
  totalRecords: 0,
  updateAgGrid: false,
};
