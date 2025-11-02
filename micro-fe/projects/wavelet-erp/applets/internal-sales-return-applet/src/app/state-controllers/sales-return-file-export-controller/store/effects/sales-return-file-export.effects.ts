import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { GenericDocFileExportService } from 'blg-akaun-ts-lib';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { ToastrService } from 'ngx-toastr';
import { SalesReturnFileExportActions } from '../actions';
import { AppConfig } from 'projects/shared-utilities/visa';
import { catchError, map, mergeMap, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class SalesReturnFileExportEffects {

  prevIndex: any;
  prevLocalState: any;
  apiVisa = AppConfig.apiVisa;

  deleteReport$ = createEffect(() => this.actions$.pipe(
    ofType(SalesReturnFileExportActions.deleteSalesReturnFileExportInit),
    mergeMap(action => this.reportService.delete(action.guid, this.apiVisa)
      .pipe(
        map(() => {
          this.toaster.success(
            'The report is deleted',
            'Success',
            {
              tapToDismiss: true,
              progressBar: true,
              timeOut: 1300
            }
          );
          return SalesReturnFileExportActions.deleteSalesReturnFileExportSuccess({guid: action.guid});
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
          return of(SalesReturnFileExportActions.deleteSalesReturnFileExportFailure({error: err.messsage}));
        })
      ))
    )
  );

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false,
    });
    this.viewColFacade.resetIndex(this.prevIndex);
  }

  constructor(
    private actions$: Actions,
    private viewColFacade: ViewColumnFacade,
    private toaster: ToastrService,
    private reportService: GenericDocFileExportService,
  ) {
    this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
  }
}
