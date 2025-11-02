import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { bl_applet_ext_RowClass, Pagination, PrintableFormatContainerModel, PrintableFormatListService, PrintableFormatService, TenantAppletService } from 'blg-akaun-ts-lib';
import { ToastrService } from 'ngx-toastr';
import { SessionActions } from 'projects/shared-utilities/modules/session/session-controller/actions';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { AppConfig } from 'projects/shared-utilities/visa';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, withLatestFrom } from 'rxjs/operators';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { AppletSettings } from '../../../../models/applet-settings.model';
import { AppletConstants } from '../../../../models/constants/applet-constants';
import { ToastConstants } from '../../../../models/constants/toast.constants';
import { PrintableFormatActions } from '../actions';
import { PrintableFormatSelectors } from '../selectors';
import { PrintableFormatStates } from '../states';

@Injectable()
export class PrintableFormatEffects {

  apiVisa = AppConfig.apiVisa;

  createPrintableFormat$ = createEffect(() => this.actions$.pipe(
    ofType(PrintableFormatActions.createPrintableFormatInit),
    exhaustMap((action) => {
      let pagination = new Pagination();
      pagination.conditionalCriteria = [
        { columnName: 'code', operator: '=', value: "Jasper JRXML" },
      ];
      return this.printableFormatListService.getByCriteria(pagination, this.apiVisa).pipe(
        map((response) => response.data[0].bl_prt_printable_format_list_hdr.guid),
        catchError(err => {
          return of(err);
        })
      )
    }),
    withLatestFrom(
      this.printableStore.select(PrintableFormatSelectors.selectDraftData),
    ),
    exhaustMap(([printable_format_list_guid, draftData]) => {
      // Setting up printableFormatContainer
      let printableFormatContainer = new PrintableFormatContainerModel();
      printableFormatContainer.bl_prt_printable_format_hdr.printable_format_list_guid = printable_format_list_guid;
      printableFormatContainer.bl_prt_printable_format_hdr.txn_type = AppletConstants.docType;
      printableFormatContainer.bl_prt_printable_format_hdr.code = draftData.formatCode;
      printableFormatContainer.bl_prt_printable_format_hdr.name = draftData.formatName;
      printableFormatContainer.bl_prt_printable_format_hdr.property_json = draftData.attachment;

      // Setting up formData
      let formData: FormData = new FormData();
      const file = draftData.attachment.file
      const printableFormatContainerBlob = new Blob([JSON.stringify(printableFormatContainer)], {
        type: 'application/json'
      });
      const fileDataBlob = new Blob([JSON.stringify({ 'fileJsonDetails': draftData.attachment })], {
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
      this.printableStore.select(PrintableFormatSelectors.selectDraftData),
      this.printableStore.select(PrintableFormatSelectors.selectPrintableFormat),
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
    withLatestFrom(this.printableStore.select(PrintableFormatSelectors.selectPrintableFormat)),
    exhaustMap(([action, printableFormat]) => this.printableFormatService.delete(printableFormat.bl_prt_printable_format_hdr.guid.toString(), this.apiVisa).pipe(
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
    ofType(PrintableFormatActions.selectDefaultPrintableFormat),
    withLatestFrom(this.sessionStore.select(SessionSelectors.selectMasterSettings)),
    exhaustMap(([action, currentSettings]) => {
      let newSettings: AppletSettings;
      if (currentSettings !== {}) {
        newSettings = currentSettings;
      }
      newSettings.PRINTABLE = action.defaultPrintableFormatGuid;
      return of(PrintableFormatActions.saveSettings({ settings: newSettings }));
    }),
  ));

  saveSettings$ = createEffect(() => this.actions$.pipe(
    ofType(PrintableFormatActions.saveSettings),
    exhaustMap(action => this.appletService.getByGuid(sessionStorage.getItem('appletGuid'), this.apiVisa).pipe(
      map(a => {
        const ext = a.data.bl_applet_exts.find(x => x.param_code === 'APPLET_SETTINGS') ?? new bl_applet_ext_RowClass();
        ext.param_code = 'APPLET_SETTINGS';
        ext.param_name = 'APPLET_SETTINGS';
        ext.param_type = 'JSON';
        ext.value_json = ext.value_json ? { ...ext.value_json, ...action.settings } : action.settings;
        if (!ext.guid) {
          a.data.bl_applet_exts.push(ext);
        }
        return a.data;
      }),
      exhaustMap(b => this.appletService.put(b, this.apiVisa).pipe(
        map(a_a => {
          return SessionActions.saveMasterSettingsSuccess(
            { settings: a_a.data.bl_applet_exts.find(x => x.param_code === 'APPLET_SETTINGS').value_json });
        }),
        catchError(err => {
          this.toastr.error(
            err.message,
            'Error',
            {
              tapToDismiss: true,
              progressBar: true,
              timeOut: 1300
            }
          );
          return of(SessionActions.saveMasterSettingsFailed({ error: err.message }));
        })
      )),
      catchError(err => {
        this.toastr.error(
          err.message,
          'Error',
          {
            tapToDismiss: true,
            progressBar: true,
            timeOut: 1300
          }
        );
        return of(SessionActions.saveMasterSettingsFailed({ error: err.message }));
      })
    ))
  ));

  constructor(
    private actions$: Actions,
    private viewColFacade: ViewColumnFacade,
    private printableFormatService: PrintableFormatService,
    private printableFormatListService: PrintableFormatListService,
    private appletService: TenantAppletService,
    private printableStore: Store<PrintableFormatStates>,
    private sessionStore: Store<SessionStates>,
    private toastr: ToastrService,
  ) { }
}