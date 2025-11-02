import { createFeatureSelector } from '@ngrx/store';
import { DraftStates } from './store/states';

export const draftFeatureKey = 'draft'
export const selectDraftState = createFeatureSelector<DraftStates>(draftFeatureKey);

export { draftReducers } from './store/reducers';
