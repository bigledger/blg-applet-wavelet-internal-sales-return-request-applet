import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { SnackBarConstants } from '../../../../models/constants/snack-bar.constants';
import { SettlementActions } from '../actions';
import { HDRSelectors } from '../selectors';
import { DraftStates } from '../states';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class SettlementEffects {

    addSettlement$ = createEffect(() => this.actions$.pipe(
        ofType(SettlementActions.addSettlmentInit),
        withLatestFrom(this.store.select(HDRSelectors.selectHdr)),
        map(([a, b]) => {
            if (parseFloat(<any>a.settlement.amount_txn) <= parseFloat(<any>b.amount_open_balance)) {
                this.viewColFacade.showSnackBar(SnackBarConstants.addSettlementSuccess);
                if (a.pageIndex === 1)
                    this.viewColFacade.resetIndex(1);
                else if (a.pageIndex === 2)
                    this.viewColFacade.resetIndex(2);
                return SettlementActions.addSettlementSuccess({ settlement: a.settlement })
            } else {
                this.toaster.error(
                    "Settlement Exceeds Outstanding",
                    "Error",
                    {
                      tapToDismiss: true,
                      progressBar: true,
                      timeOut: 1300,
                      enableHtml: true,
                      closeButton: false,
                    }
                  );
                return SettlementActions.addSettlementFailed();
            }
        })
    ));

    saveSettlement$ = createEffect(() => this.actions$.pipe(
        ofType(SettlementActions.editSettlementInit),
        withLatestFrom(this.store.select(HDRSelectors.selectHdr)),
        map(([a, b]) => {
            if (a.diffAmt <= parseFloat(<any>b.amount_open_balance)) {
                this.viewColFacade.showSnackBar(SnackBarConstants.editSettlement);
                if (a.pageIndex === 1)
                    this.viewColFacade.resetIndex(1);
                else if (a.pageIndex === 2)
                    this.viewColFacade.resetIndex(2);
                return SettlementActions.editSettlementSuccess({ settlement: a.settlement, diffAmt: a.diffAmt })
            } else {
                this.viewColFacade.showSnackBar(SnackBarConstants.addSettlementFailed);
                return SettlementActions.editSettlementFailed();
            }
        })
    ));

    deleteExistingSettlement$ = createEffect(() => this.actions$.pipe(
        ofType(SettlementActions.deleteExistingSettlementInit),
        map((a) => {
            this.viewColFacade.showSnackBar(SnackBarConstants.deleteSettlement);
            this.viewColFacade.resetIndex(2);
            return SettlementActions.editSettlementSuccess({ settlement: a.settlement, diffAmt: a.diffAmt })
        })
    ));

    deleteSettlement$ = createEffect(() => this.actions$.pipe(
        ofType(SettlementActions.deleteSettlementInit),
        map((a) => {
            this.viewColFacade.showSnackBar(SnackBarConstants.deleteSettlement);
            if (a.pageIndex === 1)
                this.viewColFacade.resetIndex(1);
            else if (a.pageIndex === 2)
                this.viewColFacade.resetIndex(2);
            return SettlementActions.deleteSettlement({ guid: a.guid, diffAmt: a.diffAmt })
        })
    ));

    constructor(
        private actions$: Actions,
        private viewColFacade: ViewColumnFacade,
        private readonly store: Store<DraftStates>,
        private toaster: ToastrService
    ) { }
}
