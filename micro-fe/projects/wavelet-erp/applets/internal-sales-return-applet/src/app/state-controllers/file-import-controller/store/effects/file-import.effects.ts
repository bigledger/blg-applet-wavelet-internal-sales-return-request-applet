import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, of } from 'rxjs';
import { map, switchMap, mergeMap, catchError, exhaustMap, withLatestFrom } from 'rxjs/operators';
import {
  bl_fi_generic_doc_ext_RowClass,
  bl_fi_generic_doc_line_RowClass,
  GenericDocContainerModel,
  BranchService,
  ARAPService,
  EntityService,
  PricingSchemeService,
  PricingSchemeLinkService,
  SalesReturnFileImportHelperService,
  Pagination
} from 'blg-akaun-ts-lib';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { AppConfig } from 'projects/shared-utilities/visa';
import { ToastConstants } from '../../../../models/constants/toast.constants';
import { HDRSelectors, PNSSelectors, LinkSelectors } from '../../../draft-controller/store/selectors';
import { DraftStates } from '../../../draft-controller/store/states';
import { FileImportActions } from '../actions';
import { FileImportSelectors } from '../selectors';
import { FileImportStates } from '../states';

@Injectable()
export class FileImportEffects {

  apiVisa = AppConfig.apiVisa;

  loadFileImportAllData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FileImportActions.loadFileImportAllData),
      switchMap((action) => {
        const paging = new Pagination();
        paging.offset = 0;
        paging.limit = 10000;
        paging.conditionalCriteria = [
          { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
          { columnName: 'file_import_hdr_guid', operator: '=', value: action.fileImportHdrGuid },
        ];
        return this.helpercheckingService.getByCriteria(paging, AppConfig.apiVisa).pipe(
          map((resolved) => {
            return FileImportActions.loadFileImportAllDataSuccess({ data: resolved.data })
          }),
          catchError((err) => {
            console.error('error', err);
            return of(FileImportActions.loadFileImportAllDataFailure({ error: err }));
          })
        );
      })
    )
  );
  
  loadFileImportErrorData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FileImportActions.loadFileImportErrorData),
      switchMap((action) => {
        const paging = new Pagination();
        paging.offset = 0;
        paging.limit = 10000;
        paging.conditionalCriteria = [
          { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
          { columnName: 'file_import_hdr_guid', operator: '=', value: action.fileImportHdrGuid },
          { columnName: 'validation_status', operator: '=', value: "FAILED" },
        ];
        return this.helpercheckingService.getByCriteria(paging, AppConfig.apiVisa).pipe(
          map((resolved) => {
            return FileImportActions.loadFileImportErrorDataSuccess({ data: resolved.data })
          }),

          // map((resolved) => FileImportActions.loadFileImportErrorDataSuccess({ data: resolved.data })),
          catchError((err) => {
            return of(FileImportActions.loadFileImportErrorDataFailure({ error: err }));
          })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private viewColFacade: ViewColumnFacade,
    private toastr: ToastrService,
    private entityService: EntityService,
    private branchService: BranchService,
    private arapService: ARAPService,
    private pricingService: PricingSchemeService,
    private pslService: PricingSchemeLinkService,
    private draftStore: Store<DraftStates>,
    private helpercheckingService: SalesReturnFileImportHelperService,
    private store: Store<FileImportStates>) {
  }
  
}