import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { SubQueryService } from 'blg-akaun-ts-lib';
import { SalesReturnActions, ItemActions } from '../actions';
import { AppConfig } from 'projects/shared-utilities/visa';

@Injectable()
export class ItemEffects {

  apiVisa = AppConfig.apiVisa;

  getInvItem$ = createEffect(() => this.actions$.pipe(
    ofType(SalesReturnActions.selectLineItem),
    map((action) => {
      let query = `
        SELECT inv.guid as requiredGuid
        FROM bl_inv_mst_item_hdr AS inv
        INNER JOIN bl_fi_mst_item_hdr AS fi
        ON inv.guid_fi_mst_item = fi.guid
        WHERE fi.guid = '${action.lineItem.item_guid}'
      `;
      return {
        subquery: query,
        table: 'bl_inv_mst_item_hdr'
      };
    }),
    switchMap(req => this.subQueryService.post(req, AppConfig.apiVisa).pipe(
      map(resolve => {
        if (resolve.data.length) return ItemActions.selectInvItem({ invItem: resolve.data[0] });
        else return ItemActions.noInvItemFound();
      })
    ))
  ));

  constructor(
    private actions$: Actions,
    private subQueryService: SubQueryService) {
  }

}