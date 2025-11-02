import { createAction, props } from '@ngrx/store';
import { PrintableFormatContainerModel } from 'blg-akaun-ts-lib';

export const loadPrintableFormatInit = createAction('[Printable Format] Load Init', props<{ request: any }>());
export const loadPrintableFormatSuccess = createAction('[Printable Format] Load Success', props<{ totalRecords: number }>());
export const loadPrintableFormatFailed = createAction('[Printable Format] Load Failed', props<{ error: string }>());

export const createPrintableFormatInit = createAction('[Printable Format] Create Init', props<{ draftData: any }>());
export const createPrintableFormatSuccess = createAction('[Printable Format] Create Success');
export const createPrintableFormatFailed = createAction('[Printable Format] Create Failed', props<{ error: string }>());

export const deletePrintableFormatInit = createAction('[Printable Format] Delete Init');
export const deletePrintableFormatSuccess = createAction('[Printable Format] Delete Success');
export const deletePrintableFormatFailed = createAction('[Printable Format] Delete Failed', props<{ error: string }>());

export const editPrintableFormatInit = createAction('[Printable Format] Edit Init', props<{ draftData: any }>());
export const editPrintableFormatSuccess = createAction('[Printable Format] Edit Success');
export const editPrintableFormatFailed = createAction('[Printable Format] Edit Failed', props<{ error: string }>());

export const selectDefaultPrintableFormatInit = createAction('[Printable Format] Select Default Init', props<{ defaultPrintableFormatGuid: string }>());
export const selectDefaultFormatSuccess = createAction('[Printable Format] Select Default Success');
export const selectDefaultFormatFailed = createAction('[Printable Format] Select Default Failed', props<{ error: string }>());

export const selectPrintableFormatForEdit = createAction('[Printable Format] Select Printable Format For Edit', props<{ printableFormat: PrintableFormatContainerModel }>());

export const resetAgGrid = createAction('[Printable Format] Reset Ag Grid Update');
