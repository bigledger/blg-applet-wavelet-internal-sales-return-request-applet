import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, switchMap } from 'rxjs/operators';
import { InternalSalesReturnService, SubQueryService, FinancialItemService } from 'blg-akaun-ts-lib';
import { LineItemActions } from '../actions';
import { ToastrService } from 'ngx-toastr';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { AppConfig } from 'projects/shared-utilities/visa';

@Injectable()
export class LineItemEffects {

  apiVisa = AppConfig.apiVisa;

  editGenLineItem$ = createEffect(() => this.actions$.pipe(
    ofType(LineItemActions.editGenLineItemInit),
    map((action) => {
      console.log('Edited Gen Doc', action.genDoc);
      return action.genDoc;
    }),
    exhaustMap((d) => this.siService.put(d, this.apiVisa).pipe(
      map((a: any) => {
        this.toastr.success(
          'The Line Item has been updated successfully',
          'Success',
          {
            tapToDismiss: true,
            progressBar: true,
            timeOut: 2000
          }
        );
        this.viewColFacade.updateInstance(0, {
          deactivateList: false
        });
        this.viewColFacade.resetIndex(0);
        return LineItemActions.editGenLineItemSuccess();
      }),
      catchError(err => {
        this.toastr.error(
          err.message,
          'Error',
          {
            tapToDismiss: true,
            progressBar: true,
            timeOut: 2000
          }
        );
        return of(LineItemActions.editGenLineItemFailed({ error: err.message }));
      })
    ))
  ));

  selectOrder$ = createEffect(() => this.actions$.pipe(
    ofType(LineItemActions.selectLineItem),
    exhaustMap(action => this.siService.getByGuid(action.lineItem.generic_doc_hdr_guid.toString(), this.apiVisa).pipe(
      map((a: any) => {
        return LineItemActions.selectOrder({ genDoc: a.data })
      })
    ))
  ));

  getInvItem$ = createEffect(() => this.actions$.pipe(
    ofType(LineItemActions.selectLineItem),
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
    switchMap(req => this.subQueryService.post(req, this.apiVisa).pipe(
      map(resolve => {
        if (resolve.data.length) return LineItemActions.selectInvItem({ invItem: resolve.data[0] });
        else return LineItemActions.noInvItemFound();
      })
    ))
  ));

  constructor(
    private actions$: Actions,
    private siService: InternalSalesReturnService,
    private fiService: FinancialItemService,
    private subQueryService: SubQueryService,
    private toastr: ToastrService,
    private viewColFacade: ViewColumnFacade,
  ) {}
}
