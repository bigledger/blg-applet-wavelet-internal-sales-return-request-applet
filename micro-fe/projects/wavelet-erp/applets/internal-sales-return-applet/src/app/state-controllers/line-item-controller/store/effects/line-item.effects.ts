import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { InternalSalesReturnService, Pagination, PricingSchemeLinkService, PricingSchemeService } from 'blg-akaun-ts-lib';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from 'projects/shared-utilities/visa';
import { forkJoin, of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap } from 'rxjs/operators';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { LineItemActions } from '../actions';

@Injectable()
export class LineItemEffects {

  apiVisa = AppConfig.apiVisa;

  editGenLineItem$ = createEffect(() => this.actions$.pipe(
    ofType(LineItemActions.editGenLineItemInit),
    map((action) => {
      console.log('Edited Gen Doc', action.genDoc);
      action.genDoc.bl_fi_generic_doc_line[0].guid_comp = action.genDoc.bl_fi_generic_doc_hdr.guid_comp;
      action.genDoc.bl_fi_generic_doc_line[0].guid_branch = action.genDoc.bl_fi_generic_doc_hdr.guid_branch;
      action.genDoc.bl_fi_generic_doc_line[0].guid_store = action.genDoc.bl_fi_generic_doc_hdr.guid_store;
      return action.genDoc;
    }),
    exhaustMap((d) => this.isSalesReturnService.put(d, this.apiVisa).pipe(
      map((a: any) => {
        this.toastr.success(
          'The Line Item has been updated successfully',
          'Success',
          {
            tapToDismiss: true,
            progressBar: true,
            timeOut: 2000
          }
        );
        this.viewColFacade.updateInstance(0, {
          deactivateList: false
        });
        this.viewColFacade.resetIndex(0);
        return LineItemActions.editGenLineItemSuccess();
      }),
      catchError(err => {
        this.toastr.error(
          err.message,
          'Error',
          {
            tapToDismiss: true,
            progressBar: true,
            timeOut: 2000
          }
        );
        return of(LineItemActions.editGenLineItemFailed({ error: err.message }));
      })
    ))
  ));

  // selecSalesReturn$ = createEffect(() => this.actions$.pipe(
  //   ofType(LineItemActions.selectLineItem),
  //   exhaustMap(action => this.isSalesReturnService.getByGuid(action.lineItem.generic_doc_hdr_guid.toString(), this.apiVisa).pipe(
  //     map((a: any) => {
  //       return LineItemActions.selectSalesReturn({ genDoc: a.data })
  //     }),
  //   ))
  // ));

  selectPricingLink$ = createEffect(() => this.actions$.pipe(
    ofType(LineItemActions.selectPricingSchemeLink),
    mergeMap(action => {
      const paging = new Pagination();
      paging.conditionalCriteria.push({ columnName: 'item_hdr_guid', operator: '=', value: action.item.item_guid.toString() });
      return this.pslService.getByCriteria(paging, this.apiVisa).pipe(
        mergeMap((result: any) => {
          let allIds = result.data.map(id => this.getPricing(id.bl_fi_mst_pricing_scheme_link.guid_pricing_scheme_hdr.toString()));
          return forkJoin(...allIds).pipe(
            map((idDataArray) => {
              result.data.forEach((eachContact, index) => {
                eachContact.pricing_hdr = idDataArray[index]?.data.bl_fi_mst_pricing_scheme_hdr.name;
              })
              return LineItemActions.selectPricingSchemeLinkSuccess({ pricing: result.data });
            })
          )
        })
      )
    })
  ));

  getPricing(guid: string) {
    return this.pricingService.getByGuid(guid, this.apiVisa)
  }

  addPricingSchemeLink$ = createEffect(() => this.actions$.pipe(
    ofType(LineItemActions.addPricingSchemeLinkInit),
    exhaustMap((action) => this.pslService.post(action.link, this.apiVisa).pipe(
      map(resp => {
        this.viewColFacade.showSuccessToast('Pricing Scheme Added Successfully');
        return LineItemActions.addPricingSchemeLinkSuccess();
      }),
      catchError(err => {
        this.viewColFacade.showFailedToast(err);
        return of(LineItemActions.addPricingSchemeLinkFailed({ error: err.message }));
      })
    ))
  ));

  editPricingSchemeLink$ = createEffect(() => this.actions$.pipe(
    ofType(LineItemActions.editPricingSchemeLinkInit),
    exhaustMap((action) => this.pslService.put(action.link, this.apiVisa).pipe(
      map(resp => {
        this.viewColFacade.showSuccessToast('Pricing Scheme Updated Successfully');
        return LineItemActions.editPricingSchemeLinkSuccess();
      }),
      catchError(err => {
        this.viewColFacade.showFailedToast(err);
        return of(LineItemActions.editPricingSchemeLinkFailed({ error: err.message }));
      })
    ))
  ));

  constructor(
    private actions$: Actions,
    private isSalesReturnService: InternalSalesReturnService,
    private pricingService: PricingSchemeService,
    private pslService: PricingSchemeLinkService,
    private toastr: ToastrService,
    private viewColFacade: ViewColumnFacade,
  ) { }
}
