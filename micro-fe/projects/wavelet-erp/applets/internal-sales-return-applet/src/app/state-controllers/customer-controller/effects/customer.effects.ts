import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, mergeMap, catchError, switchMap, tap, exhaustMap } from 'rxjs/operators';
import {
  BranchService,
  LocationService,
  Pagination,
  CustomerService,
  EntityLoginSubjectLinkService,
  LabelService,
  CurrencyService,
  CompBranchLocationEntityLinkService,
  CompBranchLocationEntityLinkContainerModel,
  EntityPaymentMethodService,
  EntityContainerModel
} from 'blg-akaun-ts-lib';
import { CustomerActions } from '../actions';
import { ToastrService } from 'ngx-toastr';
import { state } from '@angular/animations';
import { AppConfig } from 'projects/shared-utilities/visa';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { appletServiceInfo } from '../../../../shared/applet-service-component';

@Injectable()
export class CustomerEffects {

  apiVisa = AppConfig.apiVisa;
  pagination = new Pagination();

  createCustomer$ = createEffect(() => this.actions$.pipe(
    ofType(CustomerActions.createCustomer),
    mergeMap(action => this.cstmrService.post(action.customerExt, this.apiVisa).pipe(
      map((a: any) => {
        this.toastr.success(
          'The Customer has been created',
          'Success',
          {
            tapToDismiss: true,
            progressBar: true,
            timeOut: 1300
          }
        );
        return CustomerActions.createCustomerSuccess({ customerExt: a.data });
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
        return of(CustomerActions.createCustomerFailed({ error: err.message }));
      })
    ))
  ));

  update$ = createEffect(() => this.actions$.pipe(
    ofType(CustomerActions.containerDraftUpdateInit),
    exhaustMap(action => this.cstmrService.getByGuid(action.entity.bl_fi_mst_entity_hdr.guid.toString(), this.apiVisa).pipe(
      map(a => {
        action.entity.bl_fi_mst_entity_hdr.revision = a.data.bl_fi_mst_entity_hdr.revision;
        action.entity.bl_fi_mst_entity_ext.forEach(aExt => {
          const ext = a.data.bl_fi_mst_entity_ext.find(dExt => dExt.guid === aExt.guid);
          aExt.revision = ext ? ext.revision : aExt.revision;
        })
        action.entity.bl_fi_mst_entity_line.forEach(aLine => {
          const line = a.data.bl_fi_mst_entity_line.find(dLine => dLine.guid === aLine.guid);
          aLine.revision = line ? line.revision : aLine.revision;
        })
        a.data = { ...action.entity };
        console.log(a.data)
        return a.data;
      }),
      exhaustMap(b => this.cstmrService.put(b, this.apiVisa).pipe(
        map((b_inner) => {
          b.bl_fi_mst_entity_line.forEach((res) => {
            if (res.txn_type === "BRANCH") {
              this.pagination.conditionalCriteria = [
                { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
                {
                  columnName: 'branch_guid', operator: '=',
                  value: res.ref_1.toString()
                },
                {
                  columnName: 'entity_hdr_guid', operator: '=',
                  value: res.entity_hdr_guid.toString()
                }
              ];
              this.compbranchlink.getByCriteria(this.pagination, this.apiVisa)
                .subscribe(resolved => {
                  if (resolved.totalRecords === 0) {
                    let compbranch = new CompBranchLocationEntityLinkContainerModel()
                    compbranch.bl_fi_mst_comp_branch_location_entity_link.entity_hdr_guid = res.entity_hdr_guid;
                    compbranch.bl_fi_mst_comp_branch_location_entity_link.branch_guid = res.ref_1;
                    compbranch.bl_fi_mst_comp_branch_location_entity_link.comp_guid = res.ref_2;
                    compbranch.bl_fi_mst_comp_branch_location_entity_link.location_guid = res.ref_3;
                    this.compbranchlink.post(compbranch, this.apiVisa)
                      .subscribe((resolved) => {
                        // this.snackBar.open(`${compbranch.bl_fi_mst_comp_branch_location_entity_link.branch_guid} Added`, 'Close');
                      })
                  }
                  else {
                    if (res.status === "DELETED") {
                      let compbranch = new CompBranchLocationEntityLinkContainerModel()
                      compbranch.bl_fi_mst_comp_branch_location_entity_link.guid = resolved.data[0].bl_fi_mst_comp_branch_location_entity_link.guid;
                      compbranch.bl_fi_mst_comp_branch_location_entity_link.entity_hdr_guid = res.entity_hdr_guid;
                      compbranch.bl_fi_mst_comp_branch_location_entity_link.branch_guid = res.ref_1;
                      compbranch.bl_fi_mst_comp_branch_location_entity_link.comp_guid = res.ref_2;
                      compbranch.bl_fi_mst_comp_branch_location_entity_link.location_guid = res.ref_3;
                      compbranch.bl_fi_mst_comp_branch_location_entity_link.status = res.status;
                      compbranch.bl_fi_mst_comp_branch_location_entity_link.revision = resolved.data[0].bl_fi_mst_comp_branch_location_entity_link.revision;
                      this.compbranchlink.put(compbranch, this.apiVisa)
                        .subscribe((resolved) => {
                          // this.snackBar.open(`${compbranch.bl_fi_mst_comp_branch_location_entity_link.branch_guid} Added`, 'Close');
                        })
                    }
                  }
                })
            }
          })
          this.toastr.success(
            'The Customer has been updated',
            'Success',
            {
              tapToDismiss: true,
              progressBar: true,
              timeOut: 1300
            }
          );
          return CustomerActions.containerDraftUpdateSuccess
            ({ entity: b_inner.data });
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
          return of(CustomerActions.containerDraftUpdateFailed({ status: true }));
        })
      ))
    ))
  ))

  // getPaymentConfig$ = createEffect(() => this.actions$.pipe(
  //   ofType(CustomerActions.updateNewPaymentConfig),
  //   exhaustMap(action => this.paymentConfigService.getByCriteria(action.pagination,this.apiVisa).pipe(
  //     map(response => {
  //       console.log("RESPONSE DATA",response.data)
  //       console.log("MODEL DATA",action.model)
  //       return CustomerActions.updateNewPaymentConfigSuccess({model:response.data})
  //     }),
  //     catchError(err => {
  //       this.toastr.error(
  //         err.message,
  //         'Error',
  //         {
  //           tapToDismiss: true,
  //           progressBar: true,
  //           timeOut: 1300
  //         });
  //       return of(CustomerActions.updateNewPaymentConfigFail({error:err.message}));
  //     })
  //   ))
  // ));

  createPaymentConfig$ = createEffect(() => this.actions$.pipe(
    ofType(CustomerActions.createNewPaymentConfig),
    exhaustMap(action => this.paymentConfigService.post(action.model, this.apiVisa).pipe(
      map(response => {
        console.log("RESPONSE DATA", response.data)
        this.toastr.success(
          'The Payment Config has been created',
          'Success',
          {
            tapToDismiss: true,
            progressBar: true,
            timeOut: 1300
          }
        );
        return CustomerActions.createNewPaymentConfigSuccess({ model: response.data })
      }),
      catchError(err => {
        this.toastr.error(
          err.message,
          'Error',
          {
            tapToDismiss: true,
            progressBar: true,
            timeOut: 1300
          });
        return of(CustomerActions.createNewPaymentConfigFail({ error: err.message }));
      })
    ))
  ));

  editPaymentConfig$ = createEffect(() => this.actions$.pipe(
    ofType(CustomerActions.editSelectedPaymentConfig),
    exhaustMap(action => this.paymentConfigService.put(action.paymentConfig, this.apiVisa).pipe(
      map(response => {
        console.log("RESPONSE DATA", response.data)
        if (response.data?.bl_fi_mst_entity_payment_method.status == "ACTIVE") {
          this.toastr.success(
            'The Payment Config has been updated',
            'Success',
            {
              tapToDismiss: true,
              progressBar: true,
              timeOut: 1300
            }
          );
        }
        else if (response.data?.bl_fi_mst_entity_payment_method.status == "DELETED") {
          this.toastr.success(
            'The Payment Config has been deleted',
            'Success',
            {
              tapToDismiss: true,
              progressBar: true,
              timeOut: 1300
            }
          );
        }
        return CustomerActions.editSelectedPaymentConfigSuccess({ paymentConfig: response.data })
      }),
      catchError(err => {
        this.toastr.error(
          err.message,
          'Error',
          {
            tapToDismiss: true,
            progressBar: true,
            timeOut: 1300
          });
        return of(CustomerActions.editSelectedPaymentConfigFail({ error: err.message }));
      })
    ))
  ));

  createCustomerLogin$ = createEffect(() => this.actions$.pipe(
    ofType(CustomerActions.createLogin),
    mergeMap(action => this._entityLoginSubjectLinkService.post(action.customerLogin, this.apiVisa).pipe(
      map((a: any) => {
        this.toastr.success(
          'The Customer Login has been created',
          'Success',
          {
            tapToDismiss: true,
            progressBar: true,
            timeOut: 1300
          }
        );
        return CustomerActions.createLoginSuccess({ customerLogin: a.data });
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
        return of(CustomerActions.createLoginFailed({ error: err.message }));
      })
    ))
  ));
  updateCustomerLogin$ = createEffect(() => this.actions$.pipe(
    ofType(CustomerActions.createContainerDraftLoginInit),
    mergeMap(action => this._entityLoginSubjectLinkService.put(action.customerLogin, this.apiVisa).pipe(
      map((a: any) => {
        this.toastr.success(
          'The Customer Login has been updated',
          'Success',
          {
            tapToDismiss: true,
            progressBar: true,
            timeOut: 1300
          }
        );
        return CustomerActions.createLoginSuccess({ customerLogin: a.data });
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
        return of(CustomerActions.createLoginFailed({ error: err.message }));
      })
    ))
  ));
  // updateCustomerLogin$ = createEffect(() => this.actions$.pipe(
  //   ofType(CustomerActions.createContainerDraftLoginInint),
  //   exhaustMap(action => this._entityLoginSubjectLinkService.getByGuid(action.customerLogin.bl_fi_mst_entity_login_subject_link.guid.toString(), this.apiVisa).pipe(
  //     map(a => {
  //       action.customerLogin.bl_fi_mst_entity_login_subject_link.revision = a.data.bl_fi_mst_entity_login_subject_link.revision;
  //       a.data = { ...action.customerLogin };
  //       return a.data;
  //     }),
  //     exhaustMap(b => this._entityLoginSubjectLinkService.put(b, this.apiVisa).pipe(
  //       map((b_inner) => {
  //         console.log(b_inner, 'b_inner');
  //         this.toastr.success(
  //           'The Customer Category has been updated',
  //           'Success',
  //           {
  //             tapToDismiss: true,
  //             progressBar: true,
  //             timeOut: 1300
  //           }
  //         );
  //         return CustomerActions.createLoginSuccess({ customerLogin: b_inner.data });
  //       }),
  //       catchError(err => {
  //         this.toastr.error(
  //           err.message,
  //           'Error',
  //           {
  //             tapToDismiss: true,
  //             progressBar: true,
  //             timeOut: 1300
  //           }
  //         );
  //         return of(CustomerActions.createLoginFailed({ error: err.message }));
  //       })
  //     ))
  //   ))
  // ))

  createCatCustomer$ = createEffect(() => this.actions$.pipe(
    ofType(CustomerActions.createCatCustomer),
    mergeMap(action => this.labelService.post(action.customerCat, this.apiVisa).pipe(
      map((a: any) => {
        this.toastr.success(
          'The Customer Category has been created',
          'Success',
          {
            tapToDismiss: true,
            progressBar: true,
            timeOut: 1300
          }
        );
        return CustomerActions.createCatCustomerSuccess({ customerCat: a.data });
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
        return of(CustomerActions.createCustomerFailed({ error: err.message }));
      })
    ))
  ));

  updateCustomerCat$ = createEffect(() => this.actions$.pipe(
    ofType(CustomerActions.containerCatDraftUpdateInit),
    exhaustMap(action => this.labelService.getByGuid(action.entityCat.bl_fi_mst_label_hdr.guid.toString(), this.apiVisa).pipe(
      map(a => {
        action.entityCat.bl_fi_mst_label_hdr.revision = a.data.bl_fi_mst_label_hdr.revision;
        a.data = { ...action.entityCat };
        return a.data;
      }),
      exhaustMap(b => this.labelService.put(b, this.apiVisa).pipe(
        map((b_inner) => {
          this.toastr.success(
            'The Customer Category has been updated',
            'Success',
            {
              tapToDismiss: true,
              progressBar: true,
              timeOut: 1300
            }
          );
          return CustomerActions.containerCatDraftUpdateSuccess({ entityCat: b_inner.data });
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
          return of(CustomerActions.containerCatDraftUpdateFailed({ status: true }));
        })
      ))
    ))
  ))

  getCurrency$ = createEffect(() => this.actions$.pipe(
    ofType(CustomerActions.getCurrency),
    mergeMap(action => this.currencyService.get(this.apiVisa).pipe(
      map((a: any) => {

        return CustomerActions.getCurrencySuccess({ currency: a });
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
        return of(CustomerActions.getCurrencyFailed({ error: err.message }));
      })
    ))
  ));
  constructor(
    private currencyService: CurrencyService,
    private labelService: LabelService,
    private _entityLoginSubjectLinkService: EntityLoginSubjectLinkService,
    private cstmrService: CustomerService,
    private actions$: Actions,
    private toastr: ToastrService,
    private compbranchlink: CompBranchLocationEntityLinkService,
    private snackBar: MatSnackBar,
    private paymentConfigService: EntityPaymentMethodService
  ) { }
}
