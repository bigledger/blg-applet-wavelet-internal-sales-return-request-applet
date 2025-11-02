import { createAction, props } from '@ngrx/store';
import { bl_inv_bin_line_RowClass } from 'blg-akaun-ts-lib';

export const addBins = createAction('[Draft: Bin] Add Bins', props<{bins: bl_inv_bin_line_RowClass[]}>());
export const updateBin = createAction('[Draft: Bin] Update Bin', props<{bin: bl_inv_bin_line_RowClass, id: string}>());
export const resetBins = createAction('[Draft: Bin] Reset Bins');
