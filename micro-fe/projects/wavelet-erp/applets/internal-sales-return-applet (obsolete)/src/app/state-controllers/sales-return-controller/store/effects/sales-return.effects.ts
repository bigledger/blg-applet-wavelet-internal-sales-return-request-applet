import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { UUID } from 'angular2-uuid';
import {
  AppletService, ARAPService, bl_fi_generic_doc_ext_RowClass,
  BranchService,
  EntityService,
  GenericDocContainerModel,
  InternalSalesReturnService
} from 'blg-akaun-ts-lib';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from 'projects/shared-utilities/visa';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { ToastConstants } from '../../../../models/constants/toast.constants';
import { HDRSelectors, LinkSelectors, PaymentSelectors, PNSSelectors } from '../../../draft-controller/store/selectors';
import { DraftStates } from '../../../draft-controller/store/states';
import { SalesReturnActions } from '../actions';
import { SalesReturnSelectors } from '../selectors';
import { SalesReturnStates } from '../states';

@Injectable()
export class SalesReturnEffects {

  apiVisa = AppConfig.apiVisa;

  createSalesReturn$ = createEffect(() => this.actions$.pipe(
    ofType(SalesReturnActions.createSalesReturnsInit),
    withLatestFrom(
      this.store.select(HDRSelectors.selectHdr),
      this.store.select(PNSSelectors.selectAll),
      this.store.select(PaymentSelectors.selectAll),
      this.store.select(LinkSelectors.selectAll)
    ),
    map(([action, hdr, pns, stl, link]) => {
      const container = new GenericDocContainerModel;
      hdr.guid = UUID.UUID().toLowerCase(),
        container.bl_fi_generic_doc_hdr = hdr;
      link.forEach(l => {
        l.guid = null;
        l.guid_doc_2_hdr = hdr.guid;
      });
      stl.forEach(l => l.guid = null);
      container.bl_fi_generic_doc_line = [...pns, ...stl];
      container.bl_fi_generic_doc_link = link;
      // Create Extension 
      pns.forEach((item: any) => {
        // If condition doesnt matter
        if (item.line_property_json && item.line_property_json.delivery_instructions) {
          const ext = new bl_fi_generic_doc_ext_RowClass();
          ext.guid_doc_hdr = hdr.guid.toString();
          ext.guid_doc_line = item.guid;
          ext.param_code = 'REQUESTED_DELIVERY_DATE';
          ext.param_name = 'REQUESTED_DELIVERY_DATE';
          ext.param_type = 'DATE';
          ext.value_datetime = item.line_property_json.delivery_instructions.deliveryDate;
          ext.value_json = item.line_property_json.delivery_instructions;
          container.bl_fi_generic_doc_ext.push(ext);
        }
      })

      console.log('Create model', container);
      return container;
    }),
    exhaustMap((a) => this.branchService.getByGuid(a.bl_fi_generic_doc_hdr.guid_branch.toString(), this.apiVisa).pipe(
      map(b_inner => {
        a.bl_fi_generic_doc_hdr.guid_comp = b_inner.data.bl_fi_mst_branch.comp_guid;
        return a;
      })
    )),
    exhaustMap((d) => this.srService.post(d, this.apiVisa).pipe(
      map((a: any) => {
        this.viewColFacade.showSuccessToast(ToastConstants.createSalesReturnSuccess);
        this.viewColFacade.updateInstance(0, {
          deactivateAdd: false,
          deactivateList: false
        });
        this.viewColFacade.resetIndex(0);
        return SalesReturnActions.createSalesReturnSuccess();
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
        return of(SalesReturnActions.createSalesReturnFailed({ error: err.message }));
      })
    ))
  ));

  editSalesReturn$ = createEffect(() => this.actions$.pipe(
    ofType(SalesReturnActions.editSalesReturnInit),
    withLatestFrom(
      this.srStore.select(SalesReturnSelectors.selectReturn),
      this.store.select(HDRSelectors.selectHdr),
      this.store.select(PNSSelectors.selectAll),
      this.store.select(PaymentSelectors.selectAll),
      this.store.select(LinkSelectors.selectAll)
    ),
    map(([action, genDoc, hdr, pns, stl, link]) => {

      genDoc.bl_fi_generic_doc_hdr = hdr;
      link.forEach(l => {
        // this condition check if pre-existing link entry
        if (l.guid.toString().length !== 36) {
          l.guid = null;
          l.guid_doc_2_hdr = hdr.guid;
        }
      });
      stl.forEach(l => {
        // hacky condition to check if payment exist before
        if (l.guid.toString().length !== 36)
          l.guid = null
      });
      genDoc.bl_fi_generic_doc_line = [...pns, ...stl];
      genDoc.bl_fi_generic_doc_link = link;

      // extension logic here
      pns.forEach((item: any) => {
        // If condition doesn't matter
        if (item.line_property_json && item.line_property_json.delivery_instructions) {
          const extIndex = genDoc.bl_fi_generic_doc_ext.findIndex(x => x.param_code === 'REQUESTED_DELIVERY_DATE' && x.guid_doc_line === item.guid);
          if (extIndex >= 0) {
            genDoc.bl_fi_generic_doc_ext[extIndex].value_datetime = item.line_property_json.delivery_instructions.deliveryDate
            genDoc.bl_fi_generic_doc_ext[extIndex].value_json = item.line_property_json.delivery_instructions;
            genDoc.bl_fi_generic_doc_ext[extIndex].status = item.status;
          } else {
            const ext = new bl_fi_generic_doc_ext_RowClass();
            ext.guid_doc_hdr = hdr.guid.toString();
            ext.guid_doc_line = item.guid;
            ext.param_code = 'REQUESTED_DELIVERY_DATE';
            ext.param_name = 'REQUESTED_DELIVERY_DATE';
            ext.param_type = 'DATE';
            ext.value_datetime = item.line_property_json.delivery_instructions.deliveryDate;
            ext.value_json = item.line_property_json.delivery_instructions;
            genDoc.bl_fi_generic_doc_ext.push(ext);
          }
        }
      });

      console.log('Update model', genDoc);
      return genDoc;
    }),
    exhaustMap((a) => this.branchService.getByGuid(a.bl_fi_generic_doc_hdr.guid_branch.toString(), this.apiVisa).pipe(
      map(b_inner => {
        a.bl_fi_generic_doc_hdr.guid_comp = b_inner.data.bl_fi_mst_branch.comp_guid;
        return a;
      })
    )),
    exhaustMap((d) => this.srService.put(d, this.apiVisa).pipe(
      map((a: any) => {
        this.viewColFacade.showSuccessToast(ToastConstants.editSalesReturnSuccess);
        this.viewColFacade.updateInstance(0, {
          deactivateAdd: false,
          deactivateList: false
        });
        this.viewColFacade.resetIndex(0);
        return SalesReturnActions.editSalesReturnSuccess();
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
        return of(SalesReturnActions.editSalesReturnFailed({ error: err.message }));
      })
    ))
  ));

  deleteSalesReturn$ = createEffect(() => this.actions$.pipe(
    ofType(SalesReturnActions.deleteSalesReturnInit),
    withLatestFrom(this.store.select(HDRSelectors.selectHdr)),
    exhaustMap(([a, b]) => this.srService.delete(b.guid.toString(), this.apiVisa).pipe(
      map(() => {
        this.viewColFacade.showSuccessToast(ToastConstants.deleteSalesReturnSuccess);
        this.viewColFacade.updateInstance(0, {
          deactivateAdd: false,
          deactivateList: false,
        });
        this.viewColFacade.resetIndex(0);
        // this.viewColFacade.resetDraft();
        return SalesReturnActions.deleteSalesReturnSuccess();
      }),
      catchError(err => {
        this.viewColFacade.showFailedToast(err);
        return of(SalesReturnActions.deleteSalesReturnFailed({ error: err.message }));
      })
    ))
  ));

  addContra$ = createEffect(() => this.actions$.pipe(
    ofType(SalesReturnActions.addContraInit),
    withLatestFrom(
      this.store.select(HDRSelectors.selectHdr),
      this.srStore.select(SalesReturnSelectors.selectContraDoc)
    ),
    map(([action, hdr, contraDoc]) => {
      action.contraDoc.bl_fi_generic_doc_arap_contra = {
        ...action.contraDoc.bl_fi_generic_doc_arap_contra,
        guid_doc_1_hdr: hdr.guid.toString(),
        guid_doc_2_hdr: contraDoc.bl_fi_generic_doc_hdr.guid.toString(),
        server_doc_type_doc_1: hdr.server_doc_type.toString(),
        server_doc_type_doc_2: contraDoc.bl_fi_generic_doc_hdr.server_doc_type.toString(),
        date_doc_1: hdr.date_txn.toString(),
        date_doc_2: contraDoc.bl_fi_generic_doc_hdr.date_txn.toString()
      };
      return action.contraDoc;
    }),
    exhaustMap(a => this.arapService.post(a, this.apiVisa).pipe(
      map(a_a => {
        this.viewColFacade.showSuccessToast(ToastConstants.contraAddedSuccess);
        this.viewColFacade.resetIndex(1);
        return SalesReturnActions.addContraSuccess();
      }),
      catchError(err => {
        this.viewColFacade.showFailedToast(err);
        return of(SalesReturnActions.addContraFailed({ error: err.message }));
      })
    ))
  ));

  deleteContra$ = createEffect(() => this.actions$.pipe(
    ofType(SalesReturnActions.deleteContraInit),
    withLatestFrom(
      this.srStore.select(SalesReturnSelectors.selectContraLink)
    ),
    exhaustMap(([action, link]) => this.arapService.delete(link.bl_fi_generic_doc_arap_contra.guid, this.apiVisa).pipe(
      map(a_a => {
        this.viewColFacade.showSuccessToast(ToastConstants.contraDeleteSuccess);
        this.viewColFacade.resetIndex(1);
        return SalesReturnActions.addContraSuccess();
      }),
      catchError(err => {
        this.viewColFacade.showFailedToast(err);
        return of(SalesReturnActions.addContraFailed({ error: err.message }));
      })
    ))
  ));

  printJasperPdf$ = createEffect(() => this.actions$.pipe(
    ofType(SalesReturnActions.printJasperPdfInit),
    withLatestFrom(this.store.select(HDRSelectors.selectHdr)),
    // exhaustMap(([action, hdr]) => this.appletService.getByGuid(sessionStorage.getItem('appletGuid'), AppConfig.apiVisa).pipe(
    //   map(a => {
    //     console.log(a);
    //     let printable = a.data.bl_applet_exts.find(x => 
    //       x.param_code === 'INTERNAL_PURCHASE_ORDER_APPLET_EXT_CODE_PRINTABLE_FORMAT_GUID_INTERNAL_PURCHASE_ORDER')?.value_string
    //     if (!printable)
    //       printable = '0f3e7e4c-4dad-4206-bc67-2eed0be53f67';
    //     return { hdr: hdr, printable_guid: printable }
    //   })
    // )),
    map(([action, hdr]) => {
      let printableGuid;
      const tenantCode = sessionStorage.getItem('tenantCode')
      if (tenantCode === 'staging_tenant')
        printableGuid = '0f3e7e4c-4dad-4206-bc67-2eed0be53f67';
      else if (tenantCode === 'oneliving_staging')
        printableGuid = '87e8eb1b-319c-42cb-b0b7-9e849f408f8c';
      else if (tenantCode === 'development_tenant')
        printableGuid = 'c88f2cff-2ee0-4fa9-ad80-bcdf20ce5bde';
      return { hdr: hdr, printable_guid: printableGuid }
    }),
    exhaustMap((b) => this.srService.printJasperPdf(
      b.hdr.guid.toString(),
      'CP_COMMERCE_INTERNAL_SALES_ORDERS_JASPER_PRINT_SERVICE', b.printable_guid, AppConfig.apiVisa).pipe(
        map(a => {
          const downloadURL = window.URL.createObjectURL(a);
          const link = document.createElement('a');
          link.href = downloadURL;
          link.download = `${b.hdr.server_doc_1}.pdf`;
          link.click();
          link.remove();
          this.viewColFacade.showSuccessToast('Sales Return Exported Successfully');
          return SalesReturnActions.printJasperPdfSuccess();
        }),
        catchError(err => {
          this.viewColFacade.showFailedToast(err);
          return of(SalesReturnActions.printJasperPdfFailed());
        })
      )
    )
  ));

  selectEntity$ = createEffect(() => this.actions$.pipe(
    ofType(SalesReturnActions.selectReturnForEdit),
    exhaustMap(action => this.entityService.getEntityByHdrGuids(action.genDoc.bl_fi_generic_doc_hdr.doc_entity_hdr_guid.toString(), this.apiVisa).pipe(
      map((a: any) => {
        return SalesReturnActions.selectEntityOnEdit({ entity: { entity: a.data[0], contact: null } })
      }),
    ))
  ));

  updatePostingStatus$ = createEffect(() => this.actions$.pipe(
    ofType(SalesReturnActions.updatePostingStatusInit),
    mergeMap(action => this.srService.updatePostingStatus(action.status, this.apiVisa, action.doc.bl_fi_generic_doc_hdr.guid.toString()).pipe(
      map(a => {
        this.viewColFacade.showSuccessToast('Posting Successfully');
        this.viewColFacade.updateInstance(0, {
          deactivateAdd: false,
          deactivateList: false
        });
        this.viewColFacade.resetIndex(0);
        return SalesReturnActions.updatePostingStatusSuccess({ doc: a.data });
      }),
      catchError(err => {
        this.viewColFacade.showFailedToast(err);
        return of(SalesReturnActions.updatePostingStatusFailed({ error: err.message }))
      })
    ))
  ));

  constructor(
    private actions$: Actions,
    private srService: InternalSalesReturnService,
    private appletService: AppletService,
    private entityService: EntityService,
    private arapService: ARAPService,
    private toastr: ToastrService,
    private store: Store<DraftStates>,
    private srStore: Store<SalesReturnStates>,
    private branchService: BranchService,
    private viewColFacade: ViewColumnFacade
  ) { }
}