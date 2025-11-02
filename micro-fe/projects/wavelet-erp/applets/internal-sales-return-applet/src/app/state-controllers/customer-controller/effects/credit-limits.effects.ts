import { Injectable } from '@angular/core';
import { ApiVisa, CreditLimitService } from 'blg-akaun-ts-lib';
import { CustomerActions } from '../actions';
import { ToastrService } from 'ngx-toastr';
import { map, mergeMap, catchError,concatMap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {of } from 'rxjs';
import { AppConfig } from 'projects/shared-utilities/visa';

@Injectable()
export class CreditLimitEffect {

    private readonly apiVisa = AppConfig.apiVisa;
    // ApiVisa = {
    //     tenantCode: sessionStorage.getItem("tenantCode"),
    //     api_domain_url: environment.api_domain,
    //     jwt_secret: localStorage.getItem("authToken"),
    //   };

      //EFFECT FOR CUSTOMER MODULE//
      createLimit$ = createEffect (()=>this.actions$.pipe(
        ofType(CustomerActions.addNewCreditLimit),
        mergeMap(action => this.limitservice.post(action.addNewCreditLimit,this.apiVisa).pipe(
            map((a:any) => {
                this.toastr.success (
                    'Credit Limit has been created',
                    'Success',
                    {
                        tapToDismiss: true,
                        progressBar: true,
                        timeOut: 1300
                    }
                );
                return CustomerActions.addNewCreditLimitSuccess({entity:a.data});
            }),
            catchError (err => {
                this.toastr.error(
                    err.message,
                    'Error',
                    {
                        tapToDismiss: true,
                        progressBar: true,
                        timeOut: 1300
                    }
                );
                return of(CustomerActions.addNewCreditLimitFailed({error:err.message}));
            })
        ))
    ));

    //EFECT FOR CREDIT LIMIT MODULE//
    createCustomerLimit$ = createEffect (()=>this.actions$.pipe(
        ofType(CustomerActions.createLimitCustomer),
        mergeMap(action => this.limitservice.post(action.customerLimit,this.apiVisa).pipe(
            map((a:any) => {
                this.toastr.success (
                    'Credit Limit has been created',
                    'Success',
                    {
                        tapToDismiss: true,
                        progressBar: true,
                        timeOut: 1300
                    }
                );
                return CustomerActions.createLimitCustomerSuccess({customerLimit:a.data});
            }),
            catchError (err => {
                this.toastr.error(
                    err.message,
                    'Error',
                    {
                        tapToDismiss: true,
                        progressBar: true,
                        timeOut: 1300
                    }
                );
                return of(CustomerActions.createCustomerFailed({error:err.message}));
            })
        ))
    ));

    //EFECT FOR CREDIT LIMIT MODULE
    updateCustomerLimit$ = createEffect(() => this.actions$.pipe (
        ofType(CustomerActions.containerLimitDraftUpdateInit),
        concatMap(action => this.limitservice.getByGuid(action.entityLimit.bl_fi_entity_credit_limit_hdr.guid.toString(),this.apiVisa).pipe (
            //map (a => a.data),
            map(b => {
                //mapping value
                action.entityLimit.bl_fi_entity_credit_limit_hdr.revision=b.data.bl_fi_entity_credit_limit_hdr.revision;
                b.data={...action.entityLimit};
                return b.data;
            }),
            concatMap (c => this.limitservice.put(c,this.apiVisa).pipe (
                map (c_inner => {
                    this.toastr.success (
                        'Limit has been update',
                        'Success',
                        {
                            tapToDismiss: true,
                            progressBar: true,
                            timeOut: 1300
                        }
                    );
                    return CustomerActions.containerDraftLimitUpdateSuccess({entityLimit: c_inner.data})
                }),
                catchError (err => {
                    this.toastr.error (
                        err.message,
                        'Error',
                        {
                            tapToDismiss: true,
                            progressBar: true,
                            timeOut: 1300
                          }
                    );
                    return of (CustomerActions.containerLimitDraftUpdateFailed({status:err.message}))
                })
            ))
        ))
    ));

    
    constructor(
        private actions$: Actions,
        private toastr: ToastrService,
        private limitservice:CreditLimitService,
      ) { } 


}