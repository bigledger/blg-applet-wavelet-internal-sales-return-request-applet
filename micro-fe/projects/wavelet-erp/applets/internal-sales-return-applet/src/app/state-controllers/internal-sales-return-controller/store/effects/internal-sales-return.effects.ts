import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { UUID } from "angular2-uuid";
import {
  ARAPService,
  bl_fi_generic_doc_ext_RowClass,
  bl_fi_generic_doc_line_RowClass,
  BranchService,
  CompanyService,
  LocationService,
  CustomerService,
  EmployeeService,
  EntityService,
  GenDocLinkContainerModel,
  GenericDocContainerModel,
  GenericDocLinkBackofficeEPService,
  GenericDocLinkContainerModel,
  InternalSalesReturnRequestService,
  Pagination,
  PricingSchemeLinkService,
  PricingSchemeService,
  TenantUserProfileService,
  FinancialItemService,
  AppletSettingFilterItemCategoryLinkService,
  AppletSettingFilterItemCategoryLinkContainerModel,
  MyEInvoiceToIRBHdrLinesService,
  GenericDocEditingLockDto,
  GenericDocLockService,
  EinvoiceNotificationQueueService, GenericDocARAPContainerModel
} from "blg-akaun-ts-lib";
import { ToastrService } from "ngx-toastr";
import { AppConfig } from "projects/shared-utilities/visa";
import { forkJoin, iif, Observable, of, zip, from, EMPTY } from "rxjs";
import {
  catchError,
  exhaustMap,
  filter,
  map,
  mergeMap,
  switchMap,
  take,
  withLatestFrom,
  tap
} from "rxjs/operators";
import { ViewColumnFacade } from "../../../../facades/view-column.facade";
import { ToastConstants } from "../../../../models/constants/toast.constants";
import {
  HDRSelectors,
  LinkSelectors,
  PNSSelectors,
  SettlementSelectors,
  ContraSelectors,
} from "../../../draft-controller/store/selectors";
import { DraftStates } from "../../../draft-controller/store/states";
import { InternalSalesReturnActions } from "../actions";
import { InternalSalesReturnSelectors } from "../selectors";
import { InternalSalesReturnStates } from "../states";
import { SessionSelectors } from "projects/shared-utilities/modules/session/session-controller/selectors";
import { SessionStates } from "projects/shared-utilities/modules/session/session-controller/states";
import { BranchSettingsStates } from '../../../branch-settings-controller/states';
import { BranchSettingsActions } from '../../../branch-settings-controller/actions';
import { BranchSettingsSelectors } from '../../../branch-settings-controller/selectors';
import moment from "moment";
import { PDFDocument } from 'pdf-lib';
import {ContraActions} from "../../../draft-controller/store/actions";
import { ApiService } from "../../../../services/api-service";
import { PNSActions, HDRActions } from "../../../draft-controller/store/actions";
import {
  editInternalSalesReturnGenDocLinkFinalFailed,
  editInternalSalesReturnGenDocLinkFinalSuccess
} from '../actions/internal-sales-return.actions';
import { ListingService } from "projects/shared-utilities/services/listing-service";
import { ListingInputModel } from "projects/shared-utilities/models/listing-input.model";

@Injectable()
export class InternalSalesReturnEffects {
  apiVisa = AppConfig.apiVisa;

  loadBranchCompany$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InternalSalesReturnActions.loadBranchCompany),
      withLatestFrom(
        this.sessionStore.select(SessionSelectors.selectPersonalSettings),
        this.sessionStore.select(SessionSelectors.selectMasterSettings)
      ),
      exhaustMap(([action, personal, master]) => {
        let DEFAULT_BRANCH = personal?.DEFAULT_BRANCH ?? master?.DEFAULT_BRANCH;
        let DEFAULT_COMPANY = personal?.DEFAULT_COMPANY ?? master?.DEFAULT_COMPANY;

        if (action.changeDefault) {
          DEFAULT_BRANCH = action.branchGuid;
          DEFAULT_COMPANY = action.compGuid;
        }
        this.isSalesReturnStore.dispatch(InternalSalesReturnActions.resetRoundingGroupDiscountItem());

        if (action.branchObj) {
          //console.log('action.branchObj',action.branchObj)
          const branchAction = InternalSalesReturnActions.loadBranchCompanySuccess({
            branch: action.branchObj.bl_fi_mst_branch,
            company: null,
          });

          this.branchSettingStore.dispatch(BranchSettingsActions.selectDefaultPrintableFormatInit({branchGuid: action.branchObj.toString(),serverDocType:"INTERNAL_SALES_CASHBILL"}));

          if (DEFAULT_COMPANY) {
            return this.companyService.getByGuid(DEFAULT_COMPANY, this.apiVisa).pipe(
              map((compRes) => {
                return InternalSalesReturnActions.loadBranchCompanySuccess({
                  branch: action.branchObj.bl_fi_mst_branch,
                  company: compRes.data.bl_fi_mst_comp
                });
              }),
              catchError((compErr) => {
                console.error('Error in companyService:', compErr);
                return of(
                  InternalSalesReturnActions.loadBranchCompanFailed({
                    err: compErr.message,
                  })
                );
              })
            );
          } else {
            return of(branchAction);
          }
        } else if (DEFAULT_BRANCH) {
          this.branchSettingStore.dispatch(BranchSettingsActions.selectDefaultPrintableFormatInit({branchGuid: DEFAULT_BRANCH.toString(),serverDocType:"INTERNAL_SALES_CASHBILL"}))

          return this.branchService.getByGuid(DEFAULT_BRANCH, this.apiVisa).pipe(
            mergeMap((branchRes) => {
              //console.log('DEFAULT_BRANCH branchRes',branchRes)
              const branchAction = InternalSalesReturnActions.loadBranchCompanySuccess({
                branch: branchRes.data.bl_fi_mst_branch,
                company: null,
              });

              if (DEFAULT_COMPANY) {
                return this.companyService.getByGuid(DEFAULT_COMPANY, this.apiVisa).pipe(
                  map((compRes) => {
                    return InternalSalesReturnActions.loadBranchCompanySuccess({
                      branch: branchRes.data.bl_fi_mst_branch,
                      company: compRes.data.bl_fi_mst_comp
                    });
                  }),
                  catchError((compErr) => {
                    console.error('Error in companyService:', compErr);
                    return of(
                      InternalSalesReturnActions.loadBranchCompanFailed({
                        err: compErr.message,
                      })
                    );
                  })
                );
              } else {
                return of(branchAction);
              }
            }),
            catchError((branchErr) => {
              console.error('Error in branchService:', branchErr);
              return of(
                InternalSalesReturnActions.loadBranchCompanFailed({
                  err: branchErr.message,
                })
              );
            })
          );
        } else {
          return EMPTY;
        }
      })
    )
  );

  recalculateDocBalance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InternalSalesReturnActions.recalculateDocBalance, ContraActions.loadContraSuccess),
      withLatestFrom(
        this.store.select(PNSSelectors.selectAll),
        this.store.select(ContraSelectors.selectAll),
        this.store.select(SettlementSelectors.selectAll),
      ),
      map(([action, pns,  contra, payment]) => {
        const totalPNS = (pns.filter(entity => entity.status === 'ACTIVE')
            .map(entity => (Number(entity.amount_txn) || 0) * Number(entity.amount_signum))
            .reduce((acc, amount) => acc + amount, 0)
        );
        const totalContra = (contra.filter(entity => entity.status !== 'DELETED')
            .map(entity => (Number(entity.amount_contra) || 0))
            .reduce((acc, amount) => acc + amount, 0)
        );
        const totalPayment = (payment.filter(entity => entity.status === 'ACTIVE')
            .map(entity => (Number(entity.amount_txn) || 0)* Number(entity.amount_signum))
            .reduce((acc, amount) => acc + amount, 0)
        );
        let docOpen = Number(totalPNS) + Number(totalPayment);
        if (isNaN(docOpen)) docOpen = 0;
        const bal = Number(docOpen) + Number(totalContra);
        this.store.dispatch(
          InternalSalesReturnActions.selectDocOpenAmount({ docOpenAmount: docOpen })
        );
        this.store.dispatch(
          InternalSalesReturnActions.selectTotalContra({ totalContra: totalContra })
        );
        this.store.dispatch(
          InternalSalesReturnActions.selectDocArapBalance({ docArapBalance: bal })
        );

        return InternalSalesReturnActions.recalculateDocBalanceSuccess();
      })
    )
  );

  addMultipleContraInit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        InternalSalesReturnActions.editInternalSalesReturnSuccess,
        InternalSalesReturnActions.updatePostingStatusSuccess,
        InternalSalesReturnActions.editSalesReturnFinalSuccess
      ),
      withLatestFrom(this.store.select(ContraSelectors.selectAll)),
      mergeMap(([action, contra]) => {
        let newContra : any []= contra.filter(c=>!c.status);
        newContra = newContra.map(c => {
          const { bl_fi_generic_doc_hdr_server_doc_1, ...rest } = c;
          return { ...rest, status: 'ACTIVE' };
        });
        let arapContainerList = newContra.map(c => {
          let arapContainer = new GenericDocARAPContainerModel();
          arapContainer.bl_fi_generic_doc_arap_contra = c;
          return arapContainer;
        });
        let canContra = false;
        if(arapContainerList.length){
          canContra = true;
        }
        if (!canContra) {
          return of(
            InternalSalesReturnActions.addMultipleContraFailed({
              error: "Contra list is empty",
            })
          );
        }

        return this.apiService.contraMulti(arapContainerList, this.apiVisa).pipe(
          map((a: any) => {
            return InternalSalesReturnActions.addMultipleContraSucess({
              contra: a.data,
            });
          }),
          catchError((err) => {
            this.toastr.error(err.message, "Documents contra unsuccessfully", {
              tapToDismiss: true,
              progressBar: true,
              timeOut: 1300,
            });
            return of(
              InternalSalesReturnActions.addMultipleContraFailed({
                error: err.message,
              })
            );
          })
        );
      })
    )
  );

  loadBranchCompanyAndGroupDiscountItem$ = createEffect(() =>
  this.actions$.pipe(
    ofType(InternalSalesReturnActions.loadBranchCompanySuccess),
    mergeMap((action) => {
      const roundingItem = action.branch?.rounding_item_guid ?? action.company?.rounding_item_guid;
      const roundingFiveCent = action.branch?.rounding_five_cent ?? action.company?.rounding_five_cent;
      const groupDiscountItem = action.branch?.group_discount_item_guid ?? action.company?.group_discount_item_guid;
      const eInvoiceEnabled = (action.company && action.company.einvoice_status === 'ENABLED') ? true : false;
      this.isSalesReturnStore.dispatch(InternalSalesReturnActions.selectEInvoiceEnabled({val:eInvoiceEnabled}));
      this.isSalesReturnStore.dispatch(InternalSalesReturnActions.getCurrentCompanyDetails({ compDetails: action.company}));
      const roundingItem$ = roundingItem ? this.fiService.getByGuid(roundingItem.toString(), this.apiVisa) : of(null);
      const groupDiscountItem$ = groupDiscountItem ? this.fiService.getByGuid(groupDiscountItem.toString(), this.apiVisa) : of(null);
      this.isSalesReturnStore.dispatch(InternalSalesReturnActions.selectCOA({coa:action.company?.chart_of_acc_guid}));
      return forkJoin([roundingItem$, groupDiscountItem$]).pipe(
        mergeMap(([roundingItemRes, groupDiscountItemRes]) => {
          const actions = [];

          if (roundingItemRes) {
            actions.push(InternalSalesReturnActions.loadRoundingItemSuccess({
              item: roundingItemRes.data,
              isRounding: roundingFiveCent
            }));
          }

          if (groupDiscountItemRes) {
            actions.push(InternalSalesReturnActions.loadGroupDiscountItemSuccess({
              item: groupDiscountItemRes.data
            }));
          }

          return from(actions);
        }),
        catchError((err) => of(
          InternalSalesReturnActions.loadRoundingItemFailed({
            err: err.message,
          })
        ))
      );
    })
  )
  );

  loadSalesReturns$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InternalSalesReturnActions.loadInternalSalesReturnInit),
      switchMap((action) =>
        this.isdnService
          .getByCriteriaSnapshot(action.pagination, this.apiVisa)
          .pipe(
            mergeMap((b) => {
              const source: Observable<GenericDocContainerModel>[] = [];
              b.data.forEach((doc) =>
                source.push(
                  zip(
                    doc.bl_fi_generic_doc_hdr.guid_branch
                      ? this.brnchService
                        .getByGuid(
                          doc.bl_fi_generic_doc_hdr.guid_branch?.toString(),
                          this.apiVisa
                        )
                        .pipe(catchError((err) => of(err)))
                      : of(null),
                    doc.bl_fi_generic_doc_hdr.doc_entity_hdr_guid
                      ? this.customerService
                        .getByGuid(
                          doc.bl_fi_generic_doc_hdr.doc_entity_hdr_guid?.toString(),
                          this.apiVisa
                        )
                        .pipe(catchError((err) => of(err)))
                      : of(null),
                    this.profileService
                      .getProfileName(
                        this.apiVisa,
                        doc.bl_fi_generic_doc_hdr.created_by_subject_guid.toString()
                      )
                      .pipe(catchError((err) => of(err))),
                    doc.bl_fi_generic_doc_hdr.sales_entity_hdr_guid ||
                      (<any>doc.bl_fi_generic_doc_hdr.property_json)
                        ?.salesAgent ||
                      (<any>doc.bl_fi_generic_doc_hdr.doc_entity_hdr_json)
                        ?.salesAgent
                      ? this.empService
                        .getByGuid(
                          doc.bl_fi_generic_doc_hdr.sales_entity_hdr_guid
                            ? doc.bl_fi_generic_doc_hdr.sales_entity_hdr_guid
                            : (<any>doc.bl_fi_generic_doc_hdr.property_json)
                              ?.salesAgent
                              ? (<any>(
                                doc.bl_fi_generic_doc_hdr.property_json
                              ))?.salesAgent.salesAgentGuid.toString()
                              : (<any>(
                                doc.bl_fi_generic_doc_hdr.doc_entity_hdr_json
                              ))?.salesAgent?.toString(),
                          this.apiVisa
                        )
                        .pipe(catchError((err) => of(err)))
                      : of(null)
                  ).pipe(
                    map(([b_a, b_b, b_c, b_d]) => {
                      doc = Object.assign(
                        {
                          branch_name: b_a.error
                            ? b_a.error.code
                            : b_a.data.bl_fi_mst_branch.name,
                        },
                        {
                          customer_name: b_b.error
                            ? b_b.error.code
                            : b_b.data.bl_fi_mst_entity_hdr.name,
                        },
                        {
                          created_by_name: b_c.error
                            ? b_c.error.code
                            : b_c.data,
                        },
                        {
                          sales_agent: b_d
                            ? b_d.error
                              ? b_d.error.code
                              : b_d.data.bl_fi_mst_entity_hdr.name
                            : "Unknown",
                        },
                        doc
                      );
                      return doc;
                    })
                  )
                )
              );
              return iif(
                () => b.data.length > 0,
                forkJoin(source).pipe(
                  map((b_inner) => {
                    b.data = b_inner;
                    return b;
                  })
                ),
                of(b)
              );
            })
          )
          .pipe(
            map((a) => {
              return InternalSalesReturnActions.loadInternalSalesReturnSuccess({
                salesReturns: a.data,
              });
            }),
            catchError((err) => {
              return of(
                InternalSalesReturnActions.loadInternalSalesReturnFailed({
                  error: err.message,
                })
              );
            })
          )
      )
    )
  );

  searchSalesReturns$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InternalSalesReturnActions.searchSalesReturnInit),
      switchMap((action) =>
        this.isdnService
          .getBySnapshotCustomHdrLinesQuery(action.searchDto, this.apiVisa)
          .pipe(
            mergeMap((b) => {
              const source: Observable<GenericDocContainerModel>[] = [];
              b.data.forEach((doc) =>
                source.push(
                  zip(
                    doc.bl_fi_generic_doc_hdr.guid_branch
                      ? this.brnchService
                        .getByGuid(
                          doc.bl_fi_generic_doc_hdr.guid_branch?.toString(),
                          this.apiVisa
                        )
                        .pipe(catchError((err) => of(err)))
                      : of(null),
                    doc.bl_fi_generic_doc_hdr.doc_entity_hdr_guid
                      ? this.customerService
                        .getByGuid(
                          doc.bl_fi_generic_doc_hdr.doc_entity_hdr_guid?.toString(),
                          this.apiVisa
                        )
                        .pipe(catchError((err) => of(err)))
                      : of(null),
                    doc.bl_fi_generic_doc_hdr.sales_entity_hdr_guid ||
                      (<any>doc.bl_fi_generic_doc_hdr.property_json)
                        ?.salesAgent ||
                      (<any>doc.bl_fi_generic_doc_hdr.doc_entity_hdr_json)
                        ?.salesAgent
                      ? this.empService
                        .getByGuid(
                          doc.bl_fi_generic_doc_hdr.sales_entity_hdr_guid
                            ? doc.bl_fi_generic_doc_hdr.sales_entity_hdr_guid
                            : (<any>doc.bl_fi_generic_doc_hdr.property_json)
                              ?.salesAgent
                              ? (<any>(
                                doc.bl_fi_generic_doc_hdr.property_json
                              ))?.salesAgent.salesAgentGuid.toString()
                              : (<any>(
                                doc.bl_fi_generic_doc_hdr.doc_entity_hdr_json
                              ))?.salesAgent?.toString(),
                          this.apiVisa
                        )
                        .pipe(catchError((err) => of(err)))
                      : of(null)
                  ).pipe(
                    map(([b_a, b_b, b_d]) => {
                      doc = Object.assign(
                        {
                          branch_name: b_a.error
                            ? b_a.error.code
                            : b_a.data.bl_fi_mst_branch.name,
                        },
                        {
                          customer_name: b_b.error
                            ? b_b.error.code
                            : b_b.data.bl_fi_mst_entity_hdr.name,
                        },
                        {
                          sales_agent: b_d
                            ? b_d.error
                              ? b_d.error.code
                              : b_d.data.bl_fi_mst_entity_hdr.name
                            : "Unknown",
                        },
                        doc
                      );
                      return doc;
                    })
                  )
                )
              );
              return iif(
                () => b.data.length > 0,
                forkJoin(source).pipe(
                  map((b_inner) => {
                    b.data = b_inner;
                    return b;
                  })
                ),
                of(b)
              );
            })
          )
          .pipe(
            map((a) => {
              if (a.data.length > 0) {
                // this.previousSnapshot = a.data[0].bl_fi_generic_doc_hdr.guid.toString();
                this.snapshot =
                  a.data[
                    a.data.length - 1
                  ].bl_fi_generic_doc_hdr.guid.toString();
              }
              console.log("listing data", a.data);
              return InternalSalesReturnActions.loadInternalSalesReturnSuccess({
                salesReturns: a.data,
                snapshotGuid: this.snapshot,
              });
            }),
            catchError((err) => {
              return of(
                InternalSalesReturnActions.loadInternalSalesReturnFailed({
                  error: err.message,
                })
              );
            })
          )
      )
    )
  );

  getTotalRecords$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InternalSalesReturnActions.getTotalRecords),
      switchMap((action) =>
        this.isdnService
          .getBySnapshotCountQuery(action.searchDto, this.apiVisa)
          .pipe(
            map((a) => {
              return InternalSalesReturnActions.getTotalRecordsSuccess({
                totalRecords: +a.data,
              });
            }),
            catchError((err) => {
              return of(
                InternalSalesReturnActions.getTotalRecordsFailed({
                  error: err.message,
                })
              );
            })
          )
      )
    )
  );

  convertToActive$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InternalSalesReturnActions.convertToActiveInit),
        withLatestFrom(
          this.store.select(HDRSelectors.selectHdr),
          this.store.select(PNSSelectors.selectAll),
          this.store.select(SettlementSelectors.selectAll),
          this.isSalesReturnStore.select(
            InternalSalesReturnSelectors.selectTempDoc
          ),
          this.isSalesReturnStore.select(
            InternalSalesReturnSelectors.getMyConversionActionState
          )
        ),
        filter(
          ([action, hdr, pns, stl, temp, myConversionActionState]) =>
            !myConversionActionState
        ),
        map(([action, hdr, pns, stl, temp]) => {
          const container = new GenericDocContainerModel();
          (hdr.guid = temp.bl_fi_generic_doc_hdr.guid),
            (container.bl_fi_generic_doc_hdr = hdr);
          container.bl_fi_generic_doc_hdr.revision =
            temp.bl_fi_generic_doc_hdr.revision;
          container.bl_fi_generic_doc_hdr.status = "ACTIVE";
          container.bl_fi_generic_doc_hdr.doc_source_type = "INTERNAL";
          container.bl_fi_generic_doc_hdr.amount_signum = 0;
          container.bl_fi_generic_doc_hdr.created_by_subject_guid =
            localStorage.getItem("guid");
          container.bl_fi_generic_doc_hdr.client_doc_type =
            "INTERNAL_SALES_RETURN_REQUEST";
          // container.bl_fi_generic_doc_hdr.date_txn = new Date(
          //   container.bl_fi_generic_doc_hdr.date_txn
          // ).toISOString();

          stl.forEach((l) => (l.guid = null));
          pns.forEach((item: any) => {
            item.date_txn = container.bl_fi_generic_doc_hdr.date_txn;
            if (
              item.item_sub_type === "SERIAL_NUMBER" &&
              item.serial_no &&
              Array.isArray(item.serial_no)
            ) {
              const serialArr = item.serial_no.map((sn) => sn["sn_id"]);
              item.serial_no = {
                serialNumbers: serialArr,
              };
            }
            // If condition doesnt matter
            if (
              item.line_property_json &&
              (<any>item.line_property_json).delivery_instructions
            ) {
              const ext = new bl_fi_generic_doc_ext_RowClass();
              ext.guid_doc_hdr = hdr.guid.toString();
              ext.guid_doc_line = item.guid;
              ext.param_code = "REQUESTED_DELIVERY_DATE";
              ext.param_name = "REQUESTED_DELIVERY_DATE";
              ext.param_type = "DATE";
              ext.value_datetime = (<any>(
                item.line_property_json
              )).delivery_instructions.deliveryDate;
              ext.value_json = (<any>(
                item.line_property_json
              )).delivery_instructions;
              container.bl_fi_generic_doc_ext.push(ext);
            }

            if (hdr.delivery_branch_guid && hdr.delivery_location_guid) {
              item.delivery_branch_guid = hdr.delivery_branch_guid
                ? hdr.delivery_branch_guid
                : item.delivery_branch_guid;
              item.delivery_location_guid = hdr.delivery_location_guid
                ? hdr.delivery_location_guid
                : item.delivery_location_guid;
              item.delivery_branch_code = hdr.delivery_branch_code
                ? hdr.delivery_branch_code
                : item.delivery_branch_code;
              item.delivery_location_code = hdr.delivery_location_code
                ? hdr.delivery_location_code
                : item.delivery_location_code;
            }
          });

          container.bl_fi_generic_doc_line = [...pns, ...stl];

          console.log("Create model", container);
          return container;
        }),

        exhaustMap((e) => {
          if (e.bl_fi_generic_doc_hdr.sales_entity_hdr_guid !== null) {
            // check if sales_entity_hdr_guid is not null
            return this.entityService
              .getByGuid(
                e.bl_fi_generic_doc_hdr.sales_entity_hdr_guid.toString(),
                this.apiVisa
              )
              .pipe(
                map((b_inner) => {
                  //  assign name
                  e.bl_fi_generic_doc_hdr.sales_entity_hdr_name =
                    b_inner.data.bl_fi_mst_entity_hdr.name;
                  e.bl_fi_generic_doc_hdr.sales_entity_hdr_code =
                    b_inner.data.bl_fi_mst_entity_hdr.employee_code;
                  return e;
                })
              );
          } else {
            // return observable of e if sales_entity_hdr_guid is null
            return of(e);
          }
        }),

        exhaustMap((a) =>
          this.branchService
            .getByGuid(
              a.bl_fi_generic_doc_hdr.guid_branch.toString(),
              this.apiVisa
            )
            .pipe(
              map((b_inner) => {
                a.bl_fi_generic_doc_hdr.guid_comp =
                  b_inner.data.bl_fi_mst_branch.comp_guid;
                //  assign code_branch
                a.bl_fi_generic_doc_hdr.code_branch =
                  b_inner.data.bl_fi_mst_branch.code;
                a.bl_fi_generic_doc_line.forEach((lineItem) => {
                  lineItem.guid_comp = a.bl_fi_generic_doc_hdr.guid_comp;
                  lineItem.guid_branch = a.bl_fi_generic_doc_hdr.guid_branch;
                  lineItem.guid_store = a.bl_fi_generic_doc_hdr.guid_store;
                  if (a.bl_fi_generic_doc_hdr.delivery_location_guid) {
                    lineItem.delivery_location_guid = a.bl_fi_generic_doc_hdr.delivery_location_guid;
                  }
                });
                return a;
              })
            )
        ),
        // to get the company code
        exhaustMap((b) =>
          this.compService
            .getByGuid(
              b.bl_fi_generic_doc_hdr.guid_comp.toString(),
              this.apiVisa
            )
            .pipe(
              map((c_inner) => {
                // assign the code_company
                b.bl_fi_generic_doc_hdr.code_company =
                  c_inner.data.bl_fi_mst_comp.code;
                return b;
              })
            )
        ),

        // to get the location code
        exhaustMap((c) =>
          this.locService
            .getByGuid(
              c.bl_fi_generic_doc_hdr.guid_store.toString(),
              this.apiVisa
            )
            .pipe(
              map((d_inner) => {
                // assign the code_location
                c.bl_fi_generic_doc_hdr.code_location =
                  d_inner.data.bl_inv_mst_location.code;
                return c;
              })
            )
        ),
        exhaustMap((e) =>
          forkJoin({
            deliveryBranch: e.bl_fi_generic_doc_hdr?.delivery_branch_guid
              ? this.branchService.getByGuid(
                e.bl_fi_generic_doc_hdr.delivery_branch_guid.toString(),
                this.apiVisa
              )
              : of(null), // Emit null if delivery_branch_guid is empty

            deliveryLocation: e.bl_fi_generic_doc_hdr?.delivery_location_guid
              ? this.locService.getByGuid(
                e.bl_fi_generic_doc_hdr.delivery_location_guid.toString(),
                this.apiVisa
              )
              : of(null), // Emit null if delivery_location_guid is empty
          }).pipe(
            map(({ deliveryBranch, deliveryLocation }) => {
              // Handle the result of both API calls
              if (e.bl_fi_generic_doc_hdr.delivery_branch_guid !== null) {
                e.bl_fi_generic_doc_hdr.delivery_branch_code =
                  deliveryBranch?.data?.bl_fi_mst_branch.code || "";
                e.bl_fi_generic_doc_line.forEach((lineItem) => {
                  lineItem.delivery_branch_code =
                    deliveryBranch?.data?.bl_fi_mst_branch.code || "";
                });
              }
              if (e.bl_fi_generic_doc_hdr.delivery_location_guid !== null) {
                e.bl_fi_generic_doc_hdr.delivery_location_code =
                  deliveryLocation?.data?.bl_inv_mst_location.code || "";
                e.bl_fi_generic_doc_line.forEach((lineItem) => {
                  lineItem.delivery_location_code =
                    deliveryLocation?.data?.bl_inv_mst_location.code || "";
                });
              }
              return e;
            })
          )
        ),
        exhaustMap((d) =>
          this.isdnService.put(d, this.apiVisa).pipe(
            map((a: any) => {
              setTimeout(() => {
                this.updateDraft(a.data);
              }, 2000);
              return InternalSalesReturnActions.convertToActiveSuccess({
                hdrGuid: a.data.bl_fi_generic_doc_hdr.guid,
              });
            }),
            catchError((err) => {
              this.toastr.error(err.message, "Error", {
                tapToDismiss: true,
                progressBar: true,
                timeOut: 2000,
              });
              return of(
                InternalSalesReturnActions.convertToActiveFailed({
                  error: err.message,
                })
              );
            })
          )
        )
      ) as any
  );

  createGenDocLink$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        InternalSalesReturnActions.convertToActiveSuccess,
        InternalSalesReturnActions.editInternalSalesReturnSuccess
      ),
      withLatestFrom(
        this.store.select(LinkSelectors.selectAll),
        this.store.select(HDRSelectors.selectHdr)
      ),
      map(([action, link, hdr]) => {
        let container: GenDocLinkContainerModel[] = [];

        link.forEach((l) => {
          if (l.status === "DRAFT") {
            let docLink: GenDocLinkContainerModel =
              new GenDocLinkContainerModel();
            l.guid = null;
            if (action.hdrGuid) {
              l.guid_doc_2_hdr = action.hdrGuid;
            } else {
              l.guid_doc_2_hdr = hdr.guid;
            }
            l.status = "ACTIVE";
            docLink.bl_fi_generic_doc_link = l;
            container.push(docLink);
          }
        });
        return container;
      }),
      exhaustMap((d) =>
        this.genDocLinkService.post(d, this.apiVisa).pipe(
          map((a) => {
            return InternalSalesReturnActions.creatInternalSalesReturnGenDocLinkSuccess();
          }),
          catchError((err) => {
            this.toastr.error(err.message, "Error", {
              tapToDismiss: true,
              progressBar: true,
              timeOut: 1300,
            });
            return of(
              InternalSalesReturnActions.createInternalSalesReturnGenDocLinkFailed(
                { error: err.message }
              )
            );
          })
        )
      )
    )
  );

  editInternalSalesReturn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InternalSalesReturnActions.editInternalSalesReturnInit),
      withLatestFrom(
        this.isSalesReturnStore.select(
          InternalSalesReturnSelectors.selectSalesReturn
        ),
        this.store.select(HDRSelectors.selectHdr),
        this.store.select(PNSSelectors.selectAll),
        this.store.select(SettlementSelectors.selectAll)
      ),
      map(([action, genDoc, hdr, pns, stl]) => {
        genDoc.bl_fi_generic_doc_hdr = hdr;
        stl.forEach((l) => {
          // hacky condition to check if payment exist before
          if (l.guid.toString().length !== 36) l.guid = null;
        });
        genDoc.bl_fi_generic_doc_line = [...pns, ...stl];
        genDoc.bl_fi_generic_doc_link = null;

        pns.forEach((item: any) => {
          item.base_doc_line_ccy = hdr.base_doc_ccy;
          item.base_doc_line_xrate = hdr.base_doc_xrate;
          item.doc_ccy = hdr.doc_ccy;
          item.foreign_ccy = hdr.foreign_ccy;
          if (
            item.item_sub_type === "SERIAL_NUMBER" &&
            item.serial_no &&
            Array.isArray(item.serial_no)
          ) {
            const serialArr = item.serial_no.map((sn) => sn["sn_id"]);
            item.serial_no = {
              serialNumbers: serialArr,
            };
          }
          // If condition doesn't matter
          if (
            item.line_property_json &&
            (<any>item.line_property_json).delivery_instructions
          ) {
            const extIndex = genDoc.bl_fi_generic_doc_ext.findIndex(
              (x) =>
                x.param_code === "REQUESTED_DELIVERY_DATE" &&
                x.guid_doc_line === item.guid
            );
            if (extIndex >= 0) {
              genDoc.bl_fi_generic_doc_ext[extIndex].value_datetime = (<any>(
                item.line_property_json
              )).delivery_instructions.deliveryDate;
              genDoc.bl_fi_generic_doc_ext[extIndex].value_json = (<any>(
                item.line_property_json
              )).delivery_instructions;
              genDoc.bl_fi_generic_doc_ext[extIndex].status = item.status;
            } else {
              const ext = new bl_fi_generic_doc_ext_RowClass();
              ext.guid_doc_hdr = hdr.guid.toString();
              ext.guid_doc_line = item.guid;
              ext.param_code = "REQUESTED_DELIVERY_DATE";
              ext.param_name = "REQUESTED_DELIVERY_DATE";
              ext.param_type = "DATE";
              ext.value_datetime = (<any>(
                item.line_property_json
              )).delivery_instructions.deliveryDate;
              ext.value_json = (<any>(
                item.line_property_json
              )).delivery_instructions;
              genDoc.bl_fi_generic_doc_ext.push(ext);
            }
          }
        });

        if (!genDoc.bl_fi_generic_doc_hdr.doc_source_type || genDoc.bl_fi_generic_doc_hdr.amount_signum === null) {
          genDoc.bl_fi_generic_doc_hdr.doc_source_type = "INTERNAL";
          genDoc.bl_fi_generic_doc_hdr.amount_signum = 0;
        }

        return genDoc;
      }),
      exhaustMap((a) =>
        this.isdnService
          .getByGuid(a.bl_fi_generic_doc_hdr.guid.toString(), this.apiVisa)
          .pipe(
            map((b_inner) => {
              a.bl_fi_generic_doc_hdr.server_doc_1 =
                b_inner.data.bl_fi_generic_doc_hdr.server_doc_1;
              a.bl_fi_generic_doc_hdr.server_doc_2 =
                b_inner.data.bl_fi_generic_doc_hdr.server_doc_2;
              a.bl_fi_generic_doc_hdr.server_doc_3 =
                b_inner.data.bl_fi_generic_doc_hdr.server_doc_3;
              a.bl_fi_generic_doc_hdr.server_doc_4 =
                b_inner.data.bl_fi_generic_doc_hdr.server_doc_4;
              a.bl_fi_generic_doc_hdr.server_doc_5 =
                b_inner.data.bl_fi_generic_doc_hdr.server_doc_5;

              a.bl_fi_generic_doc_hdr.client_doc_1 =
                b_inner.data.bl_fi_generic_doc_hdr.client_doc_1;
              a.bl_fi_generic_doc_hdr.client_doc_2 =
                b_inner.data.bl_fi_generic_doc_hdr.client_doc_2;
              a.bl_fi_generic_doc_hdr.client_doc_3 =
                b_inner.data.bl_fi_generic_doc_hdr.client_doc_3;
              a.bl_fi_generic_doc_hdr.client_doc_4 =
                b_inner.data.bl_fi_generic_doc_hdr.client_doc_4;
              a.bl_fi_generic_doc_hdr.client_doc_5 =
                b_inner.data.bl_fi_generic_doc_hdr.client_doc_5;
              return a;
            })
          )
      ),
      exhaustMap((a) =>
        this.branchService
          .getByGuid(
            a.bl_fi_generic_doc_hdr.guid_branch.toString(),
            this.apiVisa
          )
          .pipe(
            map((b_inner) => {
              a.bl_fi_generic_doc_hdr.guid_comp =
                b_inner.data.bl_fi_mst_branch.comp_guid;
              //  assign code_branch
              a.bl_fi_generic_doc_hdr.code_branch =
                b_inner.data.bl_fi_mst_branch.code;
              a.bl_fi_generic_doc_line.forEach((lineItem) => {
                lineItem.guid_comp = a.bl_fi_generic_doc_hdr.guid_comp;
                lineItem.guid_branch = a.bl_fi_generic_doc_hdr.guid_branch;
                lineItem.guid_store = a.bl_fi_generic_doc_hdr.guid_store;
                if (a.bl_fi_generic_doc_hdr.delivery_location_guid) {
                  lineItem.delivery_location_guid = a.bl_fi_generic_doc_hdr.delivery_location_guid;
                }
              });
              return a;
            })
          )
      ),
      // to get the company code
      exhaustMap((b) =>
        this.compService
          .getByGuid(b.bl_fi_generic_doc_hdr.guid_comp.toString(), this.apiVisa)
          .pipe(
            map((c_inner) => {
              // assign the code_company
              b.bl_fi_generic_doc_hdr.code_company =
                c_inner.data.bl_fi_mst_comp.code;
              return b;
            })
          )
      ),

      // to get the location code
      exhaustMap((c) =>
        this.locService
          .getByGuid(
            c.bl_fi_generic_doc_hdr.guid_store.toString(),
            this.apiVisa
          )
          .pipe(
            map((d_inner) => {
              // assign the code_location
              c.bl_fi_generic_doc_hdr.code_location =
                d_inner.data.bl_inv_mst_location.code;
              return c;
            })
          )
      ),
      exhaustMap((d) =>
        this.isdnService.put(d, this.apiVisa).pipe(
          map((a: any) => {
            this.viewColFacade.showSuccessToast(
              ToastConstants.editInternalSalesReturnSuccess
            );
            this.viewColFacade.updateInstance(0, {
              deactivateAdd: false,
              deactivateList: false,
            });
            this.viewColFacade.resetIndex(0);
            return InternalSalesReturnActions.editInternalSalesReturnSuccess({
              hdrGuid: a.data.bl_fi_generic_doc_hdr.guid,
            });
          }),
          catchError((err) => {
            let errMsg = err.message;
            if (err.error.data.length) {
              if (
                err.error.data[0].errorCode ===
                "API_TNT_DM_ERP_GEN_DOC_LINE_DRAFT_LOCK_SERIAL_NUMBER_OBJECT_SN_ID_COMP_GUID_INV_ITEM_GUID_SERVER_DOC_TYPE_COMBINATION_ALREADY_EXISTS"
              ) {
                errMsg = "One of the serial numbers is already locked";
              }
            }
            this.toastr.error(errMsg, "Error", {
              tapToDismiss: true,
              progressBar: true,
              timeOut: 2000,
            });
            return of(
              InternalSalesReturnActions.editInternalSalesReturnFailed({
                error: err.message,
              })
            );
          })
        )
      )
    )
  );

  updateGenDocLink$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ...[
          InternalSalesReturnActions.editInternalSalesReturnSuccess,
        ]
      ),
      withLatestFrom(
        this.store.select(HDRSelectors.selectHdr),
        this.store.select(LinkSelectors.selectAll)
      ),
      map(([action, hdr, link]) => {
        let container: GenDocLinkContainerModel[] = [];

        // let updatedLink = link.filter((a) => a.status === "ACTIVE");
        link.forEach((l) => {
          if (
            (l.status === "ACTIVE" || l.status === "DELETED") &&
            l.guid !== null
          ) {
            let docLink: GenDocLinkContainerModel =
              new GenDocLinkContainerModel();
            l.guid_doc_2_hdr = hdr.guid;
            docLink.bl_fi_generic_doc_link = l;
            container.push(docLink);
          }
        });
        return container;
      }),
      exhaustMap((d) =>
        this.genDocLinkService.put(d, this.apiVisa).pipe(
          map((a: any) => {
            return InternalSalesReturnActions.editInternalSalesReturnGenDocLinkSuccess();
          }),
          catchError((err) => {
            this.toastr.error(err.message, "Error", {
              tapToDismiss: true,
              progressBar: true,
              timeOut: 1300,
            });
            return of(
              InternalSalesReturnActions.editInternalSalesReturnGenDocLinkFailed(
                { error: err.message }
              )
            );
          })
        )
      )
    )
  );

  unlockDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ...[
          InternalSalesReturnActions.editInternalSalesReturnSuccess,
          InternalSalesReturnActions.editSalesReturnFinalSuccess,
          InternalSalesReturnActions.unlockDocument
        ]
      ),
      map((action) => {
        let genDocLockDto = new GenericDocEditingLockDto();
        genDocLockDto.generic_doc_hdr_guid = action.hdrGuid;

        console.log("genDocLockDto", genDocLockDto);
        return genDocLockDto;
      }),
      exhaustMap((d) =>
        this.genericDocLockService.unblockDocument(d, this.apiVisa).pipe(
          map((a: any) => {
            return InternalSalesReturnActions.unlockDocumentSuccess();
          }),
          catchError((err) => {
            this.toastr.error(err.message, "Error", {
              tapToDismiss: true,
              progressBar: true,
              timeOut: 1300,
            });
            return of(
              InternalSalesReturnActions.unlockDocumentFailed({
                error: err.message,
              })
            );
          })
        )
      )
    )
  );

  deleteInternalSalesReturn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InternalSalesReturnActions.deleteInternalSalesReturnInit),
      withLatestFrom(this.store.select(HDRSelectors.selectHdr)),
      exhaustMap(([a, b]) =>
        this.isdnService.delete(b.guid.toString(), this.apiVisa).pipe(
          map(() => {
            this.viewColFacade.showSuccessToast(
              ToastConstants.deleteInternalSalesReturnSuccess
            );
            this.viewColFacade.updateInstance(0, {
              deactivateAdd: false,
              deactivateList: false,
            });
            this.viewColFacade.resetIndex(0);
            // this.viewColFacade.resetDraft();
            return InternalSalesReturnActions.deleteInternalSalesReturnSuccess();
          }),
          catchError((err) => {
            this.viewColFacade.showFailedToast(err);
            return of(
              InternalSalesReturnActions.deleteInternalSalesReturnFailed({
                error: err.message,
              })
            );
          })
        )
      )
    )
  );

  // selectEntity$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(InternalSalesReturnActions.selectSalesReturnForEdit),
  //     exhaustMap((action) =>
  //       this.entityService
  //         .getEntityByHdrGuids(
  //           action.genDoc.bl_fi_generic_doc_hdr.doc_entity_hdr_guid.toString(),
  //           this.apiVisa
  //         )
  //         .pipe(
  //           map((a: any) => {
  //             return InternalSalesReturnActions.selectEntityOnEdit({
  //               entity: { entity: a.data[0], contact: null },
  //             });
  //           })
  //         )
  //     )
  //   )
  // );

  selectPricingLink$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InternalSalesReturnActions.selectPricingSchemeLink),
      mergeMap((action) => {
        const paging = new Pagination();
        paging.conditionalCriteria.push({
          columnName: "item_hdr_guid",
          operator: "=",
          value: action.item.item_guid.toString(),
        });
        return this.pslService.getByCriteria(paging, this.apiVisa).pipe(
          mergeMap((result: any) => {
            let allIds = result.data.map((id) =>
              this.getPricing(
                id.bl_fi_mst_pricing_scheme_link.guid_pricing_scheme_hdr.toString()
              )
            );
            return forkJoin(...allIds).pipe(
              map((idDataArray) => {
                result.data.forEach((eachContact, index) => {
                  eachContact.pricing_hdr =
                    idDataArray[index]?.data.bl_fi_mst_pricing_scheme_hdr.name;
                });
                return InternalSalesReturnActions.selectPricingSchemeLinkSuccess(
                  { pricing: result.data }
                );
              })
            );
          })
        );
      })
    )
  );
  snapshot: string;
  prevIndex: number;
  prevLocalState: any;

  getPricing(guid: string) {
    return this.pricingService.getByGuid(guid, this.apiVisa);
  }

  addPricingSchemeLink$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InternalSalesReturnActions.addPricingSchemeLinkInit),
      exhaustMap((action) =>
        this.pslService.post(action.link, this.apiVisa).pipe(
          map((resp) => {
            this.viewColFacade.showSuccessToast(
              "Pricing Scheme Added Successfully"
            );
            return InternalSalesReturnActions.addPricingSchemeLinkSuccess();
          }),
          catchError((err) => {
            this.viewColFacade.showFailedToast(err);
            return of(
              InternalSalesReturnActions.addPricingSchemeLinkFailed({
                error: err.message,
              })
            );
          })
        )
      )
    )
  );

  editPricingSchemeLink$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InternalSalesReturnActions.editPricingSchemeLinkInit),
      exhaustMap((action) =>
        this.pslService.put(action.link, this.apiVisa).pipe(
          map((resp) => {
            this.viewColFacade.showSuccessToast(
              "Pricing Scheme Updated Successfully"
            );
            return InternalSalesReturnActions.editPricingSchemeLinkSuccess();
          }),
          catchError((err) => {
            this.viewColFacade.showFailedToast(err);
            return of(
              InternalSalesReturnActions.editPricingSchemeLinkFailed({
                error: err.message,
              })
            );
          })
        )
      )
    )
  );
  // printJasperPdf$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(InternalSalesReturnActions.printJasperPdfInit),
  //     withLatestFrom(
  //       this.store.select(HDRSelectors.selectHdr),
  //       this.isSalesReturnStore.select(
  //         InternalSalesReturnSelectors.selectPrintableFormatGuid
  //       )
  //     ),
  //     exhaustMap(([action, hdr, printableGuid]) =>
  //       this.isdnService
  //         .printJasperPdf(
  //           hdr.guid.toString(),
  //           "CP_COMMERCE_INTERNAL_SALES_ORDERS_JASPER_PRINT_SERVICE",
  //           printableGuid,
  //           AppConfig.apiVisa
  //         )
  //         .pipe(
  //           map((a) => {
  //             const downloadURL = window.URL.createObjectURL(a);
  //             const link = document.createElement("a");
  //             link.href = downloadURL;
  //             link.download = `${hdr.server_doc_1}.pdf`;
  //             link.click();
  //             link.remove();
  //             this.viewColFacade.showSuccessToast(
  //               "Sales Return Exported Successfully"
  //             );
  //             return InternalSalesReturnActions.printJasperPdfSuccess();
  //           }),
  //           catchError((err) => {
  //             this.viewColFacade.showFailedToast(err);
  //             return of(InternalSalesReturnActions.printJasperPdfFailed());
  //           })
  //         )
  //     )
  //   )
  // );

//   openJasperPdf$ = createEffect(() =>
//   this.actions$.pipe(
//     ofType(InternalSalesReturnActions.openJasperPdfInit),
//     withLatestFrom(
//       this.store.select(HDRSelectors.selectHdr),
//       this.isSalesReturnStore.select(
//         InternalSalesReturnSelectors.selectPrintableFormatGuid
//       )
//     ),
//     exhaustMap(([action, hdr, printableGuid]) =>
//       this.isdnService.printJasperPdf(
//         hdr.guid.toString(),
//         "CP_COMMERCE_INTERNAL_SALES_ORDERS_JASPER_PRINT_SERVICE",
//         printableGuid,
//         AppConfig.apiVisa
//       ).pipe(
//         map((blob) => {
//           const blobUrl = window.URL.createObjectURL(blob);
//           window.open(blobUrl, '_blank');

//           // Optional: Revoke the Blob URL after a short delay
//           setTimeout(() => URL.revokeObjectURL(blobUrl), 100);

//           this.viewColFacade.showSuccessToast("Sales Return PDF Opened Successfully");
//           return InternalSalesReturnActions.openJasperPdfSuccess();
//         }),
//         catchError((err) => {
//           this.viewColFacade.showFailedToast(err);
//           return of(InternalSalesReturnActions.openJasperPdfFailed({ error: err }));
//         })
//       )
//     )
//   )
// );

updateContra$ = createEffect(() =>
  this.actions$.pipe(
    ofType(InternalSalesReturnActions.updateContraInit),
    withLatestFrom(
      this.isSalesReturnStore.select(InternalSalesReturnSelectors.selectContraLink)
    ),
    exhaustMap(([action, link]) =>
      this.arapService
        .getByGuid(link.bl_fi_generic_doc_arap_contra.guid, this.apiVisa)
        .pipe(
          map(a => {
            a.data.bl_fi_generic_doc_arap_contra.date_txn = action.txn_date
            return a.data;
          }),
          exhaustMap(b => this.arapService.updateContraTxnDate(b, this.apiVisa).pipe(
            map(a_a => {
              this.toastr.success(
                'Contra details saved successfully',
                'Success',
                {
                  tapToDismiss: true,
                  progressBar: true,
                  timeOut: 1300
                }
              );
              return InternalSalesReturnActions.updateContraSuccess();
            }),
            catchError(err => {
              this.toastr.error(
                err.message,
                'Error',
                {
                  tapToDismiss: true,
                  progressBar: true,
                  timeOut: 1300
                }
              );
              return of(InternalSalesReturnActions.updateContraFailed({ error: err.message }));
            })
          )),
          catchError(err => {
            this.toastr.error(
              err.message,
              'Error',
              {
                tapToDismiss: true,
                progressBar: true,
                timeOut: 1300
              }
            );
            return of(InternalSalesReturnActions.updateContraFailed({ error: err.message }));
          })
        )
    )
  )
);

  deleteContra$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InternalSalesReturnActions.deleteContraInit),
      exhaustMap((action) =>
        this.arapService
          .delete(action.guid, this.apiVisa)
          .pipe(
            map((a_a) => {
              this.viewColFacade.showSuccessToast(ToastConstants.deleteContraSuccess);
              this.viewColFacade.resetIndex(2);
              this.store.dispatch(ContraActions.loadContraInit({ guid_doc_1_hdr: action.docHdrGuid.toString() }));
              this.isSalesReturnStore.dispatch(InternalSalesReturnActions.recalculateDocBalance())
              return InternalSalesReturnActions.addContraSuccess();
            }),
            catchError((err) => {
              this.viewColFacade.showFailedToast(err);
              return of(
                InternalSalesReturnActions.addContraFailed({
                  error: err.message,
                })
              );
            })
          )
      )
    )
  );

  updatePostingStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ...[
          InternalSalesReturnActions.updatePostingStatus,
          InternalSalesReturnActions.editInternalSalesReturnGenDocLinkFinalSuccess,
        ]
      ),
      mergeMap((action) =>
        this.isdnService
          .updatePostingStatus(
            action.status,
            this.apiVisa,
            action.doc.bl_fi_generic_doc_hdr.guid.toString()
          )
          .pipe(
            map((a) => {
              this.viewColFacade.showSuccessToast("Posting Successfully");
              this.viewColFacade.updateInstance(0, {
                deactivateAdd: false,
                deactivateList: false,
              });
              this.viewColFacade.resetIndex(0);
              return InternalSalesReturnActions.updatePostingStatusSuccess({
                doc: a.data,
              });
            }),
            catchError((err) => {
              let errMsg = err.message;
              if (err.error.data.length) {
                const hasSerialErrors = err.error.data
                  .map((error) => error.errorCode)
                  .filter(
                    (message) =>
                      message.includes(
                        "FISCAL_PERIOD_LOCKED",
                        "BL_INV_SERIAL_NUMBER_HDR_OBJECT_SERIAL_NUMBER_DOES_NOT_EXIST_AT_LOCATION"
                      ) ||
                      message.includes(
                        "GENERIC_DOC_LINE_QTY_BASE_AND_SERIAL_NUMBER_QTY_DOES_NOT_MATCH"
                      ) ||
                      message.includes(
                        "GENERIC_DOC_LINE_SERIAL_NUMBER_ID_IS_DUPLICATED"
                      )
                  );
                //console.log('hasSerialErrors',hasSerialErrors);
                if (hasSerialErrors) {
                  const uniqueErrorMessages = new Set<string>();
                  const filteredErrorMessages = err.error.data
                    .map((error) => error.shortMessage)
                    .filter((message) => {
                      if (!uniqueErrorMessages.has(message)) {
                        uniqueErrorMessages.add(message);
                        return true;
                      }
                      return false;
                    });

                  if (filteredErrorMessages.length > 0) {
                    errMsg = filteredErrorMessages.join(".\n") + ".\n";
                  }
                }
              }
              this.toastr.error(errMsg, "Error", {
                tapToDismiss: true,
                progressBar: true,
                timeOut: 2000,
                enableHtml: true,
              });
              return of(
                InternalSalesReturnActions.updatePostingStatusFailed({
                  error: err.message,
                })
              );
            })
          )
      )
    )
  );

  updateGenDocLinkonFinal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InternalSalesReturnActions.editSalesReturnFinalSuccess),
      withLatestFrom(
        this.store.select(HDRSelectors.selectHdr),
        this.store.select(LinkSelectors.selectAll)
      ),
      map(([action, hdr, link]) => {
        let container: GenDocLinkContainerModel[] = [];

        link.forEach((l) => {
          if ((l.status === "ACTIVE" || l.status === "DELETED") && l.guid !== null) {
            let docLink: GenDocLinkContainerModel = new GenDocLinkContainerModel();
            l.guid_doc_2_hdr = hdr.guid;
            docLink.bl_fi_generic_doc_link = l;
            container.push(docLink);
          }
        });

        return { container, originalAction: action }; // Preserve original action
      }),
      exhaustMap(({ container, originalAction }) =>
        this.genDocLinkService.put(container, this.apiVisa).pipe(
          map(() =>
            InternalSalesReturnActions.editInternalSalesReturnGenDocLinkFinalSuccess({
              status: { posting_status: "FINAL" },
              doc: originalAction.doc, // <-- Pass the original doc here
            })
          ),
          catchError((err) => {
            this.toastr.error(err.message, "Error", {
              tapToDismiss: true,
              progressBar: true,
              timeOut: 1300,
            });
            return of(
              InternalSalesReturnActions.editInternalSalesReturnGenDocLinkFinalFailed({
                error: err.message,
              })
            );
          })
        )
      )
    )
  );


  discardInternalSalesReturn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InternalSalesReturnActions.discardInit),
      exhaustMap((action) => {
        const discardArray$ = action.guids.map((guid) =>
          this.isdnService.discardGenericDocument(this.apiVisa, guid).pipe(
            map((resp) => {
              return { guid: guid, error: null };
            }),
            catchError((err) => of({ guid: guid, error: err }))
          )
        );
        return forkJoin(discardArray$).pipe(
          map((combinedResp) => {
            const discardPileLength = combinedResp.length;
            const failedRequests = combinedResp.filter((resp) => resp.error);
            const totalSuccess = discardPileLength - failedRequests.length;
            if (totalSuccess > 0) {
              const msg = !action.fromEdit
                ? `${totalSuccess}/${discardPileLength} documents discarded successfully`
                : `Document discarded successfully`;
              this.viewColFacade.showSuccessToast(msg);
              if (action.fromEdit) {
                this.viewColFacade.updateInstance(0, {
                  deactivateAdd: false,
                  deactivateList: false,
                });
                this.viewColFacade.resetIndex(0);
              }
            }
            if (failedRequests.length > 0) {
              const failMsg = !action.fromEdit
                ? `${failedRequests.length}/${discardPileLength} documents discarded unsuccessfully`
                : `Document discarded unsuccessfully`;
              this.viewColFacade.showFailedToast({
                message: failMsg,
              });
              failedRequests.forEach((fail) =>
                console.error(`${fail.guid}::`, fail.error)
              );
            }
            return InternalSalesReturnActions.discardComplete({
              total: discardPileLength,
              successCount: totalSuccess,
              failureCount: failedRequests.length,
            });
          }),
          catchError((err) => {
            this.viewColFacade.showFailedToast(err);
            return of(
              InternalSalesReturnActions.discardFailure({ error: err })
            );
          })
        );
      })
    )
  );

  getLatestGenDoc$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        InternalSalesReturnActions.addContraSuccess,
        InternalSalesReturnActions.deleteContraSuccess
      ),
      withLatestFrom(this.store.select(HDRSelectors.selectHdr)),
      map(([action, hdr]) => {
        return hdr;
      }),
      exhaustMap((b) =>
        this.isdnService.getByGuid(b.guid.toString(), AppConfig.apiVisa).pipe(
          map((a) => {
            return InternalSalesReturnActions.updateAfterContra({
              genDoc: a.data,
            });
          }),
          catchError((err) => {
            // this.viewColFacade.showFailedToast(err);
            return of(
              InternalSalesReturnActions.updateAfterContraFailed({ error: err })
            );
          })
        )
      )
    )
  );

  voidSalesReturnFinalInit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InternalSalesReturnActions.voidSalesReturnInit),
      mergeMap((action) =>
        this.isdnService
          .voidGenericDocument(
            action.status,
            this.apiVisa,
            action.doc.bl_fi_generic_doc_hdr.guid.toString()
          )
          .pipe(
            map((a) => {
              this.viewColFacade.showSuccessToast(
                "Successfully Void the Document"
              );
              this.viewColFacade.updateInstance(0, {
                deactivateAdd: false,
                deactivateList: false,
              });
              return InternalSalesReturnActions.voidSalesReturnSuccess({
                doc: a.data,
              });
            }),
            catchError((err) => {
              this.viewColFacade.showFailedToast(err);
              return of(
                InternalSalesReturnActions.voidSalesReturnFailed({
                  error: err.message,
                })
              );
            })
          )
      )
    )
  );

  updateDraft(entity: GenericDocContainerModel) {
    this.isdnService
      .getByGuid(
        entity.bl_fi_generic_doc_hdr.guid.toString(),
        AppConfig.apiVisa
      )
      .pipe(
        take(1) // Ensure that the subscription is automatically unsubscribed after the first emission
      )
      .subscribe((response) => {
        const genDoc = { ...response.data };
        delete genDoc["branch_name"];
        delete genDoc["customer_name"];
        delete genDoc["sales_agent"];
        // this one action points to many reducer functions instead of firing many actions
        this.store.dispatch(
          InternalSalesReturnActions.selectGUID({
            guid: entity.bl_fi_generic_doc_hdr.guid.toString(),
          })
        );
        this.store.dispatch(
          InternalSalesReturnActions.selectSalesReturnForEdit({ genDoc })
        );
        this.store.dispatch(
          InternalSalesReturnActions.refreshArapListing({
            refreshArapListing: true,
          })
        );

        this.store.dispatch(
          InternalSalesReturnActions.setEditMode({ editMode: true })
        );
      });
  }

  editInternalSalesReturnBeforeContra$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        InternalSalesReturnActions.editInternalSalesReturnBeforeContraInit
      ),
      withLatestFrom(
        this.isSalesReturnStore.select(
          InternalSalesReturnSelectors.selectSalesReturn
        ),
        this.store.select(HDRSelectors.selectHdr),
        this.store.select(PNSSelectors.selectAll),
        this.store.select(SettlementSelectors.selectAll)
      ),
      map(([action, genDoc, hdr, pns, stl]) => {
        genDoc.bl_fi_generic_doc_hdr = hdr;
        stl.forEach((l) => {
          // hacky condition to check if payment exist before
          if (l.guid.toString().length !== 36) l.guid = null;
        });
        genDoc.bl_fi_generic_doc_line = [...pns, ...stl];
        genDoc.bl_fi_generic_doc_link = null;

        pns.forEach((item: any) => {
          if (
            item.item_sub_type === "SERIAL_NUMBER" &&
            item.serial_no &&
            Array.isArray(item.serial_no)
          ) {
            const serialArr = item.serial_no.map((sn) => sn["sn_id"]);
            item.serial_no = {
              serialNumbers: serialArr,
            };
          }
          // If condition doesn't matter
          if (
            item.line_property_json &&
            (<any>item.line_property_json).delivery_instructions
          ) {
            const extIndex = genDoc.bl_fi_generic_doc_ext.findIndex(
              (x) =>
                x.param_code === "REQUESTED_DELIVERY_DATE" &&
                x.guid_doc_line === item.guid
            );
            if (extIndex >= 0) {
              genDoc.bl_fi_generic_doc_ext[extIndex].value_datetime = (<any>(
                item.line_property_json
              )).delivery_instructions.deliveryDate;
              genDoc.bl_fi_generic_doc_ext[extIndex].value_json = (<any>(
                item.line_property_json
              )).delivery_instructions;
              genDoc.bl_fi_generic_doc_ext[extIndex].status = item.status;
            } else {
              const ext = new bl_fi_generic_doc_ext_RowClass();
              ext.guid_doc_hdr = hdr.guid.toString();
              ext.guid_doc_line = item.guid;
              ext.param_code = "REQUESTED_DELIVERY_DATE";
              ext.param_name = "REQUESTED_DELIVERY_DATE";
              ext.param_type = "DATE";
              ext.value_datetime = (<any>(
                item.line_property_json
              )).delivery_instructions.deliveryDate;
              ext.value_json = (<any>(
                item.line_property_json
              )).delivery_instructions;
              genDoc.bl_fi_generic_doc_ext.push(ext);
            }
          }
        });

        console.log("Update model", genDoc);
        return genDoc;
      }),
      exhaustMap((a) =>
        this.isdnService
          .getByGuid(a.bl_fi_generic_doc_hdr.guid.toString(), this.apiVisa)
          .pipe(
            map((b_inner) => {
              a.bl_fi_generic_doc_hdr.server_doc_1 =
                b_inner.data.bl_fi_generic_doc_hdr.server_doc_1;
              a.bl_fi_generic_doc_hdr.server_doc_2 =
                b_inner.data.bl_fi_generic_doc_hdr.server_doc_2;
              a.bl_fi_generic_doc_hdr.server_doc_3 =
                b_inner.data.bl_fi_generic_doc_hdr.server_doc_3;
              a.bl_fi_generic_doc_hdr.server_doc_4 =
                b_inner.data.bl_fi_generic_doc_hdr.server_doc_4;
              a.bl_fi_generic_doc_hdr.server_doc_5 =
                b_inner.data.bl_fi_generic_doc_hdr.server_doc_5;

              a.bl_fi_generic_doc_hdr.client_doc_1 =
                b_inner.data.bl_fi_generic_doc_hdr.client_doc_1;
              a.bl_fi_generic_doc_hdr.client_doc_2 =
                b_inner.data.bl_fi_generic_doc_hdr.client_doc_2;
              a.bl_fi_generic_doc_hdr.client_doc_3 =
                b_inner.data.bl_fi_generic_doc_hdr.client_doc_3;
              a.bl_fi_generic_doc_hdr.client_doc_4 =
                b_inner.data.bl_fi_generic_doc_hdr.client_doc_4;
              a.bl_fi_generic_doc_hdr.client_doc_5 =
                b_inner.data.bl_fi_generic_doc_hdr.client_doc_5;
              return a;
            })
          )
      ),
      exhaustMap((a) =>
        this.branchService
          .getByGuid(
            a.bl_fi_generic_doc_hdr.guid_branch.toString(),
            this.apiVisa
          )
          .pipe(
            map((b_inner) => {
              a.bl_fi_generic_doc_hdr.guid_comp =
                b_inner.data.bl_fi_mst_branch.comp_guid;
              //  assign code_branch
              a.bl_fi_generic_doc_hdr.code_branch =
                b_inner.data.bl_fi_mst_branch.code;
              a.bl_fi_generic_doc_line.forEach((lineItem) => {
                lineItem.guid_comp = a.bl_fi_generic_doc_hdr.guid_comp;
                lineItem.guid_branch = a.bl_fi_generic_doc_hdr.guid_branch;
                lineItem.guid_store = a.bl_fi_generic_doc_hdr.guid_store;
              });
              return a;
            })
          )
      ),
      // to get the company code
      exhaustMap((b) =>
        this.compService
          .getByGuid(b.bl_fi_generic_doc_hdr.guid_comp.toString(), this.apiVisa)
          .pipe(
            map((c_inner) => {
              // assign the code_company
              b.bl_fi_generic_doc_hdr.code_company =
                c_inner.data.bl_fi_mst_comp.code;
              return b;
            })
          )
      ),

      // to get the location code
      exhaustMap((c) =>
        this.locService
          .getByGuid(
            c.bl_fi_generic_doc_hdr.guid_store.toString(),
            this.apiVisa
          )
          .pipe(
            map((d_inner) => {
              // assign the code_location
              c.bl_fi_generic_doc_hdr.code_location =
                d_inner.data.bl_inv_mst_location.code;
              return c;
            })
          )
      ),
      exhaustMap((d) =>
        this.isdnService.put(d, this.apiVisa).pipe(
          map((a: any) => {
            this.updateDraft(a.data);
            return InternalSalesReturnActions.addContraInit();
          }),
          catchError((err) => {
            let errMsg = err.message;
            if (err.error.data.length) {
              if (
                err.error.data[0].errorCode ===
                "API_TNT_DM_ERP_GEN_DOC_LINE_DRAFT_LOCK_SERIAL_NUMBER_OBJECT_SN_ID_COMP_GUID_INV_ITEM_GUID_SERVER_DOC_TYPE_COMBINATION_ALREADY_EXISTS"
              ) {
                errMsg = "One of the serial numbers is already locked";
              }
            }
            this.toastr.error(errMsg, "Error", {
              tapToDismiss: true,
              progressBar: true,
              timeOut: 2000,
            });
            return of(
              InternalSalesReturnActions.editInternalSalesReturnFailed({
                error: err.message,
              })
            );
          })
        )
      )
    )
  );

  printEInvoiceJasperPdf$ = createEffect(() =>
  this.actions$.pipe(
    ofType(InternalSalesReturnActions.printEInvoiceJasperPdfInit),
    exhaustMap(action =>
      this.myEInvoiceToIRBHdrLinesService.getByGuid(action.hdr, this.apiVisa).pipe(
        switchMap(hdr =>
          this.myEInvoiceToIRBHdrLinesService.printJasperPdf(
            hdr.data.bl_fi_my_einvoice_to_irb_hdr.guid.toString(),
            this.apiVisa
          ).pipe(
            map(a => {
              const irb = hdr.data.bl_fi_my_einvoice_to_irb_hdr;
              const downloadURL = window.URL.createObjectURL(a);
              const link = document.createElement("a");
              const formattedDate = moment(irb.einvoice_datetime).format('YYYY-MM-DD');
              link.href = downloadURL;
              // E-invoice-<company-code>-<doc-type>-<YYYY-MM-DD>-<doc-running-no>.pdf
              link.download = `E-invoice-${irb.code_company}-${irb.generic_doc_hdr_server_doc_type}-${formattedDate}-${irb.generic_doc_hdr_server_doc_1}.pdf`;
              link.click();
              link.remove();
              this.viewColFacade.showSuccessToast(
                "E-Invoice Exported Successfully"
              );
              return InternalSalesReturnActions.printEInvoiceJasperPdfSuccess();
            }),
            catchError(err => {
              this.viewColFacade.showFailedToast(err);
              return of(InternalSalesReturnActions.printEInvoiceJasperPdfFailed());
            })
          )
        )
      )
    )
  )
);

  addContraAfterSavingSRRV$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InternalSalesReturnActions.addContraInit),
      withLatestFrom(
        this.store.select(HDRSelectors.selectHdr),
        this.isSalesReturnStore.select(
          InternalSalesReturnSelectors.selectContraDoc
        ),
        this.isSalesReturnStore.select(
          InternalSalesReturnSelectors.selectAddedContraDoc
        )
      ),
      map(([action, hdr, contraDoc, addedContraDoc]) => {
        addedContraDoc.bl_fi_generic_doc_arap_contra = {
          ...addedContraDoc.bl_fi_generic_doc_arap_contra,
          guid_doc_1_hdr: hdr.guid.toString(),
          guid_doc_2_hdr: contraDoc.bl_fi_generic_doc_hdr.guid.toString(),
          server_doc_type_doc_1: hdr.server_doc_type.toString(),
          server_doc_type_doc_2:
            contraDoc.bl_fi_generic_doc_hdr.server_doc_type.toString(),
          date_doc_1: new Date(hdr.date_txn)?.toISOString(),
          date_doc_2: contraDoc.bl_fi_generic_doc_hdr.date_txn.toString(),
        };
        return addedContraDoc;
      }),
      exhaustMap((a) =>
        this.arapService.post(a, this.apiVisa).pipe(
          map((a_a) => {
            this.viewColFacade.showSuccessToast(
              ToastConstants.addContraSuccess
            );
            this.onReturn();
            return InternalSalesReturnActions.addContraSuccess();
          }),
          catchError((err) => {
            this.viewColFacade.showFailedToast(err);
            return of(
              InternalSalesReturnActions.addContraFailed({
                error: err.message,
              })
            );
          })
        )
      )
    )
  );

  editInternalSalesReturnFinal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InternalSalesReturnActions.editSalesReturnFinalInit),
      withLatestFrom(
        this.isSalesReturnStore.select(
          InternalSalesReturnSelectors.selectSalesReturn
        ),
        this.store.select(HDRSelectors.selectHdr),
        this.store.select(PNSSelectors.selectAll),
        this.store.select(SettlementSelectors.selectAll)
      ),
      map(([action, genDoc, hdr, pns, stl]) => {
        genDoc.bl_fi_generic_doc_hdr = hdr;
        stl.forEach((l) => {
          // hacky condition to check if payment exist before
          if (l.guid.toString().length !== 36) l.guid = null;
        });
        genDoc.bl_fi_generic_doc_line = [...pns, ...stl];
        genDoc.bl_fi_generic_doc_link = null;

        pns.forEach((item: any) => {
          if (
            item.item_sub_type === "SERIAL_NUMBER" &&
            item.serial_no &&
            Array.isArray(item.serial_no)
          ) {
            const serialArr = item.serial_no.map((sn) => sn["sn_id"]);
            item.serial_no = {
              serialNumbers: serialArr,
            };
          }
          // If condition doesn't matter
          if (
            item.line_property_json &&
            (<any>item.line_property_json).delivery_instructions
          ) {
            const extIndex = genDoc.bl_fi_generic_doc_ext.findIndex(
              (x) =>
                x.param_code === "REQUESTED_DELIVERY_DATE" &&
                x.guid_doc_line === item.guid
            );
            if (extIndex >= 0) {
              genDoc.bl_fi_generic_doc_ext[extIndex].value_datetime = (<any>(
                item.line_property_json
              )).delivery_instructions.deliveryDate;
              genDoc.bl_fi_generic_doc_ext[extIndex].value_json = (<any>(
                item.line_property_json
              )).delivery_instructions;
              genDoc.bl_fi_generic_doc_ext[extIndex].status = item.status;
            } else {
              const ext = new bl_fi_generic_doc_ext_RowClass();
              ext.guid_doc_hdr = hdr.guid.toString();
              ext.guid_doc_line = item.guid;
              ext.param_code = "REQUESTED_DELIVERY_DATE";
              ext.param_name = "REQUESTED_DELIVERY_DATE";
              ext.param_type = "DATE";
              ext.value_datetime = (<any>(
                item.line_property_json
              )).delivery_instructions.deliveryDate;
              ext.value_json = (<any>(
                item.line_property_json
              )).delivery_instructions;
              genDoc.bl_fi_generic_doc_ext.push(ext);
            }
          }
        });

        console.log("Update model", genDoc);
        return genDoc;
      }),
      exhaustMap((a) =>
        this.isdnService
          .getByGuid(a.bl_fi_generic_doc_hdr.guid.toString(), this.apiVisa)
          .pipe(
            map((b_inner) => {
              a.bl_fi_generic_doc_hdr.server_doc_1 =
                b_inner.data.bl_fi_generic_doc_hdr.server_doc_1;
              a.bl_fi_generic_doc_hdr.server_doc_2 =
                b_inner.data.bl_fi_generic_doc_hdr.server_doc_2;
              a.bl_fi_generic_doc_hdr.server_doc_3 =
                b_inner.data.bl_fi_generic_doc_hdr.server_doc_3;
              a.bl_fi_generic_doc_hdr.server_doc_4 =
                b_inner.data.bl_fi_generic_doc_hdr.server_doc_4;
              a.bl_fi_generic_doc_hdr.server_doc_5 =
                b_inner.data.bl_fi_generic_doc_hdr.server_doc_5;

              a.bl_fi_generic_doc_hdr.client_doc_1 =
                b_inner.data.bl_fi_generic_doc_hdr.client_doc_1;
              a.bl_fi_generic_doc_hdr.client_doc_2 =
                b_inner.data.bl_fi_generic_doc_hdr.client_doc_2;
              a.bl_fi_generic_doc_hdr.client_doc_3 =
                b_inner.data.bl_fi_generic_doc_hdr.client_doc_3;
              a.bl_fi_generic_doc_hdr.client_doc_4 =
                b_inner.data.bl_fi_generic_doc_hdr.client_doc_4;
              a.bl_fi_generic_doc_hdr.client_doc_5 =
                b_inner.data.bl_fi_generic_doc_hdr.client_doc_5;
              return a;
            })
          )
      ),
      exhaustMap((a) =>
        this.branchService
          .getByGuid(
            a.bl_fi_generic_doc_hdr.guid_branch.toString(),
            this.apiVisa
          )
          .pipe(
            map((b_inner) => {
              a.bl_fi_generic_doc_hdr.guid_comp =
                b_inner.data.bl_fi_mst_branch.comp_guid;
              //  assign code_branch
              a.bl_fi_generic_doc_hdr.code_branch =
                b_inner.data.bl_fi_mst_branch.code;
              a.bl_fi_generic_doc_line.forEach((lineItem) => {
                lineItem.guid_comp = a.bl_fi_generic_doc_hdr.guid_comp;
                lineItem.guid_branch = a.bl_fi_generic_doc_hdr.guid_branch;
                lineItem.guid_store = a.bl_fi_generic_doc_hdr.guid_store;
                if (a.bl_fi_generic_doc_hdr.delivery_location_guid) {
                  lineItem.delivery_location_guid = a.bl_fi_generic_doc_hdr.delivery_location_guid;
                }
              });
              return a;
            })
          )
      ),
      // to get the company code
      exhaustMap((b) =>
        this.compService
          .getByGuid(b.bl_fi_generic_doc_hdr.guid_comp.toString(), this.apiVisa)
          .pipe(
            map((c_inner) => {
              // assign the code_company
              b.bl_fi_generic_doc_hdr.code_company =
                c_inner.data.bl_fi_mst_comp.code;
              return b;
            })
          )
      ),

      // to get the location code
      exhaustMap((c) =>
        this.locService
          .getByGuid(
            c.bl_fi_generic_doc_hdr.guid_store.toString(),
            this.apiVisa
          )
          .pipe(
            map((d_inner) => {
              // assign the code_location
              c.bl_fi_generic_doc_hdr.code_location =
                d_inner.data.bl_inv_mst_location.code;
              return c;
            })
          )
      ),
      exhaustMap((d) =>
        this.isdnService.put(d, this.apiVisa).pipe(
          map((a: any) => {
            this.viewColFacade.updateInstance(0, {
              deactivateAdd: false,
              deactivateList: false,
            });
            this.viewColFacade.resetIndex(0);
            return InternalSalesReturnActions.editSalesReturnFinalSuccess({
              status: { posting_status: "FINAL" },
              doc: a.data,
              hdrGuid: a.data.bl_fi_generic_doc_hdr.guid,
            });
          }),
          catchError((err) => {
            let errMsg = err.message;
            if (err.error.data.length) {
              if (
                err.error.data[0].errorCode ===
                "API_TNT_DM_ERP_GEN_DOC_LINE_DRAFT_LOCK_SERIAL_NUMBER_OBJECT_SN_ID_COMP_GUID_INV_ITEM_GUID_SERVER_DOC_TYPE_COMBINATION_ALREADY_EXISTS"
              ) {
                errMsg = "One of the serial numbers is already locked";
              }
            }
            this.toastr.error(errMsg, "Error", {
              tapToDismiss: true,
              progressBar: true,
              timeOut: 2000,
            });
            return of(
              InternalSalesReturnActions.editInternalSalesReturnFailed({
                error: err.message,
              })
            );
          })
        )
      )
    )
  );

  // printMultipleJasperPdf$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(InternalSalesReturnActions.printMultipleJasperPdfInit),
  //     exhaustMap((action) => {
  //       const printBlobArray$ = action.guids.map((guid) =>
  //         this.isdnService.printJasperPdf(
  //           guid.toString(),
  //           "CP_COMMERCE_INTERNAL_SALES_ORDERS_JASPER_PRINT_SERVICE",
  //           action.printable,
  //           AppConfig.apiVisa
  //         )
  //       );
  //             return forkJoin(printBlobArray$).pipe(
  //               exhaustMap(async (blobs) => {
  //                 const mergedPdf = await PDFDocument.create();
  //                 for (const blob of blobs) {
  //                   const arrayBuffer = await blob.arrayBuffer();
  //                   const pdf = await PDFDocument.load(arrayBuffer);
  //                   const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
  //                   copiedPages.forEach((page) => mergedPdf.addPage(page));
  //                 }
  //                 const mergedPdfBlob = new Blob([await mergedPdf.save()], { type: 'application/pdf' });
  //                 const downloadURL = window.URL.createObjectURL(mergedPdfBlob);

  //                 let fileName = 'INTERNAL_SALES_RETURN_REQUEST';
  //                 if (action.docNumbers.length === 1) {
  //                   fileName += `-${action.docNumbers[0]}`;
  //                 } else {
  //                   fileName += '-SLSRTN';
  //                 }
  //                 if (action.preview) {

  //                   const previewWindow = window.open('', '_blank');
  //                   const blobURL = window.URL.createObjectURL(mergedPdfBlob);
  //                   previewWindow.document.write(`
  //                     <html>
  //                       <head>
  //                         <title>${fileName}</title>
  //                         <style>
  //                           body {
  //                             font-family: Arial, sans-serif;
  //                             margin: 0;
  //                             padding: 0;
  //                             background-color: #f4f4f4;
  //                             text-align: center;
  //                           }
  //                           iframe {
  //                             width: 100%;
  //                             height: 90vh;
  //                             border: none;
  //                           }
  //                           .download-container {
  //                             display: flex;
  //                             justify-content: center;
  //                             align-items: center;
  //                             height: 10vh;
  //                           }
  //                           #downloadBtn {
  //                             color: #007bff;
  //                             border: 2px solid #007bff;
  //                             padding: 10px 20px;
  //                             font-size: 16px;
  //                             border-radius: 5px;
  //                             cursor: pointer;
  //                             background: none;
  //                             font-weight: bold;
  //                             transition: color 0.3s ease, border-color 0.3s ease;
  //                           }
  //                           #downloadBtn:hover {
  //                             color: #0056b3;
  //                             border-color: #0056b3;
  //                           }
  //                           #downloadBtn:active {
  //                             color: #004085;
  //                             border-color: #004085;
  //                           }
  //                         </style>
  //                       </head>
  //                       <body>
  //                         <iframe src="${blobURL}"></iframe>
  //                         <div class="download-container">
  //                           <button id="downloadBtn" aria-label="Download PDF">Download PDF</button>
  //                         </div>
  //                         <script>
  //                           document.getElementById('downloadBtn').addEventListener('click', function() {
  //                             const a = document.createElement('a');
  //                             a.href = '${blobURL}';
  //                             a.download = '${fileName}.pdf'; // Set file name for download
  //                             a.click();
  //                           });
  //                         </script>
  //                       </body>
  //                     </html>
  //                   `);
  //                 } else {

  //                   const downloadButton = document.createElement('a');
  //                   downloadButton.href = downloadURL;
  //                   downloadButton.download = `${fileName}.pdf`;
  //                   downloadButton.style.display = 'none';
  //                   document.body.appendChild(downloadButton);
  //                   downloadButton.click();
  //                   document.body.removeChild(downloadButton);
  //                 }
  //                 return InternalSalesReturnActions.printJasperPdfSuccess();
  //               }),
  //               catchError((err) => {
  //                 this.viewColFacade.showFailedToast(err);
  //                 return of(InternalSalesReturnActions.printJasperPdfFailed());
  //               })
  //             );
  //           })
  //         )
  // );

  selectSettingItemFilter$ = createEffect(() => this.actions$.pipe(
    ofType(InternalSalesReturnActions.selectSettingItemFilter),
    mergeMap((action) => {
      const paging = new Pagination();
      paging.conditionalCriteria.push({ columnName: 'applet_guid', operator: '=', value: sessionStorage.getItem('appletGuid') });
      paging.conditionalCriteria.push({ columnName: 'guid_branch', operator: '=', value: action.branch });
      return this.itemFilterSettingService.getByCriteria(paging, this.apiVisa).pipe(
        map(res => {
          return InternalSalesReturnActions.selectSettingItemFilterSuccess({ setting: res.data });
        }),
        catchError(err => {
          return of(InternalSalesReturnActions.selectSettingItemFilterFailed({ error: err.message }));
        })
      )
    })
  ));

  createPostToProcessInit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        InternalSalesReturnActions.einvoiceNtfQueueProcessInit
      ),
      mergeMap((action) =>
        this.einvoiceNotificationQueueService
          .postMultipleToProcess(action.dto, this.apiVisa)
          .pipe(
            map((stockReplenishmentRun: any) => {
              this.toastr.success(
                "Email Sent",
                "Success",
                {
                  tapToDismiss: true,
                  progressBar: true,
                  timeOut: 1300,
                }
              );
              this.viewColFacade.resetIndex(0);
              return InternalSalesReturnActions.einvoiceNtfQueueProcessSuccess();
            }),
            catchError((err) => {
              this.toastr.error(err.message, "Error", {
                tapToDismiss: true,
                progressBar: true,
                timeOut: 1300,
              });
              this.viewColFacade.resetIndex(0);
              return of(
                InternalSalesReturnActions.einvoiceNtfQueueProcessFailed(
                  {
                    error: err.messsage,
                  }
                )
              );
            })
          )
      )
    )
  );

  saveSettingItemFilter$ = createEffect(() =>
  this.actions$.pipe(
    ofType(InternalSalesReturnActions.saveSettingItemFilter),
    withLatestFrom(this.isSalesReturnStore.select(InternalSalesReturnSelectors.selectItemCategoryFilter)),
    mergeMap(([action, settingItem]) => {
      const apiCalls = [];
      const processItemCategory = (lineTable, guids) => {
        const matchingSetting = settingItem.find(s => {
          const settingLevelValue = (s.bl_applet_setting_filter_fi_item_category_link as any)?.level_value;
          const settingGuidBranch = (s.bl_applet_setting_filter_fi_item_category_link as any)?.guid_branch;
          return settingLevelValue == lineTable && settingGuidBranch == action.branch;
        });
        //console.log('matchingSetting:', matchingSetting);
        let itemFilter = new AppletSettingFilterItemCategoryLinkContainerModel();
        (itemFilter as any).bl_applet_setting_filter_fi_item_category_link.category_json = <any>{ guids };
        itemFilter.bl_applet_setting_filter_fi_item_category_link.applet_guid = <any>sessionStorage.getItem('appletGuid');
        (itemFilter as any).bl_applet_setting_filter_fi_item_category_link.level_value = lineTable;
        (itemFilter as any).bl_applet_setting_filter_fi_item_category_link.guid_branch = action.branch;
        itemFilter.bl_applet_setting_filter_fi_item_category_link.line_table = lineTable;
        if (matchingSetting) {
          itemFilter = matchingSetting;
          (itemFilter as any).bl_applet_setting_filter_fi_item_category_link.category_json = <any>{ guids };
          itemFilter.bl_applet_setting_filter_fi_item_category_link.guid = matchingSetting.bl_applet_setting_filter_fi_item_category_link.guid;
          apiCalls.push(this.itemFilterSettingService.put(itemFilter, this.apiVisa));
        } else {
          if (guids) {
            apiCalls.push(this.itemFilterSettingService.postOne(itemFilter, this.apiVisa));
          }
        }
      };
      for (let i = 0; i <= 10; i++) {
        const categoryValue = action.form.value[`ITEM_CATEGORY_${i}`];
        processItemCategory(i.toString(), categoryValue);
      }
      return forkJoin(apiCalls).pipe(
        tap(() => {
          this.toastr.success(
            'Item Category filters has been updated successfully',
            'Success',
            {
              tapToDismiss: true,
              progressBar: true,
              timeOut: 3000
            }
          );
          this.viewColFacade.resetIndex(0);
          this.store.dispatch(InternalSalesReturnActions.loadSettingItemFilter());
        }),
        map(() => InternalSalesReturnActions.saveSettingItemFilterSuccess()),
        catchError(err => of(InternalSalesReturnActions.saveSettingItemFilterFailed({ error: err.message })))
      );
    })
  )
  );

  addGroupDiscount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InternalSalesReturnActions.addGroupDiscount),
      withLatestFrom(
        this.isSalesReturnStore.select(InternalSalesReturnSelectors.selectGroupDiscountItem),
        this.store.select(PNSSelectors.selectAll),
        this.isSalesReturnStore.select(InternalSalesReturnSelectors.selectSalesReturn)
      ),
      map(([action, groupDiscountItem, pns, selectedSalesReturn]) => {
        if (groupDiscountItem) {
          console.log('abd check pns', pns.length);
          const total = pns.length
          ? pns
              .filter(
                (r) =>
                  r.item_txn_type !== "DOC_HEADER_ADJUSTMENT" &&
                  r.item_txn_type !== "GROUP_DISCOUNT" &&
                  r.status === "ACTIVE"
              )
              .map((r) => parseFloat(r.amount_txn?.toString()))
              .reduce((acc, c) => acc + c)
          : 0;
          const lineItem = pns.find(
            (p) =>
              p.item_txn_type === "GROUP_DISCOUNT"
          );
          let discountAmt = 0;
          if(action.discPercentage){
            discountAmt = Number(((action.discPercentage/100) * Number(total)).toFixed(2));
          }else if(action.discAmount){
            discountAmt = action.discAmount;
          }
          console.log('discountAmt', discountAmt);
          if (total > 0 && discountAmt > 0) {
            if (!lineItem) {
              const discLine = new bl_fi_generic_doc_line_RowClass();
              discLine.guid = UUID.UUID().toLowerCase();
              discLine.item_guid = groupDiscountItem.bl_fi_mst_item_hdr.guid;
              discLine.item_code = groupDiscountItem.bl_fi_mst_item_hdr.code;
              discLine.item_name = groupDiscountItem.bl_fi_mst_item_hdr.name;
              discLine.amount_discount = <any> discountAmt;
              discLine.amount_txn = <any> (discountAmt*(-1));
              discLine.amount_std = <any> 0;
              discLine.amount_net = discLine.amount_txn;
              discLine.unit_discount = <any> discLine.amount_discount;
              discLine.unit_price_txn = <any>discLine.amount_txn;
              discLine.unit_price_std = <any>discLine.amount_std;
              discLine.unit_price_net = <any>discLine.amount_txn;
              discLine.amount_signum = 0;
              discLine.quantity_base = 1;
              discLine.quantity_signum = 0;
              discLine.txn_type = "PNS";
              discLine.server_doc_type = "INTERNAL_PURCHASE_GRN";
              discLine.date_txn = new Date();
              discLine.item_txn_type = groupDiscountItem.bl_fi_mst_item_hdr.txn_type;
              discLine.item_sub_type = groupDiscountItem.bl_fi_mst_item_hdr.sub_item_type;
              discLine.status = "ACTIVE";
              discLine.position_id = "1001";
              this.store.dispatch(PNSActions.addPNS({ pns: discLine }));
            }
            else {
              console.log('lineItem', lineItem.amount_txn);
              console.log('discountAmt', discountAmt);
              if (lineItem.amount_txn !== discountAmt) {
                const line = { ...lineItem };
                line.amount_txn =  <any> (discountAmt*(-1));
                line.amount_net = line.amount_txn;
                line.amount_discount = <any> discountAmt;
                line.unit_price_txn = <any>line.amount_txn;
                line.unit_price_net = <any>line.amount_txn;
                line.status  = 'ACTIVE';
                const diffLine = this.calculateDiffLine(line, lineItem);
                this.store.dispatch(PNSActions.editPNS({ pns: line }));
                this.store.dispatch(
                  HDRActions.updateBalance({ pns: diffLine })
                );
              }
            }
          } else if (total > 0 && discountAmt === 0) {
            if(lineItem){
              let index;
              if (selectedSalesReturn) {
                index = selectedSalesReturn.bl_fi_generic_doc_line.findIndex(
                  (x) => x.guid === lineItem.guid
                );
              }
              if (index >= 0) {
                const line = { ...lineItem, status: "DELETED" };
                const diffLine = this.calculateDiffLine(null, line);
                this.store.dispatch(PNSActions.editPNS({ pns: line }));
                this.store.dispatch(HDRActions.updateBalance({ pns: diffLine }));
              } else {
                const diffLine = this.calculateDiffLine(null, lineItem);
                this.store.dispatch(
                  PNSActions.deletePNS({ guid: lineItem.guid.toString() })
                );
                this.store.dispatch(HDRActions.updateBalance({ pns: diffLine }));
              }
            }
          }

          return InternalSalesReturnActions.addGroupDiscountSuccess({discPercentage:action.discPercentage});
        } else {
          this.toastr.error("Please configure the default group discount item code", "Error", {
            tapToDismiss: true,
            progressBar: true,
            timeOut: 2000,
          });
          return InternalSalesReturnActions.addGroupDiscountFailed();
        }
      })
    )
  );

  recalculateGroupDiscount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InternalSalesReturnActions.recalculateGroupDiscount),
      withLatestFrom(
        this.isSalesReturnStore.select(InternalSalesReturnSelectors.selectGroupDiscountItem),
        this.store.select(PNSSelectors.selectAll),
        this.isSalesReturnStore.select(InternalSalesReturnSelectors.selectGroupDiscountPercentage),
      ),
      map(([action, groupDiscountItem,  pns, groupDiscountPercentage]) => {
        if (groupDiscountItem) {
          const total = pns.length
          ? pns
              .filter(
                (r) =>
                  r.item_txn_type !== "GROUP_DISCOUNT" &&
                  r.status === "ACTIVE"
              )
              .map((r) => parseFloat(r.amount_txn?.toString()))
              .reduce((acc, c) => acc + c)
          : 0;
          const lineItem = pns.find(
            (p) =>
              p.item_txn_type === "GROUP_DISCOUNT" &&
              p.status === "ACTIVE"
          );
          let discountAmt = 0;
          if(groupDiscountPercentage){
            discountAmt = Number(((groupDiscountPercentage/100) * Number(total)).toFixed(2));
          }

          if (total > 0 && discountAmt > 0) {
            if (lineItem && (lineItem.amount_txn !== discountAmt)) {
                const line = { ...lineItem };
                line.amount_txn =  <any> (discountAmt*(-1));
                line.amount_std = <any> 0;
                line.amount_net = line.amount_txn;
                line.amount_discount = <any> discountAmt;
                line.unit_price_std = <any>line.amount_std;
                line.unit_price_txn = <any>line.amount_txn;
                line.unit_price_net = <any>line.amount_txn;
                const diffLine = this.calculateDiffLine(line, lineItem);
                this.store.dispatch(PNSActions.editPNS({ pns: line }));
                this.store.dispatch(
                  HDRActions.updateBalance({ pns: diffLine })
                );
            }
          }
          return InternalSalesReturnActions.recalculateGroupDiscountSuccess();
        } else {

          return InternalSalesReturnActions.recalculateGroupDiscountFailed();
        }
      })
    )
  );

  calculateDiffLine(
    line: bl_fi_generic_doc_line_RowClass,
    lineItem: bl_fi_generic_doc_line_RowClass
  ) {
    const amount_discount = line ? line.amount_discount : 0;
    const amount_net = line ? line.amount_net : 0;
    const amount_std = line ? line.amount_std : 0;
    const amount_tax_gst = line ? line.amount_tax_gst : 0;
    const amount_tax_wht = line ? line.amount_tax_wht : 0;
    const amount_txn = line ? line.amount_txn : 0;
    const diffLine = new bl_fi_generic_doc_line_RowClass();
    diffLine.amount_discount = <any>(
      (parseFloat(<any>amount_discount) -
        parseFloat(<any>lineItem.amount_discount))
    );
    diffLine.amount_net = <any>(
      (parseFloat(<any>amount_net) - parseFloat(<any>lineItem.amount_net))
    );
    diffLine.amount_std = <any>(
      (parseFloat(<any>amount_std) - parseFloat(<any>lineItem.amount_std))
    );
    diffLine.amount_tax_gst = <any>(
      (parseFloat(<any>amount_tax_gst) -
        parseFloat(<any>lineItem.amount_tax_gst))
    );
    diffLine.amount_tax_wht = <any>(
      (parseFloat(<any>amount_tax_wht) -
        parseFloat(<any>lineItem.amount_tax_wht))
    );
    diffLine.amount_txn = <any>(
      (parseFloat(<any>amount_txn) - parseFloat(<any>lineItem.amount_txn))
    );
    return diffLine;
  }

  selectChildItemPricingLink$ = createEffect(() => this.actions$.pipe(
    ofType(InternalSalesReturnActions.selectChildItemPricingLink),
    withLatestFrom(
      this.isSalesReturnStore.select(InternalSalesReturnSelectors.selectChildItems),
      this.isSalesReturnStore.select(InternalSalesReturnSelectors.selectPricingSchemeHdr)
    ),
    mergeMap(([a, childItem, pricingSchemeHdr]) => {
      const guids: any[] = a.child.map(item => item.item_hdr_guid);
      const inputModel = {} as ListingInputModel;
      inputModel.searchColumns = [];
      inputModel.status = ['ACTIVE'];
      inputModel.orderBy = 'date_updated';
      inputModel.order = 'desc';
      inputModel.limit = 100;
      inputModel.offset = 0;
      inputModel.calcTotalRecords = true;
      inputModel.showCreatedBy = false;
      inputModel.showUpdatedBy = true;
      inputModel.filterLogical = 'AND';
      inputModel.filterConditions = [];
      inputModel.filters = {
        "txn_class": "PNS"
      }
      inputModel.filterConditions.push({
        "filterColumn": "hdr.guid",
        "filterValues": guids,
        "filterOperator": "IN"
      });
      inputModel.filterConditions.push({
        "filterColumn": "bl_fi_mst_pricing_scheme_link.guid_pricing_scheme_hdr",
        "filterValues": [pricingSchemeHdr],
        "filterOperator": "="
      });

      inputModel.joins = [
        {
          'tableName': 'bl_fi_mst_pricing_scheme_link',
          'joinColumn': 'hdr.guid=bl_fi_mst_pricing_scheme_link.item_hdr_guid',
          'columns': ["guid_pricing_scheme_hdr", "item_hdr_guid", "purchase_unit_price"],
          'joinType': 'inner join'
        }
      ];
      inputModel.childs = [];

      return this.listingService.get("fi-item", inputModel, this.apiVisa)
        .pipe(
          map(b => {
            b.data.forEach(data => {
              const selectedChild = childItem.find(i => i.item_hdr_guid === data.guid);
              if (selectedChild) {
                const updatedResult = { ...selectedChild, unitPrice: data.bl_fi_mst_pricing_scheme_link_purchase_unit_price };
                this.isSalesReturnStore.dispatch(InternalSalesReturnActions.updateChildItem({ child: updatedResult }));
              }
            });

            return InternalSalesReturnActions.selectChildItemPricingLinkSuccess({ price: [] });
          }),
          catchError(error => {
            this.viewColFacade.showFailedToast(error);
            return of(InternalSalesReturnActions.selectChildItemPricingLinkFailed({ error }));
          })
        );
    })
  ));

  constructor(
    private actions$: Actions,
    private genDocLinkService: GenericDocLinkBackofficeEPService,
    private isdnService: InternalSalesReturnRequestService,
    private arapService: ARAPService,
    private toastr: ToastrService,
    private store: Store<DraftStates>,
    private isSalesReturnStore: Store<InternalSalesReturnStates>,
    private branchService: BranchService,
    private readonly branchSettingStore: Store<BranchSettingsStates>,
    private pricingService: PricingSchemeService,
    private pslService: PricingSchemeLinkService,
    private entityService: EntityService,
    private viewColFacade: ViewColumnFacade,
    private locService: LocationService,
    private compService: CompanyService,
    private brnchService: BranchService,
    private customerService: CustomerService,
    private empService: EmployeeService,
    private profileService: TenantUserProfileService,
    private companyService: CompanyService,
    private readonly sessionStore: Store<SessionStates>,
    private fiService: FinancialItemService,
    private itemFilterSettingService: AppletSettingFilterItemCategoryLinkService,
    private myEInvoiceToIRBHdrLinesService: MyEInvoiceToIRBHdrLinesService,
    private genericDocLockService: GenericDocLockService,
    private einvoiceNotificationQueueService: EinvoiceNotificationQueueService,
    private apiService: ApiService,
    protected listingService: ListingService,
  ) {
    this.viewColFacade.prevIndex$.subscribe(
      (resolve) => (this.prevIndex = resolve)
    );
    this.viewColFacade
      .prevLocalState$()
      .subscribe((resolve) => (this.prevLocalState = resolve));
  }

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false,
      deactivateReturn: false,
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }
}
