import { createAction, props } from '@ngrx/store';
import { ViewColumnState } from 'projects/shared-utilities/application-controller/store/states/view-col.states';

export const cacheInternalSalesReturn = createAction('[View Cache] Cache Internal Sales Return', props<{ cache: ViewColumnState }>());
export const cacheLineItems = createAction('[View Cache] Cache Line Items', props<{ cache: ViewColumnState }>());
export const cachePrintableFormatSettings = createAction('[View Cache] Cache Printable Format Settings', props<{ cache: ViewColumnState }>());
export const cacheWorkflowSettings = createAction('[View Cache] Cache Workflow Settings', props<{ cache: ViewColumnState }>());
export const cacheReasonSettings = createAction('[View Cache] Cache Reason Settings', props<{ cache: ViewColumnState }>());
export const cacheManualIntercompanyTransaction = createAction('[View Cache] Cache Manual Intercompany Transaction', props<{ cache: ViewColumnState }>());
export const cacheFileExport = createAction('[View Cache] Cache File Export', props<{ cache: ViewColumnState }>());
export const cacheBranchSettings = createAction('[View Cache] Cache Branch Settings', props<{cache: ViewColumnState}>());
export const cacheSettlementMethodSettings = createAction('[View Cache] Cache Settlement Method Settings', props<{cache: ViewColumnState}>());
export const cacheFileImport = createAction('[View Cache] Cache File Import', props<{cache: ViewColumnState}>());