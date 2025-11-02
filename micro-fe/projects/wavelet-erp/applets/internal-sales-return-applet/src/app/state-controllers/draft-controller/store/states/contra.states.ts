import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { bl_fi_generic_doc_arap_contra_RowClass } from "blg-akaun-ts-lib";

export interface ContraState extends EntityState<bl_fi_generic_doc_arap_contra_RowClass> {}

export const contraAdapter: EntityAdapter<bl_fi_generic_doc_arap_contra_RowClass> = createEntityAdapter<bl_fi_generic_doc_arap_contra_RowClass>({
    selectId: a => a.guid.toString()
});

export const initState: ContraState = contraAdapter.getInitialState();
