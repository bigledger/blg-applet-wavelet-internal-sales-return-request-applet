import { createAction, props } from '@ngrx/store';
import { ViewColumnState } from 'projects/shared-utilities/application-controller/store/states/view-col.states';

export const cacheSI = createAction('[View Cache] Cache Sales Return', props<{cache: ViewColumnState}>());
export const cacheLineItems = createAction('[View Cache] Cache Line Items', props<{cache: ViewColumnState}>());
export const cachePrintableFormatSettings = createAction('[View Cache] Cache Printable Format Settings', props<{ cache: ViewColumnState }>());