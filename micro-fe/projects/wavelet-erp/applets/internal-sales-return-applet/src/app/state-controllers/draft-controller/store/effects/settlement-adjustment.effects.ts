import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, withLatestFrom, catchError, mergeMap } from 'rxjs/operators';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { SnackBarConstants } from '../../../../models/constants/snack-bar.constants';
import { SettlementAdjustmentActions } from '../actions';
import { HDRSelectors } from '../selectors';
import { DraftStates } from '../states';
import { GenericDocSettlementMethodAdjustmentService, GenericDocSettlementMethodContainerAdjustmentModel, Pagination } from 'blg-akaun-ts-lib';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { AppConfig } from 'projects/shared-utilities/visa';
import { InternalSalesReturnStates } from "../../../internal-sales-return-controller/store/states";
import { InternalSalesReturnSelectors } from "../../../internal-sales-return-controller/store/selectors";
import { SettlementAdjustmentSelectors, SettlementSelectors } from '../selectors';

@Injectable()
export class SettlementAdjustmentEffects {
  private readonly apiVisa = AppConfig.apiVisa;

  adjustSettlement$ = createEffect(() => this.actions$.pipe(
    ofType(SettlementAdjustmentActions.adjustSettlement),
    withLatestFrom(
      this.store.select(SettlementAdjustmentSelectors.selectAll),
      this.store.select(SettlementSelectors.selectAll),
      this.salesReturnStore.select(InternalSalesReturnSelectors.selectSalesReturn),
    ),
    mergeMap(([action, settlementAdjustment, settlement, selectedSr]) => {

      settlementAdjustment.forEach(l => {
        const firstSettlement = settlement[0];
        l.guid_branch = firstSettlement.guid_branch;
        l.guid_comp = firstSettlement.guid_comp;
        l.guid_store = firstSettlement.guid_store;
        l.generic_doc_hdr_guid = firstSettlement.generic_doc_hdr_guid;
        l.session_guid = firstSettlement.session_guid;
      });

      let container : GenericDocSettlementMethodContainerAdjustmentModel = new GenericDocSettlementMethodContainerAdjustmentModel();
      container.bl_fi_generic_doc_settlement_method_adjustment.guid_doc_hdr = selectedSr.bl_fi_generic_doc_hdr.guid;
      container.bl_fi_generic_doc_settlement_method_adjustment.adjustment_status = "UNPROCESSED";
      container.bl_fi_generic_doc_settlement_method_adjustment.old_settlement = <any> { doclines: settlement};
      container.bl_fi_generic_doc_settlement_method_adjustment.new_settlement =  <any> { doclines: settlementAdjustment};
      container.bl_fi_generic_doc_settlement_method_adjustment.server_doc_type =  'INTERNAL_SALES_RETURN';
      container.bl_fi_generic_doc_settlement_method_adjustment.server_doc_1 =  selectedSr.bl_fi_generic_doc_hdr.server_doc_1;

      let json = {
        genDocStlMthdAdjustmentContainer:container,
        allowSettlementVariance: true
      }
      return  this.service.postAdjustmentCustom(json, this.apiVisa)
        .pipe(
          map((device: any) => {
            this.toaster.success(
              'The settlement adjustment has been submitted',
              'Success',
              {
                tapToDismiss: true,
                progressBar: true,
                timeOut: 1300
              }
            );
            this.viewColFacade.resetIndex(0);
            return SettlementAdjustmentActions.adjustSettlementSuccess()
          }),
          catchError((err) => {
            this.toaster.error(
              err.message,
              'Error',
              {
                tapToDismiss: true,
                progressBar: true,
                timeOut: 1300
              }
            );
            return of(SettlementAdjustmentActions.adjustSettlementFailed())
          })
      )}
    )
  ));

    addPayment$ = createEffect(() => this.actions$.pipe(
        ofType(SettlementAdjustmentActions.addPaymentInit),
        withLatestFrom(this.store.select(HDRSelectors.selectHdr)),
        map(([a, b]) => {
            this.viewColFacade.showSnackBar(SnackBarConstants.addSettlementSuccess);
                if (a.pageIndex === 1)
                    this.viewColFacade.resetIndex(1);
                else if (a.pageIndex === 2)
                    this.viewColFacade.resetIndex(2);
                return SettlementAdjustmentActions.addPaymentSuccess({ payment: a.payment })
        })
    ));

    savePayment$ = createEffect(() => this.actions$.pipe(
        ofType(SettlementAdjustmentActions.editPaymentInit),
        withLatestFrom(this.store.select(HDRSelectors.selectHdr)),
        map(([a, b]) => {
           // if (a.diffAmt <= parseFloat(<any>b.amount_open_balance)) {
                this.viewColFacade.showSnackBar(SnackBarConstants.editSettlement);
                if (a.pageIndex === 1)
                    this.viewColFacade.resetIndex(1);
                else if (a.pageIndex === 2)
                    this.viewColFacade.resetIndex(2);
                return SettlementAdjustmentActions.editPaymentSuccess({ payment: a.payment, diffAmt: a.diffAmt })
           // } else {
                this.viewColFacade.showSnackBar(SnackBarConstants.addSettlementFailed);
                return SettlementAdjustmentActions.editPaymentFailed();
           // }
        })
    ));

    deleteExistingPayment$ = createEffect(() => this.actions$.pipe(
        ofType(SettlementAdjustmentActions.deleteExistingPaymentInit),
        map((a) => {
            this.viewColFacade.showSnackBar(SnackBarConstants.deleteSettlement);
            this.viewColFacade.resetIndex(2);
            return SettlementAdjustmentActions.editPaymentSuccess({ payment: a.payment, diffAmt: a.diffAmt })
        })
    ));

    deletePayment$ = createEffect(() => this.actions$.pipe(
        ofType(SettlementAdjustmentActions.deletePaymentInit),
        map((a) => {
            this.viewColFacade.showSnackBar(SnackBarConstants.deleteSettlement);
            if (a.pageIndex === 1)
                this.viewColFacade.resetIndex(1);
            else if (a.pageIndex === 2)
                this.viewColFacade.resetIndex(2);
            return SettlementAdjustmentActions.deletePayment({ guid: a.guid, diffAmt: a.diffAmt })
        })
    ));

    constructor(
        private actions$: Actions,
        private viewColFacade: ViewColumnFacade,
        private readonly store: Store<DraftStates>,
        private service: GenericDocSettlementMethodAdjustmentService,
        private toaster: ToastrService,
        private salesReturnStore: Store<InternalSalesReturnStates>,
    ) { }
}
