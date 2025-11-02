import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { SnackBarConstants } from '../../../../models/constants/snack-bar.constants';
import { PaymentActions } from '../actions';
import { HDRSelectors } from '../selectors';
import { DraftStates } from '../states';

@Injectable()
export class PaymentEffects {

    addPayment$ = createEffect(() => this.actions$.pipe(
      ofType(PaymentActions.addPaymentInit),
      withLatestFrom(this.store.select(HDRSelectors.selectHdr)),
      map(([a, b]) => {
          if (parseFloat(<any>a.payment.amount_txn) <= parseFloat(<any>b.amount_open_balance)) {
              this.viewColFacade.showSnackBar(SnackBarConstants.addPaymentSuccess);
              if (a.pageIndex === 1)
                  this.viewColFacade.resetIndex(1);
              else if (a.pageIndex === 2)
                  this.viewColFacade.resetIndex(2);
              return PaymentActions.addPaymentSuccess({ payment: a.payment })
          } else {
              this.viewColFacade.showSnackBar(SnackBarConstants.addPaymentFailed);
              return PaymentActions.addPaymentFailed();
          }
      })
    ));

    savePayment$ = createEffect(() => this.actions$.pipe(
        ofType(PaymentActions.editPaymentInit),
        withLatestFrom(this.store.select(HDRSelectors.selectHdr)),
        map(([a, b]) => {
            if (a.diffAmt <= parseFloat(<any>b.amount_open_balance)) {
                this.viewColFacade.showSnackBar(SnackBarConstants.editPayment);
                if (a.pageIndex === 1)
                    this.viewColFacade.resetIndex(1);
                else if (a.pageIndex === 2)
                    this.viewColFacade.resetIndex(2);
                return PaymentActions.editPaymentSuccess({ payment: a.payment, diffAmt: a.diffAmt })
            } else {
                this.viewColFacade.showSnackBar(SnackBarConstants.addPaymentFailed);
                return PaymentActions.editPaymentFailed();
            }
        })
    ));

    deleteExistingPayment$ = createEffect(() => this.actions$.pipe(
        ofType(PaymentActions.deleteExistingPaymentInit),
        map((a) => {
            this.viewColFacade.showSnackBar(SnackBarConstants.deletePayment);
            this.viewColFacade.resetIndex(2);
            return PaymentActions.editPaymentSuccess({ payment: a.payment, diffAmt: a.diffAmt })
        })
    ));

    deletePayment$ = createEffect(() => this.actions$.pipe(
        ofType(PaymentActions.deletePaymentInit),
        map((a) => {
            this.viewColFacade.showSnackBar(SnackBarConstants.deletePayment);
            if (a.pageIndex === 1)
                this.viewColFacade.resetIndex(1);
            else if (a.pageIndex === 2)
                this.viewColFacade.resetIndex(2);
            return PaymentActions.deletePayment({ guid: a.guid, diffAmt: a.diffAmt })
        })
    ));

    constructor(
        private actions$: Actions,
        private snackBar: MatSnackBar,
        private viewColFacade: ViewColumnFacade,
        private readonly store: Store<DraftStates>
    ) { }
}
