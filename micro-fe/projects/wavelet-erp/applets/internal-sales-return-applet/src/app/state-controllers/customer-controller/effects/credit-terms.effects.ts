import { Injectable } from '@angular/core';
import { ApiVisa, CreditTermContainerModel, CreditTermService, CustomerService} from 'blg-akaun-ts-lib';
// import { environment } from '../../../../../environments/environment';
import { CustomerActions } from '../actions';
import { ToastrService } from 'ngx-toastr';
import { map, mergeMap, catchError,concatMap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {of } from 'rxjs';
import { AppConfig } from 'projects/shared-utilities/visa';
@Injectable()
export class CreditTermEffect {
    //apiVisa = AppConfig.TonnCableApiVisa;
    private readonly apiVisa = AppConfig.apiVisa;
    // ApiVisa = {
    //     tenantCode: sessionStorage.getItem("tenantCode"),
    //     api_domain_url: environment.api_domain,
    //     jwt_secret: localStorage.getItem("authToken"),
    //   };

   
    //EFFECT FOR CUSTOMER MODULE
    createTerm$ = createEffect (()=>this.actions$.pipe(
        ofType(CustomerActions.addNewCreditTerm),
        mergeMap(action => this.termservice.post(action.addNewCreditTerm,this.apiVisa).pipe(
            map((a:any) => {
                this.toastr.success (
                    'Term has been created',
                    'Success',
                    {
                        tapToDismiss: true,
                        progressBar: true,
                        timeOut: 1300
                    }
                );
                //return CustomerActions.addNewCreditTerm({addNewCreditTerm:a.data});
                return CustomerActions.addNewCreditTermSuccess({entity:a.data});
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
                return of(CustomerActions.addNewCreditTermFailed({error:err.message}));
                
            })
        ))
    ));

     //EFFECT FOR CREDIT TERM MODULE
     createCustomerTerm$= createEffect (()=>this.actions$.pipe(
        ofType(CustomerActions.createTermCustomer),
        mergeMap(action => this.termservice.post(action.customerTerm,this.apiVisa).pipe(
            map((a:any) => {
                this.toastr.success (
                    'Credit Term has been created',
                    'Success',
                    {
                        tapToDismiss: true,
                        progressBar: true,
                        timeOut: 1300
                    }
                );
                return CustomerActions.createTermCustomerSuccess({customerTerm:a.data});
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

    //EFFECT FOR CREDITTERM MODULE
    updateCustomerTerm$ = createEffect(() => this.actions$.pipe(
        ofType(CustomerActions.containerTermDraftUpdateInit),
        concatMap(action => this.termservice.getByGuid(action.entityTerm.bl_fi_entity_credit_term_hdr.guid.toString(),this.apiVisa).pipe(
            map(b => {
                action.entityTerm.bl_fi_entity_credit_term_hdr.revision=b.data.bl_fi_entity_credit_term_hdr.revision;
                b.data={...action.entityTerm};
                return b.data;
            }),
            concatMap(c => this.termservice.put(c,this.apiVisa).pipe(
                map(c_inner => {
                    this.toastr.success(
                        'Term has been update',
                        'Success',
                        {
                            tapToDismiss: true,
                            progressBar: true,
                            timeOut: 1300
                        }
                    );
                    return CustomerActions.containerDraftTermUpdateSuccess({entityTerm:c_inner.data})
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
                    return of(CustomerActions.containerTermDraftUpdateFailed({status:err.message}))
                })
            ))
        ))
    ));

    constructor(
        private actions$: Actions,
        private toastr: ToastrService,
        private termservice:CreditTermService,        
      ) { } 

}