import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { bl_fi_generic_doc_line_RowClass } from "blg-akaun-ts-lib";

export interface SettlementAdjustmentState extends EntityState<bl_fi_generic_doc_line_RowClass> {}

export const settlementAdjustmentAdapter: EntityAdapter<bl_fi_generic_doc_line_RowClass> = createEntityAdapter<bl_fi_generic_doc_line_RowClass>({
    selectId: a => a.guid.toString()
});

export const initState: SettlementAdjustmentState = settlementAdjustmentAdapter.getInitialState();

