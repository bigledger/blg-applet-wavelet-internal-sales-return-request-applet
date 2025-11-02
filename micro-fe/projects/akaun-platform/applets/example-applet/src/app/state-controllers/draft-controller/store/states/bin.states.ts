import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { bl_inv_bin_line_RowClass } from 'blg-akaun-ts-lib';

export interface BinState extends EntityState<bl_inv_bin_line_RowClass> {}

export const binAdapter: EntityAdapter<bl_inv_bin_line_RowClass> = createEntityAdapter<bl_inv_bin_line_RowClass>({
    selectId: a => a.guid.toString()
});

export const initState: BinState = binAdapter.getInitialState();
