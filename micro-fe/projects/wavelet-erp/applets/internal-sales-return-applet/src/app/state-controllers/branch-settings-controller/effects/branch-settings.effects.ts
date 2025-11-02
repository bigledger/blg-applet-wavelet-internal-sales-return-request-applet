import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin, of } from 'rxjs';
import { map, mergeMap, catchError, exhaustMap, concatMap } from 'rxjs/operators';
import { BranchDefaultPrintableFormatHdrContainerModel,FinancialItemService, BranchDefaultPrintableFormatHdrService, BranchSettlementMethodService, Pagination, BranchService } from 'blg-akaun-ts-lib';
import { BranchSettingsActions } from '../actions';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from 'projects/shared-utilities/visa';
import { Store } from '@ngrx/store';

@Injectable()
export class BranchSettingsEffects {

    private readonly apiVisa = AppConfig.apiVisa;

    updateBranchDetails$ = createEffect(() => this.actions$.pipe(
      ofType(BranchSettingsActions.updateBranchDetails),
      concatMap(action => this.branchService.getByGuid(action.guid.toString(), this.apiVisa)
        .pipe(
          map(a => a.data),
          map(b => {
            if(action.form.value.salesAgent){
              b.bl_fi_mst_branch.default_sales_entity_hdr_guid = action.form.value.salesAgent;
            }
            if(action.form.value.group_discount_item_guid){
              b.bl_fi_mst_branch.group_discount_item_guid = action.form.value.group_discount_item_guid;
            }
            if(action.form.value.default_settlement_cash){
              b.bl_fi_mst_branch.default_settlement_method_json = <any> {...b.bl_fi_mst_branch.default_settlement_method_json,
                "default_settlement_cash":action.form.value.default_settlement_cash
              }
            }
            if(action.form.value.default_settlement_credit_card){
              b.bl_fi_mst_branch.default_settlement_method_json = <any> {...b.bl_fi_mst_branch.default_settlement_method_json,
                "default_settlement_credit_card":action.form.value.default_settlement_credit_card
              }
            }
            if(action.form.value.default_settlement_debit_card){
              b.bl_fi_mst_branch.default_settlement_method_json = <any> {...b.bl_fi_mst_branch.default_settlement_method_json,
                "default_settlement_debit_card":action.form.value.default_settlement_debit_card
              }
            }
            if(action.form.value.default_settlement_voucher){
              b.bl_fi_mst_branch.default_settlement_method_json = <any> {...b.bl_fi_mst_branch.default_settlement_method_json,
                "default_settlement_voucher":action.form.value.default_settlement_voucher
              }
            }
            if(action.form.value.default_settlement_bank_transfer){
              b.bl_fi_mst_branch.default_settlement_method_json = <any> {...b.bl_fi_mst_branch.default_settlement_method_json,
                "default_settlement_bank_transfer":action.form.value.default_settlement_bank_transfer
              }
            }
            if(action.form.value.default_settlement_cheque){
              b.bl_fi_mst_branch.default_settlement_method_json = <any> {...b.bl_fi_mst_branch.default_settlement_method_json,
                "default_settlement_cheque":action.form.value.default_settlement_cheque
              }
            }
            if(action.form.value.default_settlement_others){
              b.bl_fi_mst_branch.default_settlement_method_json = <any> {...b.bl_fi_mst_branch.default_settlement_method_json,
                "default_settlement_others":action.form.value.default_settlement_others
              }
            }
            if(action.form.value.default_settlement_ewallet){
              b.bl_fi_mst_branch.default_settlement_method_json = <any> {...b.bl_fi_mst_branch.default_settlement_method_json,
                "default_settlement_ewallet":action.form.value.default_settlement_ewallet
              }
            }
            if(action.form.value.default_settlement_membership_point_currency){
              b.bl_fi_mst_branch.default_settlement_method_json = <any> {...b.bl_fi_mst_branch.default_settlement_method_json,
                "default_settlement_membership_point_currency":action.form.value.default_settlement_membership_point_currency
              }
            }
            return b;
          }),
          mergeMap(res => this.branchService.put(res, this.apiVisa)
            .pipe(
              map((res: any) => {
                this.toastr.success(
                  'Branch details has been updated successfully',
                  'Success',
                  {
                    tapToDismiss: true,
                    progressBar: true,
                    timeOut: 3000
                  }
                );
  
                //this.viewColFacade.resetIndex(0);
                // this.onReturn();
                return BranchSettingsActions.updateBranchDetailsSuccess();
              }),
              catchError((err) => {
                this.toastr.error(
                  err.message,
                  'Error',
                  {
                    tapToDismiss: true,
                    progressBar: true,
                    timeOut: 3000
                  }
                );
                return of(BranchSettingsActions.updateBranchDetailsFailed({ error: err.messsage }));
              })
            ))
  
        ))
    ));

    selectBranchSettlementMethodListInit$ = createEffect(() => this.actions$.pipe(
      ofType(BranchSettingsActions.selectBranchSettlementMethodListInit),
      mergeMap((action) => {
        const paging = new Pagination();
        paging.conditionalCriteria.push({ columnName: 'branch_guid', operator: '=', value: action.branchGuid.toString() });
        
        return this.branchSettlementMethodService.getByCriteria(paging, this.apiVisa).pipe(
          mergeMap(res => {
            return this.processList(res.data).pipe(
              map(processedList => {
                return BranchSettingsActions.selectBranchSettlementMethodListSucess({ container: processedList });
              }),
              catchError(err => {
                return of(BranchSettingsActions.selectBranchSettlementMethodListFailure({ error: err.message }));
              })
            );
          }),
          catchError(err => {
            return of(BranchSettingsActions.selectBranchSettlementMethodListFailure({ error: err.message }));
          })
        )
      })
    ));

    processList(list: any[]) {
      const observables = list.map((item) =>
        this.fiItemService.getByGuid(item.bl_fi_mst_branch_settlement_method.fi_item_hdr_guid.toString(), AppConfig.apiVisa).pipe(
          map(res => ({
            guid: res.data.bl_fi_mst_item_hdr.guid,
            code: res.data.bl_fi_mst_item_hdr.code,
            name: res.data.bl_fi_mst_item_hdr.name,
            settlementType: (() => {
              const ext = res.data.bl_fi_mst_item_exts.find(ext => ext.param_code === 'SETTLEMENT_TYPE' && ext.value_string !== null);
              return ext ? ext.value_string : "";
            })(), 
          }))
        )
      );
    
      return forkJoin(observables);
    }
    

    editDefaultPrintableFormatInit$ = createEffect(() => this.actions$.pipe(
      ofType(BranchSettingsActions.editDefaultPrintableFormatInit),
      concatMap(action => this.branchPrintableService.getByGuid(action.container.bl_fi_mst_branch_default_printable_format_hdr.guid.toString(), this.apiVisa)
        .pipe(
          map(a => a.data),
          map(b => {
            let container: BranchDefaultPrintableFormatHdrContainerModel = b;
            container = b;
            container.bl_fi_mst_branch_default_printable_format_hdr.header = action.container.bl_fi_mst_branch_default_printable_format_hdr.header;
            container.bl_fi_mst_branch_default_printable_format_hdr.footer = action.container.bl_fi_mst_branch_default_printable_format_hdr.footer;
            container.bl_fi_mst_branch_default_printable_format_hdr.default_printable_format_guid =  action.container.bl_fi_mst_branch_default_printable_format_hdr.default_printable_format_guid;
            return container;
          }),
          mergeMap(action => this.branchPrintableService.put(action, this.apiVisa)
            .pipe(
              map((printable: any) => {
                this.toaster.success(
                  'Branch printable format been updated successfully',
                  'Success',
                  {
                    tapToDismiss: true,
                    progressBar: true,
                    timeOut: 3000
                  }
                );
                return BranchSettingsActions.editDefaultPrintableFormatSucess({ container: printable.data });
              }),
              catchError((err) => {
                this.toaster.error(
                  err.message,
                  'Error',
                  {
                    tapToDismiss: true,
                    progressBar: true,
                    timeOut: 3000
                  }
                );
                return of(BranchSettingsActions.editDefaultPrintableFormatFailure({ error: err.messsage }));
              })
            ))
  
        ))
    ));

    selectDefaultPrintableFormatInit$ = createEffect(() => this.actions$.pipe(
        ofType(BranchSettingsActions.selectDefaultPrintableFormatInit),
        mergeMap((action) => {
          const paging = new Pagination();
          paging.conditionalCriteria.push({ columnName: 'branch_guid', operator: '=', value: action.branchGuid.toString() });
          paging.conditionalCriteria.push({ columnName: 'server_doc_type', operator: '=', value: action.serverDocType.toString() });
          return this.branchPrintableService.getByCriteria(paging, this.apiVisa).pipe(
            map(res => {
              const printable = res.data.length?res.data[0]:null
              return BranchSettingsActions.selectDefaultPrintableFormatSucess({ container: printable });
            }),
            catchError(err => {
              return of(BranchSettingsActions.selectDefaultPrintableFormatFailure({ error: err.message }));
            })
          )
        })
    ));
    
    addDefaultPrintableFormatInit$ = createEffect(() => this.actions$.pipe(
        ofType(BranchSettingsActions.addDefaultPrintableFormatInit),
        exhaustMap((a) => this.branchPrintableService.postOne(a.container, this.apiVisa).pipe(
          map(b => {
            this.toaster.success(
              'Branch printable format been created successfully',
              'Success',
              {
                tapToDismiss: true,
                progressBar: true,
                timeOut: 3000
              }
            );
            return BranchSettingsActions.addDefaultPrintableFormatSucess({ container: b.data[0]});
          }),
          catchError(err => of(BranchSettingsActions.addDefaultPrintableFormatFailure({ error: err.message })))
        )),
      ));

    constructor(
      private fiItemService: FinancialItemService,
        private branchService: BranchService,
        private toastr: ToastrService,
        private branchSettlementMethodService: BranchSettlementMethodService,
        private branchPrintableService: BranchDefaultPrintableFormatHdrService,
        private actions$: Actions,
        private toaster: ToastrService
    ) {};
}