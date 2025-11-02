import { createAction, props } from '@ngrx/store';
import { ViewColumnState } from 'projects/shared-utilities/application-controller/store/states/view-col.states';

export const cacheCompany = createAction('[View Cache] Cache Internal Sales Order', props<{cache: ViewColumnState}>());
export const cacheGeneric = createAction('[View Cache] Cache Line Items', props<{cache: ViewColumnState}>());
