import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { UUID } from 'angular2-uuid';
import { bl_applet_ext_RowInterface, Pagination, PrintableFormatContainerModel, PrintableFormatListService, PrintableFormatService, TenantAppletService } from 'blg-akaun-ts-lib';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from 'projects/shared-utilities/visa';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, withLatestFrom } from 'rxjs/operators';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { PrintableFormatConstants } from '../../../../models/constants/printable-format-constants';
import { ToastConstants } from '../../../../models/constants/toast.constants';
import { PrintableFormatActions } from '../actions';
import { PrintableFormatSelectors } from '../selectors';
import { PrintableFormatStates } from '../states';

@Injectable()
export class PrintableFormatEffects {

  apiVisa = AppConfig.apiVisa;

  createPrintableFormat$ = createEffect(() => this.actions$.pipe(
    ofType(PrintableFormatActions.createPrintableFormatInit),
    withLatestFrom(
      this.store.select(PrintableFormatSelectors.selectDraftData),
    ),
    exhaustMap(([action, draftData]) => {
      return this.tenantAppletService.getByGuid(sessionStorage.getItem('appletGuid'), this.apiVisa).pipe(
        map((response) => {
          let printableExtIndex = response.data.bl_applet_exts.findIndex(x =>
            x.param_code === PrintableFormatConstants.appletSettingsExtParamCode)
          return { "appletContainer": response.data, "printableExtIndex": printableExtIndex, "draftData": draftData };
        }),
        catchError(err => {
          return of(err);
        })
      )
    }),
    exhaustMap((resolved) => {
      if (resolved.printableExtIndex === -1) {
        let printableExt: bl_applet_ext_RowInterface = {
          "guid": UUID.UUID().toLowerCase(),
          "hdr_guid": sessionStorage.getItem('appletGuid'),
          "line_guid": null,
          "ext_type": "SYSTEM_DEFAULT",
          "ext_code": null,
          "ext_option": null,
          "property_json": null,
          "param_code": PrintableFormatConstants.appletSettingsExtParamCode,
          "param_name": PrintableFormatConstants.appletSettingsExtParamCode,
          "param_type": "STRING",
          "param_option_json": null,
          "value_string": null,
          "value_file": null,
          "value_numeric": null,
          "value_datetime": null,
          "value_json": null,
          "created_date": null,
          "updated_date": null,
          "status": "ACTIVE",
          "revision": UUID.UUID().toLowerCase(),
          "vrsn": null,
        }
        resolved.appletContainer.bl_applet_exts.push(printableExt)
        return this.tenantAppletService.put(resolved.appletContainer, this.apiVisa).pipe(
          catchError(err => {
            return of(err);
          })
        )
      }
      return of({ "draftData": resolved.draftData });
    }),
    exhaustMap((resolved) => {
      let pagination = new Pagination();
      pagination.conditionalCriteria = [
        { columnName: 'code', operator: '=', value: "Jasper JRXML" },
      ];
      return this.printableFormatListService.getByCriteria(pagination, this.apiVisa).pipe(
        map((response) => {
          return { "printable_format_list_guid": response.data[0].bl_prt_printable_format_list_hdr.guid, "draftData": resolved.draftData }
        }),
        catchError(err => {
          return of(err);
        })
      )
    }),
    exhaustMap((resolved) => {
      let formData: FormData = new FormData();
      let printableFormatContainer = new PrintableFormatContainerModel();
      const file = resolved.draftData.attachment.file

      printableFormatContainer = {
        "bl_prt_printable_format_hdr": {
          "guid": null,
          "guid_parent": null,
          "printable_format_list_guid": resolved.printable_format_list_guid,
          "txn_type": PrintableFormatConstants.docType,
          "code": resolved.draftData.formatCode,
          "name": resolved.draftData.formatName,
          "descr": null,
          "property_json": resolved.draftData.attachment,
          "created_date": null,
          "updated_date": null,
          "created_by_subject_guid": null,
          "updated_by_subject_guid": null,
          "status": null,
          "revision": null,
          "vrsn": null,
          "namespace": null,
          "applet_guid": null,
          "module_guid": null,
          "acl_config": null,
          "acl_policy": null
        },
        "bl_prt_printable_format_exts": []
      }

      const printableFormatContainerBlob = new Blob([JSON.stringify(printableFormatContainer)], {
        type: 'application/json'
      });

      const fileDataBlob = new Blob([JSON.stringify({ 'fileJsonDetails': resolved.draftData.attachment })], {
        type: 'application/json'
      });

      formData.append("printableFormatContainer", printableFormatContainerBlob);
      formData.append('file', file);
      formData.append("file-data", fileDataBlob);

      return this.printableFormatService.postWithAttachments(formData, this.apiVisa).pipe(
        map((a: any) => {
          this.viewColFacade.showSuccessToast(ToastConstants.createPrintableFormatSuccess);
          this.viewColFacade.updateInstance(0, {
            deactivateAdd: false,
            deactivateList: false
          });
          this.viewColFacade.resetIndex(0);
          return PrintableFormatActions.createPrintableFormatSuccess();
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
          return of(PrintableFormatActions.createPrintableFormatFailed({ error: err.message }));
        })
      )
    })
  ));

  editPrintableFormat$ = createEffect(() => this.actions$.pipe(
    ofType(PrintableFormatActions.editPrintableFormatInit),
    withLatestFrom(
      this.store.select(PrintableFormatSelectors.selectDraftData),
      this.store.select(PrintableFormatSelectors.selectPrintableFormat),
    ),
    exhaustMap(([action, draftData, printableFormatData]) => {
      let formData: FormData = new FormData();
      const file = draftData.attachment.file
      const fileDataBlob = new Blob([JSON.stringify(file)], {
        type: 'application/json'
      });
      formData.append('file', file);
      formData.append("file-data", fileDataBlob);
      return this.printableFormatService.replaceFile(formData, printableFormatData.bl_prt_printable_format_exts[0].guid.toString(), this.apiVisa).pipe(
        map((response) => {
          return { "response": response, "draftData": draftData, "printableFormatHdrData": printableFormatData.bl_prt_printable_format_hdr }
        }),
        catchError(err => {
          return of(err);
        })
      )
    }),
    exhaustMap((resolved) => {
      console.log(resolved)
      let printableFormatContainer = new PrintableFormatContainerModel

      // Updating hdr data
      printableFormatContainer.bl_prt_printable_format_hdr = resolved.printableFormatHdrData
      printableFormatContainer.bl_prt_printable_format_hdr.code = resolved.draftData.formatCode
      printableFormatContainer.bl_prt_printable_format_hdr.name = resolved.draftData.formatName
      printableFormatContainer.bl_prt_printable_format_hdr.property_json = resolved.draftData.attachment

      // Updating exts data
      printableFormatContainer.bl_prt_printable_format_exts = resolved.response.bl_prt_printable_format_exts;

      return this.printableFormatService.put(printableFormatContainer, this.apiVisa).pipe(
        map((a: any) => {
          this.viewColFacade.showSuccessToast(ToastConstants.editPrintableFormatSuccess);
          this.viewColFacade.updateInstance(0, {
            deactivateAdd: false,
            deactivateList: false
          });
          this.viewColFacade.resetIndex(0);
          return PrintableFormatActions.editPrintableFormatSuccess();
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
          return of(PrintableFormatActions.editPrintableFormatFailed({ error: err.message }));
        })
      )
    })
  ));

  deletePrintableFormat$ = createEffect(() => this.actions$.pipe(
    ofType(PrintableFormatActions.deletePrintableFormatInit),
    withLatestFrom(this.store.select(PrintableFormatSelectors.selectPrintableFormat)),
    exhaustMap(([a, b]) => this.printableFormatService.delete(b.bl_prt_printable_format_hdr.guid.toString(), this.apiVisa).pipe(
      map(() => {
        this.viewColFacade.showSuccessToast(ToastConstants.deletePrintableFormatSuccess);
        this.viewColFacade.updateInstance(0, {
          deactivateAdd: false,
          deactivateList: false,
        });
        this.viewColFacade.resetIndex(0);
        return PrintableFormatActions.deletePrintableFormatSuccess();
      }),
      catchError(err => {
        this.viewColFacade.showFailedToast(err);
        return of(PrintableFormatActions.deletePrintableFormatFailed({ error: err.message }));
      })
    ))
  ));

  selectDefaultPrintableFormat$ = createEffect(() => this.actions$.pipe(
    ofType(PrintableFormatActions.selectDefaultPrintableFormatInit),
    withLatestFrom(this.store.select(PrintableFormatSelectors.selectDefaultPrintableFormatGuid)),
    exhaustMap(([action, selectedGuid]) => this.tenantAppletService.getByGuid(sessionStorage.getItem('appletGuid'), this.apiVisa).pipe(
      map((response) => {
        let printableExtIndex = response.data.bl_applet_exts.findIndex(x =>
          x.param_code === PrintableFormatConstants.appletSettingsExtParamCode)
        response.data.bl_applet_exts[printableExtIndex].value_string = selectedGuid;
        return response
      }),
      catchError(err => {
        return of(err);
      })
    )),
    exhaustMap(resolved => this.tenantAppletService.put(resolved.data, this.apiVisa).pipe(
      map((a: any) => {
        return PrintableFormatActions.selectDefaultFormatSuccess();
      }),
      catchError(err => {
        return of(PrintableFormatActions.selectDefaultFormatFailed({ error: err.message }));;
      })
    )),
  ));

  constructor(
    private actions$: Actions,
    private viewColFacade: ViewColumnFacade,
    private printableFormatService: PrintableFormatService,
    private printableFormatListService: PrintableFormatListService,
    private tenantAppletService: TenantAppletService,
    private store: Store<PrintableFormatStates>,
    private toastr: ToastrService,
  ) { }
}