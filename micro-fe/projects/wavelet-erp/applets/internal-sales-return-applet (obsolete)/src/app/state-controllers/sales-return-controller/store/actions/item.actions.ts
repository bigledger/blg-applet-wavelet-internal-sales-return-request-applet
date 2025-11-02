import { createAction, props } from '@ngrx/store';
import { bl_inv_bin_hdr_RowClass, bl_inv_batch_hdr_RowClass } from 'blg-akaun-ts-lib';

export const selectInvItem = createAction('[Sales Return] Select Inventory Item', props<{ invItem }>());
export const noInvItemFound = createAction('[Sales Return] No Inventory Item Found');
export const selectSerial = createAction('[Sales Return] Select Serial Number', props<{ serial }>());
export const selectBatch = createAction('[Sales Return] Select Batch Number', props<{ batch: bl_inv_batch_hdr_RowClass }>());
export const selectBin = createAction('[Sales Return] Select Bin Number', props<{ bin: bl_inv_bin_hdr_RowClass }>());