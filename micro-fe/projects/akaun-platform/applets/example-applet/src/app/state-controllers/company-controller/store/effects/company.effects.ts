import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, concatMap } from 'rxjs/operators';
import { CompanyService } from 'blg-akaun-ts-lib';
import { CompanyActions } from '../actions';
import { ToastrService } from 'ngx-toastr';
import { OrganisationConstants } from '../../../../models/organisation-constants';
import { AppConfig } from 'projects/shared-utilities/visa';

@Injectable()
export class CompanyEffects {

  private readonly apiVisa = AppConfig.apiVisa;

  // loadCompanies$ = createEffect(() => this.actions$.pipe(
  //   ofType(CompanyActions.loadCompanyInit),
  //   mergeMap(action => this.compService.getByCriteria(new Pagination(action.offset, action.limit), this.apiVisa)
  //     .pipe(
  //       map(companies => CompanyActions.loadCompanySuccess({company: companies.data}),
  //       catchError(() => EMPTY)
  //     ))
  //   )
  // ));

  createCompany$ = createEffect(() => this.actions$.pipe(
    ofType(CompanyActions.createCompanyInit),
    mergeMap(action => this.compService.post(action.company, this.apiVisa)
      .pipe(
        map((company: any) => {
          this.toaster.success(
            'The company has been created',
            'Success',
            {
              tapToDismiss: true,
              progressBar: true,
              timeOut: 1300
            }
          );
          return CompanyActions.createCompanySuccess({company: company.data})
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
          return of(CompanyActions.createCompanyFailure({error: err.messsage}))
        })
      ))
  ));

  deleteCompany$ = createEffect(() => this.actions$.pipe(
    ofType(CompanyActions.deleteCompanyInit),
    mergeMap(action => this.compService.delete(action.guid, this.apiVisa)
      .pipe(
        map(() => {
          this.toaster.success(
            'The company has been deleted',
            'Success',
            {
              tapToDismiss: true,
              progressBar: true,
              timeOut: 1300
            }
          );
          return CompanyActions.deleteCompanySuccess({guid: action.guid})
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
          return of(CompanyActions.deleteCompanyFailure({error: err.messsage}))
        })
      ))
    )
  );
  updateCompany$ = createEffect(() => this.actions$.pipe(
    ofType(CompanyActions.updateCompanyInit),
    concatMap(action => this.compService.getByGuid(action.guid, this.apiVisa)
      .pipe(
        map(a => a.data), //optional
        map(b => {
          b.bl_fi_mst_comp.code = action.company.value.code;
          b.bl_fi_mst_comp.name = action.company.value.name;
          b.bl_fi_mst_comp.abbreviation = action.company.value.abbreviation;
          b.bl_fi_mst_comp.descr = action.company.value.description;
          b.bl_fi_mst_comp.tax_registration_id = action.company.value.taxRegistrationNum;
          b.bl_fi_mst_comp.comp_registration_num = action.company.value.registrationNum;
          b.bl_fi_mst_comp.ccy_code = action.company.value.currency;

          b.bl_fi_mst_comp_ext.forEach((ext) => {
            if (ext.param_code === OrganisationConstants.ADDRESS) {
              ext.value_json.phoneNumber = action.company.value.phoneNum;
              ext.value_json.address1 = action.company.value.address1;
              ext.value_json.address2 = action.company.value.address2;
              ext.value_json.address3 = action.company.value.address3;
              ext.value_json.city = action.company.value.city;
              ext.value_json.postalCode = action.company.value.postalCode;
              ext.value_json.state = action.company.value.state;
              ext.value_json.country = action.company.value.country;
            }
            if (ext.param_code === OrganisationConstants.CONTACT_INFO) {
              ext.value_json.faxNum = action.company.value.faxNum;
              ext.value_json.website = action.company.value.website;
              ext.value_json.email = action.company.value.email;
              ext.value_json.companyIncoDate = action.company.value.companyIncoDate;
              ext.value_json.closingDate = action.company.value.closingDate;
              ext.status = action.company.value.status;
            }
            if (ext.param_code === OrganisationConstants.ENTITY_STATUS) {
              ext.value_string = action.company.value.status;
            }
            if (ext.param_code === 'MAIN_BRANCH') {
              ext.value_string = action.company.value.branchGuid;
            }
          });
          return b;
        }),
        concatMap( c => this.compService.put(c, this.apiVisa).pipe(
          map(c_inner => {
            this.toaster.success(
              'The company has been updated',
              'Success',
              {
                tapToDismiss: true,
                progressBar: true,
                timeOut: 1300
              }
            );
            return CompanyActions.updateCompanySuccess({company: c_inner.data})
          }),
          catchError( err => {
            this.toaster.error(
              err.message,
              'Error',
              {
                tapToDismiss: true,
                progressBar: true,
                timeOut: 1300
              }
            );
            return of(CompanyActions.updateCompanyFailure({error: err.message}))
          })
        )),
        catchError( err => {
          this.toaster.error(
            err.message,
            'Error',
            {
              tapToDismiss: true,
              progressBar: true,
              timeOut: 1300
            }
          );
          return of(CompanyActions.updateCompanyFailure({error: err.message}))
        })
    ))
  ));

  constructor(
    private actions$: Actions,
    private compService: CompanyService,
    private toaster: ToastrService
  ) {}
}
