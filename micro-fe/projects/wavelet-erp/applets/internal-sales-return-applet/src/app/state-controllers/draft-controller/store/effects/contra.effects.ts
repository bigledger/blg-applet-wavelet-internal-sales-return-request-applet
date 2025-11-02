import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppConfig } from 'projects/shared-utilities/visa';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { DraftStates } from '../states';
import { ContraActions } from '../actions';
import { ListingService } from 'projects/shared-utilities/services/listing-service';
import { ListingInputModel } from 'projects/shared-utilities/models/listing-input.model';

@Injectable()
export class ContraEffects {

  loadContraInit$ = createEffect(() => this.actions$.pipe(
    ofType(ContraActions.loadContraInit),
    mergeMap((action) => {
      const formData = this.getInputModel(action.guid_doc_1_hdr);
      return this.listingService.get("arap-contra/backoffice-ep", formData, AppConfig.apiVisa).pipe(
        map(res => {
          return ContraActions.loadContraSuccess({ contra: res.data });
        }),
        catchError((err) => {
          return of(
            ContraActions.loadContraFailed({
              error: err.message,
            })
          );
        })
      )
    })
  ));

  getInputModel(guid_doc_1_hdr: any) {
    const inputModel = {} as ListingInputModel;
    inputModel.status = ['ACTIVE'];
    inputModel.orderBy = 'created_date';
    inputModel.order = 'desc';
    inputModel.limit = 100;
    inputModel.offset = 0;
    inputModel.calcTotalRecords = true;
    inputModel.showCreatedBy = false;
    inputModel.showUpdatedBy = false;
    inputModel.filterLogical= 'AND';
    inputModel.filters = {},
      inputModel.filterConditions = [
        {
          "filterColumn": "guid_doc_1_hdr",
          "filterValues": [guid_doc_1_hdr],
          "filterOperator": " = "
        }
      ];
    inputModel.joins = [
      {
        "tableName": "bl_fi_generic_doc_hdr",
        "joinColumn":"hdr.guid_doc_2_hdr=bl_fi_generic_doc_hdr.guid",
        "columns":["server_doc_1"]
      }
    ]


    return inputModel;
  }

  constructor(
      private actions$: Actions,
      protected listingService: ListingService,
      private viewColFacade: ViewColumnFacade,
      private readonly draftStore: Store<DraftStates>
  ) { }
}
