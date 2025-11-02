import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CompanyContainerModel, CompanyService, CompanyWorkflowGendocProcessContainerModel, CompanyWorkflowGendocProcessService, TenantUserProfileService, WfMdProcessHdrService } from 'blg-akaun-ts-lib';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from 'projects/shared-utilities/visa';
import { forkJoin, iif, Observable, of, zip } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { WorkflowActions } from '../actions';

@Injectable()
export class WorkflowEffects {
  appletGuid = sessionStorage.getItem('appletGuid');

  apiVisa = AppConfig.apiVisa;
  loadCompanyListing$ = createEffect(() => 
    this.actions$.pipe(
      ofType(WorkflowActions.loadCompanyInit),
      switchMap(action =>
        this.companyWorkflowGendocProcessService
          .getByCriteria(action.pagination, this.apiVisa)
          .pipe(
            mergeMap(b => {
              const filteredData = b.data.filter(item => item.bl_fi_comp_workflow_gendoc_process_template_hdr.applet_guid === this.appletGuid.toString());
              console.log('response:: ', filteredData);
              const source: Observable<CompanyWorkflowGendocProcessContainerModel>[] = [];
              filteredData.forEach(doc => source.push(
                zip(
                  this.profileService.getProfileName(this.apiVisa, doc.bl_fi_comp_workflow_gendoc_process_template_hdr.created_by_subject_guid?.toString()).pipe(
                    catchError((err) => of(err))
                  ),
                  this.profileService.getProfileName(this.apiVisa, doc.bl_fi_comp_workflow_gendoc_process_template_hdr.updated_by_subject_guid?.toString()).pipe(
                    catchError((err) => of(err))
                  ),
                  this.wfmdprocesshdrService.getByGuid(doc.bl_fi_comp_workflow_gendoc_process_template_hdr.process_hdr_guid?.toString(), this.apiVisa).pipe(
                    catchError((err) => of(err))
                  ),
                  this.companyService.getByGuid(doc.bl_fi_comp_workflow_gendoc_process_template_hdr.company_guid?.toString(), this.apiVisa).pipe(
                    catchError((err) => of(err))
                  ),
                  ).pipe(
                    map(([b_a, b_b, b_c, b_d]) => {
                      doc = Object.assign({
                        createdBy: b_a.error ? '' : b_a.data,
                        updatedBy: b_b.error ? '' : b_b.data,
                        processhdrcode: b_c.error ? '' : b_c.data.bl_wf_md_process_hdr.name,
                        companyCode: b_d.error ? '' : b_d.data.bl_fi_mst_comp.code
                      }, doc);
                      return doc;
                    })
                  )
              ));
              return iif(() => b.data.length > 0,
                forkJoin(source).pipe(map((b_inner) => {
                  b.data = b_inner;
                  return b
                })),
                of(b)
              );
            })
          )
          .pipe(
            map((a) => {
              // console.log("a:: ", a)
              return WorkflowActions.loadCompanySuccess({
                company: a.data,
              })
            }),
            catchError((err) => {
              return of(
                WorkflowActions.loadCompanyFailed({
                  error: err.message,
                })
              );
            })
          )
      )
    )
  );

  createCompanyWorkflow$ = createEffect(() =>
  this.actions$.pipe(
    ofType(WorkflowActions.createCompanyWorkflowInit),
    mergeMap(action => this.companyWorkflowGendocProcessService.post(action.container, this.apiVisa)
      .pipe(
        map((header: any) => {
          this.toastr.success(
            'The Company and Workflow Process has been linked',
            'Success',
            {
              tapToDismiss: true,
              progressBar: true,
              timeOut: 1300
            }
          );
          return WorkflowActions.createCompanyWorkflowSuccess({ container: header.data })
        }),
        catchError((err) => {
          this.toastr.error(
            err.message,
            'Error',
            {
              tapToDismiss: true,
              progressBar: true,
              timeOut: 1300
            }
          );
          return of(WorkflowActions.createCompanyWorkflowFailed({ error: err.messsage }))
        })
      ))
    ));
  updateCompanyWorkflow$ = createEffect(() =>
  this.actions$.pipe(
    ofType(WorkflowActions.updateCompanyWorkflowInit),
    mergeMap(action => this.companyWorkflowGendocProcessService.put(action.container, this.apiVisa)
      .pipe(
        map((header: any) => {
          this.toastr.success(
            'The Company and Workflow Process has been updated',
            'Success',
            {
              tapToDismiss: true,
              progressBar: true,
              timeOut: 1300
            }
          );
          return WorkflowActions.updateCompanyWorkflowSuccess({ container: header.data })
        }),
        catchError((err) => {
          this.toastr.error(
            err.message,
            'Error',
            {
              tapToDismiss: true,
              progressBar: true,
              timeOut: 1300
            }
          );
          return of(WorkflowActions.updateCompanyWorkflowFailed({ error: err.messsage }))
        })
      ))
    ));

    
  deleteCompanyWorkflow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkflowActions.deleteCompanyWorkflowInit),
      mergeMap(action => this.companyWorkflowGendocProcessService.delete(action.guid, this.apiVisa)
        .pipe(
          map((header: any) => {
            this.toastr.success(
              'The Company and Workflow Process has been deleted',
              'Success',
              {
                tapToDismiss: true,
                progressBar: true,
                timeOut: 1300
              }
            );
            return WorkflowActions.deleteCompanyWorkflowSuccess({ guid: action.guid })
          }),
          catchError((err) => {
            this.toastr.error(
              err.message,
              'Error',
              {
                tapToDismiss: true,
                progressBar: true,
                timeOut: 1300
              }
            );
            return of(WorkflowActions.deleteCompanyWorkflowFailure({ error: err.messsage }))
          })
        ))
      ));

  constructor(
    private actions$: Actions,
    private companyService: CompanyService,
    private profileService: TenantUserProfileService,
    private wfmdprocesshdrService: WfMdProcessHdrService,
    private companyWorkflowGendocProcessService: CompanyWorkflowGendocProcessService,
    private toastr: ToastrService, 
    
  ) { }
}