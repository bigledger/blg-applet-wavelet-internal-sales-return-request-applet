import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { bl_fi_generic_doc_link_RowClass } from "blg-akaun-ts-lib";

export interface LinkState extends EntityState<bl_fi_generic_doc_link_RowClass> {}

export const linkAdapter: EntityAdapter<bl_fi_generic_doc_link_RowClass> = createEntityAdapter<bl_fi_generic_doc_link_RowClass>({
    selectId: a => a.guid.toString()
});

export const initState: LinkState = linkAdapter.getInitialState();
