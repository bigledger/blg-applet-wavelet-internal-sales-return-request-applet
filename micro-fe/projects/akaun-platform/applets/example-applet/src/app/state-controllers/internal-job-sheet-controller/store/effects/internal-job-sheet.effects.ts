import { Injectable } from '@angular/core';
import { from, iif, of } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, catchError, exhaustMap, withLatestFrom, mergeMap } from 'rxjs/operators';
import {
  InternalJobsheetService,
  BranchService,
  CustomerService,
  FinancialItemService,
  GenericDocContainerModel,
  BinGenDocLinkModel,
  bl_fi_generic_doc_ext_RowClass,
  BinGenDocLinkService,
  ARAPService,
  AppletService
} from 'blg-akaun-ts-lib';
import { InternalJobSheetActions } from '../actions';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { DraftStates } from '../../../draft-controller/store/states';
import { HDREditSelectors, HDRSelectors, PNSEditSelectors,PaymentSelectors ,PNSSelectors,LinkSelectors, SettlementEditSelectors, SettlementSelectors } from '../../../draft-controller/store/selectors';
import { AppConfig } from 'projects/shared-utilities/visa';
import { InternalJobSheetSelectors } from '../selectors';
import { InternalJobSheetStates } from '../states';
import { ToastConstants } from '../../../../models/constants/toast.constants';
import { UUID } from 'angular2-uuid';
import { BatchModel } from '../../../../models/batch.model';

@Injectable()
export class InternalJobSheetEffects {
  apiVisa = AppConfig.apiVisa;

  createJobSheet$ = createEffect(() => this.actions$.pipe(
    ofType(InternalJobSheetActions.createJobSheetInit),
    withLatestFrom(
      this.store.select(HDRSelectors.selectHdr),
      this.store.select(PNSSelectors.selectAll),
      this.store.select(SettlementSelectors.selectAll),
      this.store.select(LinkSelectors.selectAll)
    ),
    map(([action, hdr, pns, stl, link]) => {
      const container = new GenericDocContainerModel;
      console.log('hdr:', hdr );
      console.log('pns:', pns );
      hdr.guid = UUID.UUID().toLowerCase();
      container.bl_fi_generic_doc_hdr = hdr;
      pns.concat(stl).forEach(l => l.guid = null);
      container.bl_fi_generic_doc_line = [...pns, ...stl];
      return container;
    }),

    exhaustMap((a) => this.branchService.getByGuid(a.bl_fi_generic_doc_hdr.guid_branch.toString(), this.apiVisa).pipe(
      map(b_inner => {
        a.bl_fi_generic_doc_hdr.guid_comp = b_inner.data.bl_fi_mst_branch.comp_guid;
        return a;
      })
    )),
    exhaustMap((d) => this.jsService.postOne(d, this.apiVisa).pipe(
      // mergeMap(d_a =>
      //   iif(() => !!d_a.data.bl_fi_generic_doc_line.filter(pns => pns.txn_type === 'PNS').map((l: any) => l.batch_no?.bins).flat().length,
      //     from(d_a.data.bl_fi_generic_doc_line.filter(pns => pns.txn_type === 'PNS')).pipe(
      //       mergeMap(d_a_a => from((<any>d_a_a.batch_no).bins).pipe(
      //         mergeMap((d_a_a_a: BatchModel) => {
      //           const container = new BinGenDocLinkModel();
      //           container.bl_inv_bin_gen_doc_link = {
      //             ...container.bl_inv_bin_gen_doc_link,
      //             bin_hdr_guid: d_a_a_a.bin_hdr_guid,
      //             bin_line_guid: d_a_a_a.bin_line_guid,
      //             gen_doc_hdr_guid: d_a_a.generic_doc_hdr_guid.toString(),
      //             gen_doc_line_guid: d_a_a.guid.toString(),
      //             container_qty_contra: -d_a_a_a.container_qty,
      //             container_metric_contra: d_a_a_a.container_measure,
      //             qty_balance_contra: -(d_a_a_a.container_measure * d_a_a_a.container_qty)
      //           };
      //           return this.binGenDocLinkService.post(container, this.apiVisa).pipe(
      //             map(d_a_a_a_a => d_a)
      //           );
      //         })
      //       ))
      //     ),
      //     of(d_a)
      //   )
      // ),
      // mergeMap(d_b =>
      //   iif(() => !!d_b.data.bl_fi_generic_doc_line.find(l => (<any>l.line_property_json)?.deliveryInstructions.requestedDeliveryDate),
      //     of(d_b.data.bl_fi_generic_doc_line.filter(
      //       pns => pns.txn_type === 'PNS' && (<any>pns.line_property_json)?.deliveryInstructions.requestedDeliveryDate)).pipe(
      //       mergeMap(d_b_a => {
      //         const container = d_b.data;
      //         d_b_a.forEach(l => {
      //           const ext = new bl_fi_generic_doc_ext_RowClass();
      //           ext.guid_doc_hdr = l.generic_doc_hdr_guid.toString();
      //           ext.guid_doc_line = l.guid;
      //           ext.param_code = 'REQUESTED_DELIVERY_DATE';
      //           ext.param_name = 'REQUESTED_DELIVERY_DATE';
      //           ext.param_type = 'DATE';
      //           ext.value_datetime = (<any>l.line_property_json).deliveryInstructions.requestedDeliveryDate;
      //           container.bl_fi_generic_doc_ext.push(ext);
      //         });
      //         return this.jsService.put(container, this.apiVisa).pipe(
      //           map(d_b_a_a => d_b)
      //         );
      //       })
      //     ),
      //     of(d_b)
      //   )
      // ),
      map(d_c => {
        this.viewColFacade.showSuccessToast(ToastConstants.createJobSheetSuccess);
        this.viewColFacade.updateInstance(0, {
          deactivateAdd: false,
          deactivateList: false,
          selectedRowIndex: null
        });
        this.viewColFacade.resetIndex(0);
        this.viewColFacade.resetDraft(2);
        return InternalJobSheetActions.createJobSheetSuccess();
      }),
      catchError(err => {
        this.viewColFacade.showFailedToast(err);
        return of(InternalJobSheetActions.createJobSheetFailed({error: err.message}));
      })
    ))
  ));

  editJobSheet$ = createEffect(() => this.actions$.pipe(
    ofType(InternalJobSheetActions.editJobSheetInit),
    withLatestFrom(
      this.store.select(HDREditSelectors.selectHdr),
      this.store.select(PNSEditSelectors.selectAll),
      this.store.select(PaymentSelectors.selectAll),
      this.store.select(SettlementEditSelectors.selectAll)),
    exhaustMap(([action, hdr, pns, stl]) => this.jsService.getByGuid(hdr.guid.toString(), this.apiVisa).pipe(
      map((a_a) => {
        // delete b.customerName;
        // delete b.salesAgent;
        const container = new GenericDocContainerModel();
        hdr.revision = a_a.data.bl_fi_generic_doc_hdr.revision;
        pns.concat(stl).forEach(l => {
          const lineMatch = a_a.data.bl_fi_generic_doc_line.find(l_inner => l_inner.guid === l.guid);
          l.revision = lineMatch ? lineMatch.revision : l.revision;
          l.guid = lineMatch ? lineMatch.guid : null;
        });
        hdr.date_txn = a_a.data.bl_fi_generic_doc_hdr.date_txn;
        container.bl_fi_generic_doc_hdr = hdr;
        container.bl_fi_generic_doc_line = [...pns, ...stl];
        if (pns.find(l => (<any>l.line_property_json)?.deliveryInstructions.requestedDeliveryDate)) {
          a_a.data.bl_fi_generic_doc_ext.forEach(x => {
            const exist = pns.find(l => l.guid === x.guid_doc_line && l.guid);
            if (exist) {
              x.value_datetime = (<any>exist.line_property_json)?.deliveryInstructions.requestedDeliveryDate;
            } else {
              pns.filter(l => l.guid && a_a.data.bl_fi_generic_doc_ext.find(x_b => x_b.guid_doc_line !== l.guid)).forEach(l_b => {
                const ext = new bl_fi_generic_doc_ext_RowClass();
                ext.guid_doc_hdr = l_b.generic_doc_hdr_guid.toString();
                ext.guid_doc_line = l_b.guid;
                ext.param_code = 'REQUESTED_DELIVERY_DATE';
                ext.param_name = 'REQUESTED_DELIVERY_DATE';
                ext.param_type = 'DATE';
                ext.value_datetime = (<any>l_b.line_property_json).deliveryInstructions.requestedDeliveryDate;
                container.bl_fi_generic_doc_ext.push(ext);
              });
            }
          });
        }
        return container;
      }),
      mergeMap(b => this.jsService.put(b, this.apiVisa).pipe(
        map(b_a => {
          b_a.data.bl_fi_generic_doc_line.filter(l =>
            (<any>l.line_property_json)?.deliveryInstructions.requestedDeliveryDate &&
            l.guid && b_a.data.bl_fi_generic_doc_ext.find(x => x.guid_doc_line !== l.guid)).forEach(l_b => {
              const ext = new bl_fi_generic_doc_ext_RowClass();
              ext.guid_doc_hdr = l_b.generic_doc_hdr_guid.toString();
              ext.guid_doc_line = l_b.guid;
              ext.param_code = 'REQUESTED_DELIVERY_DATE';
              ext.param_name = 'REQUESTED_DELIVERY_DATE';
              ext.param_type = 'DATE';
              ext.value_datetime = (<any>l_b.line_property_json).deliveryInstructions.requestedDeliveryDate;
              b_a.data.bl_fi_generic_doc_ext.push(ext);
            });
          return b_a.data;
        })
      )),
      exhaustMap(c_inner => this.jsService.put(c_inner, this.apiVisa).pipe(
        map(() => {
          this.viewColFacade.showSuccessToast(ToastConstants.updateJobSheetSuccess);
          this.viewColFacade.updateInstance(0, {
            deactivateAdd: false,
            deactivateList: false,
            selectedRowIndex: null
          });
          this.viewColFacade.resetIndex(0);
          this.viewColFacade.resetDraft(1);
          return InternalJobSheetActions.editJobSheetSuccess();
        }),
        catchError(err => {
          this.viewColFacade.showFailedToast(err);
          return of(InternalJobSheetActions.editJobSheetFailed({error: err.message}));
        })
      )),
      catchError(err => {
        this.viewColFacade.showFailedToast(err);
        return of(InternalJobSheetActions.editJobSheetFailed({error: err.message}));
      })
    ))
  ));


  deleteJobSheet$ = createEffect(() => this.actions$.pipe(
    ofType(InternalJobSheetActions.deleteJobSheetInit),
    withLatestFrom(this.store.select(HDREditSelectors.selectHdr)),
    exhaustMap(([a, b]) => this.jsService.delete(b.guid.toString(), this.apiVisa).pipe(
      map(() => {
        this.viewColFacade.showSuccessToast(ToastConstants.deleteSalesOrderSuccess);
        this.viewColFacade.updateInstance(0, {
          deactivateAdd: false,
          deactivateList: false,
          selectedRowIndex: null
        });
        this.viewColFacade.resetIndex(0);
        this.viewColFacade.resetDraft(1);
        return InternalJobSheetActions.deleteJobSheetSuccess();
      }),
      catchError(err => {
        this.viewColFacade.showFailedToast(err);
        return of(InternalJobSheetActions.deleteJobSheetFailed({error: err.message}));
      })
    ))
  ));
  printJasperPdf$ = createEffect(() => this.actions$.pipe(
    ofType(InternalJobSheetActions.printJasperPdfInit),
    withLatestFrom(this.store.select(HDRSelectors.selectHdr)),
    exhaustMap(([action, hdr]) => this.appletService.getByGuid(sessionStorage.getItem('appletGuid'), AppConfig.apiVisa).pipe(
      map(a => {
        console.log(a);
        let printable = a.data.bl_applet_exts.find(x =>
          x.param_code === 'INTERNAL_JOB_SHEET_APPLET_EXT_CODE_PRINTABLE_FORMAT_GUID_INTERNAL_JOB_SHEET')?.value_string
        return { hdr: hdr, printable_guid: printable }
      })
    )),
    exhaustMap((b) => this.jsService.printJasperPdf(
      b.hdr.guid.toString(),
      'CP_COMMERCE_INTERNAL_SALES_ORDERS_JASPER_PRINT_SERVICE', b.printable_guid.toString(), AppConfig.apiVisa).pipe(
        map(a => {
          const downloadURL = window.URL.createObjectURL(a);
          const link = document.createElement('a');
          link.href = downloadURL;
          link.download = `${b.hdr.server_doc_1}.pdf`;
          link.click();
          link.remove();
          this.viewColFacade.showSuccessToast('JobSheet Exported Successfully');
          return InternalJobSheetActions.printJasperPdfSuccess();
        }),
        catchError(err => {
          this.viewColFacade.showFailedToast(err);
          return of(InternalJobSheetActions.printJasperPdfFailed());
        })
      )
    )
  ));


  addContra$ = createEffect(() => this.actions$.pipe(
    ofType(InternalJobSheetActions.addContraInit),
    withLatestFrom(
      this.store.select(HDRSelectors.selectHdr),
      this.jsStore.select(InternalJobSheetSelectors.selectContraDoc)
    ),
    map(([action, hdr, contra]) => {
      action.contra.bl_fi_generic_doc_arap_contra = {
        ...action.contra.bl_fi_generic_doc_arap_contra,
        guid_doc_1_hdr: hdr.guid.toString(),
        guid_doc_2_hdr: contra.bl_fi_generic_doc_hdr.guid.toString(),
        server_doc_type_doc_1: hdr.server_doc_type.toString(),
        server_doc_type_doc_2: contra.bl_fi_generic_doc_hdr.server_doc_type.toString(),
        date_doc_1: hdr.date_txn.toString(),
        date_doc_2: contra.bl_fi_generic_doc_hdr.date_txn.toString()
      };
      return action.contra;
    }),
    exhaustMap(a => this.arapService.post(a, this.apiVisa).pipe(
      map(a_a => {
        this.viewColFacade.showSuccessToast(ToastConstants.addContraSuccess);
        this.viewColFacade.resetIndex(1);
        return InternalJobSheetActions.addContraSuccess();
      }),
      catchError(err => {
        this.viewColFacade.showFailedToast(err);
        return of(InternalJobSheetActions.addContraFailed({ error: err.message }));
      })
    ))
  ));

  deleteContra$ = createEffect(() => this.actions$.pipe(
    ofType(InternalJobSheetActions.deleteContraInit),
    withLatestFrom(
      this.jsStore.select(InternalJobSheetSelectors.selectContraLink)
    ),
    exhaustMap(([action, link]) => this.arapService.delete(link.bl_fi_generic_doc_arap_contra.guid, this.apiVisa).pipe(
      map(a_a => {
        this.viewColFacade.showSuccessToast(ToastConstants.deleteContraSuccess);
        this.viewColFacade.resetIndex(1);
        return InternalJobSheetActions.addContraSuccess();
      }),
      catchError(err => {
        this.viewColFacade.showFailedToast(err);
        return of(InternalJobSheetActions.addContraFailed({ error: err.message }));
      })
    ))
  ));
  constructor(
    private actions$: Actions,
    private jsService: InternalJobsheetService,
    private cstmrService: CustomerService,
    private appletService: AppletService,
    private toastr: ToastrService,
    private arapService: ARAPService,
    private store: Store<DraftStates>,
    private jsStore: Store<InternalJobSheetStates>,
    private binGenDocLinkService: BinGenDocLinkService,
    private branchService: BranchService,
    private viewColFacade: ViewColumnFacade,
  ) {}
  // apiVisa = AppConfig.apiVisa;
  // createJobSheet$ = createEffect(() => this.actions$.pipe(
  //   ofType(InternalJobSheetActions.createJobSheetInit),
  //   withLatestFrom(
  //     this.store.select(HDRSelectors.selectHdr),
  //     this.store.select(PNSSelectors.selectAll),
  //     this.store.select(SettlementSelectors.selectAll),
  //     this.store.select(LinkSelectors.selectAll)
  //   );

  // // createJobSheet$ = createEffect(() => this.actions$.pipe(
  // //   ofType(InternalJobSheetActions.createJobSheetInit),
  // //   withLatestFrom(
  // //     this.store.select(HDRSelectors.selectHdr),
  // //     this.store.select(PNSSelectors.selectAll),
  // //     this.store.select(SettlementSelectors.selectAll),
  // //     this.store.select(LinkSelectors.selectAll)
  // //   ),

  // //   map(([action, hdr, pns, stl, link]) => {
  // //     const container = new GenericDocContainerModel;
  // //     container.bl_fi_generic_doc_hdr = hdr;
  // //     link.forEach(l => {
  // //       l.guid = null;
  // //       l.guid_doc_2_hdr = hdr.guid;
  // //     });
  // //     stl.forEach(l => l.guid = null);
  // //     container.bl_fi_generic_doc_line = [...pns, ...stl];
  // //     container.bl_fi_generic_doc_link = link;
  // //     // Create Extension
  // //     pns.forEach((item: any) => {
  // //       // If condition doesnt matter
  // //       if (item.line_property_json && item.line_property_json.delivery_instructions) {
  // //         const ext = new bl_fi_generic_doc_ext_RowClass();
  // //         ext.guid_doc_hdr = hdr.guid.toString();
  // //         ext.guid_doc_line = item.guid;
  // //         ext.param_code = 'REQUESTED_DELIVERY_DATE';
  // //         ext.param_name = 'REQUESTED_DELIVERY_DATE';
  // //         ext.param_type = 'DATE';
  // //         ext.value_datetime = item.line_property_json.delivery_instructions.deliveryDate;
  // //         ext.value_json = item.line_property_json.delivery_instructions;
  // //         container.bl_fi_generic_doc_ext.push(ext);
  // //       }
  // //     })

  // //     console.log('Create model', container);
  // //     return container;
  // //   }),

  // // //   map(([action, hdr, pns, stl]) => {
  // // //     const container = new GenericDocContainerModel;
  // // //     container.bl_fi_generic_doc_hdr = hdr;
  // // //     pns.concat(stl).forEach(l => l.guid = null);
  // // //     container.bl_fi_generic_doc_line = [...pns, ...stl];
  // // //     return container;
  // // //   }),
  // // //   exhaustMap((a) => this.branchService.getByGuid(a.bl_fi_generic_doc_hdr.guid_branch.toString(), this.apiVisa).pipe(
  // // //     map(b_inner => {
  // // //       a.bl_fi_generic_doc_hdr.guid_comp = b_inner.data.bl_fi_mst_branch.comp_guid;
  // // //       return a;
  // // //     })
  // // //   )),
  // // //   exhaustMap((d) => this.JsService.post(d, this.apiVisa).pipe(
  // // //     map((a: any) => {
  // // //       this.toastr.success(
  // // //         'The job sheet created successfully',
  // // //         'Success',
  // // //         {
  // // //           tapToDismiss: true,
  // // //           progressBar: true,
  // // //           timeOut: 1300
  // // //         }
  // // //       );
  // // //       this.viewColFacade.resetIndex(0);
  // // //       return InternalJobSheetActions.createJobSheetSuccess();
  // // //     }),
  // // //     catchError(err => {
  // // //       this.toastr.error(
  // // //         err.message,
  // // //         'Error',
  // // //         {
  // // //           tapToDismiss: true,
  // // //           progressBar: true,
  // // //           timeOut: 1300
  // // //         }
  // // //       );
  // // //       return of(InternalJobSheetActions.createJobSheetFailed({error: err.message}));
  // // //     })
  // // //   ))
  // // // ));

  // // // deleteJobSheet$ = createEffect(() => this.actions$.pipe(
  // // //   ofType(InternalJobSheetActions.deleteJobSheetsInit),
  // // //   withLatestFrom(this.store.select(HDREditSelectors.selectHdr)),
  // // //   exhaustMap(([a, b]) => this.JsService.delete(b.guid.toString(), this.apiVisa).pipe(
  // // //     map(() => {
  // // //       this.toastr.success(
  // // //         'The job sheet deleted successfully',
  // // //         'Success',
  // // //         {
  // // //           tapToDismiss: true,
  // // //           progressBar: true,
  // // //           timeOut: 1300
  // // //         }
  // // //       );
  // // //       this.viewColFacade.resetIndex(0);
  // // //       return InternalJobSheetActions.deleteJobSheetSuccess();
  // // //     }),
  // // //     catchError(err => {
  // // //       this.toastr.error(
  // // //         err.message,
  // // //         'Error',
  // // //         {
  // // //           tapToDismiss: true,
  // // //           progressBar: true,
  // // //           timeOut: 1300
  // // //         }
  // // //       );
  // // //       return of(InternalJobSheetActions.deleteJobSheetFailed({error: err.message}));
  // // //     })
  // // //   ))
  // // // ));

  // // // editJobSheet$ = createEffect(() => this.actions$.pipe(
  // // //   ofType(InternalJobSheetActions.editJobSheetsInit),
  // // //   withLatestFrom(
  // // //     this.store.select(HDREditSelectors.selectHdr),
  // // //     this.store.select(PNSEditSelectors.selectAll),
  // // //     this.store.select(SettlementEditSelectors.selectAll)),
  // // //   exhaustMap(([action, hdr, pns, stl]) => this.JsService.getByGuid(hdr.guid.toString(), this.apiVisa).pipe(
  // // //     map((b_inner) => {
  // // //       // delete b.customerName;
  // // //       // delete b.salesAgent;
  // // //       const container = new GenericDocContainerModel()
  // // //       hdr.revision = b_inner.data.bl_fi_generic_doc_hdr.revision;
  // // //       pns.concat(stl).forEach(l => {
  // // //         const lineMatch = b_inner.data.bl_fi_generic_doc_line.find(l_inner => l_inner.guid === l.guid);
  // // //         l.revision = lineMatch ? lineMatch.revision : l.revision;
  // // //         l.guid = lineMatch ? lineMatch.guid : null;
  // // //       });
  // // //       hdr.date_txn = b_inner.data.bl_fi_generic_doc_hdr.date_txn;
  // // //       container.bl_fi_generic_doc_hdr = hdr;
  // // //       container.bl_fi_generic_doc_line = [...pns, ...stl];
  // // //       return container;
  // // //     }),
  // // //     exhaustMap(c_inner => this.JsService.put(c_inner, this.apiVisa).pipe(
  // // //       map(() => {
  // // //         this.toastr.success(
  // // //           'The job sheet updated successfully',
  // // //           'Success',
  // // //           {
  // // //             tapToDismiss: true,
  // // //             progressBar: true,
  // // //             timeOut: 1300
  // // //           }
  // // //         );
  // // //         this.viewColFacade.resetIndex(0);
  // // //         return InternalJobSheetActions.editJobSheetSuccess();
  // // //       }),
  // // //       catchError(err => {
  // // //         this.toastr.error(
  // // //           err.message,
  // // //           'Error',
  // // //           {
  // // //             tapToDismiss: true,
  // // //             progressBar: true,
  // // //             timeOut: 1300
  // // //           }
  // // //         );
  // // //         return of(InternalJobSheetActions.editJobSheetFailed({error: err.message}));
  // // //       })
  // // //     )),
  // // //     catchError(err => {
  // // //       this.toastr.error(
  // // //         err.message,
  // // //         'Error',
  // // //         {
  // // //           tapToDismiss: true,
  // // //           progressBar: true,
  // // //           timeOut: 1300
  // // //         }
  // // //       );
  // // //       return of(InternalJobSheetActions.editJobSheetFailed({error: err.message}));
  // // //     })
  // // //   ))
  // // // ));

  // // selectEntityCustomer$ = createEffect(() => this.actions$.pipe(
  // //   ofType(InternalJobSheetActions.selectEntityInit),
  // //   mergeMap(action => this.cstmrService.getByGuid(action.entity.bl_fi_generic_doc_hdr.doc_entity_hdr_guid.toString(), this.apiVisa).pipe(
  // //     map(a => InternalJobSheetActions.selectEntityCustomerSuccess({entity: a.data})),
  // //     catchError(err => of(InternalJobSheetActions.selectEntityCustomerFailed({error: err.message})))
  // //   ))
  // // ));

  // // selectLineItem$ = createEffect(() => this.actions$.pipe(
  // //   ofType(InternalJobSheetActions.selectLineItemInit),
  // //   mergeMap(action => this.fiService.getByGuid(action.line.item_guid.toString(), this.apiVisa).pipe(
  // //     map(a => InternalJobSheetActions.selectLineItemSuccess({entity: a.data})),
  // //     catchError(err => of(InternalJobSheetActions.selectLineItemFailed({error: err.message})))
  // //   ))
  // // ));
  // // ));
  // constructor(
  //   private actions$: Actions,
  //   private jobSheetService: InternalJobsheetService,
  //   private toastr: ToastrService,
  //   private store: Store<DraftStates>,
  //   private branchService: BranchService,
  //   private viewColFacade: ViewColumnFacade,
  //   private cstmrService: CustomerService,
  //   private fiService: FinancialItemService
  // ) {}
}

