import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { FileDetails, FilesDetailsRequest, InternalSalesReturnRequestService, GenericDocAttachmentService, SalesReturnFileImportService } from 'blg-akaun-ts-lib';
import { AppConfig } from 'projects/shared-utilities/visa';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { ToastConstants } from '../../../../models/constants/toast.constants';
import { InternalSalesReturnActions} from '../../../internal-sales-return-controller/store/actions';
import { InternalSalesReturnSelectors } from '../../../internal-sales-return-controller/store/selectors';
import { InternalSalesReturnStates } from '../../../internal-sales-return-controller/store/states';
import { AttachmentActions } from '../actions';
import { AttachmentSelectors, HDRSelectors } from '../selectors';
import { DraftStates } from '../states';
import { ToastrService } from "ngx-toastr";

@Injectable()
export class AttachmentEffects {

    uploadAttachments$ = createEffect(() => this.actions$.pipe(
        ofType(AttachmentActions.uploadAttachmentsInit),
        withLatestFrom(
            this.store.select(AttachmentSelectors.selectAll),
            this.draftStore.select(HDRSelectors.selectHdr)
        ),
        mergeMap(([action, attachment, draft]) => {
            const fileRequest = new FilesDetailsRequest();
            attachment.forEach(attach => {
                const fileDetail = new FileDetails(attach.fileAttributes.fileName, { "file": attach.file, "fileSRC": attach.fileSRC, "fileAttributes": attach.fileAttributes });
                fileRequest.addFileDetail(fileDetail);
            });
            return this.genDocAttachmentService.addAttachment(
                draft.guid.toString(), attachment.map(attach => attach.file), AppConfig.apiVisa, fileRequest).pipe(
                    map(a => {
                        this.viewColFacade.showSuccessToast(ToastConstants.attachmentAddedSuccess);
                        return AttachmentActions.uploadAttachmentsSuccess({ attachment: a.data.map(d => d.bl_fi_generic_doc_attachment).flat() });
                    }),
                    catchError(err => {
                        this.viewColFacade.showFailedToast(err);
                        return of(AttachmentActions.uploadAttachmentsFailed());
                    })
                );
        })
    ));

    selectSalesReturn$ = createEffect(() => this.actions$.pipe(
        ofType(AttachmentActions.uploadAttachmentsSuccess),
        exhaustMap(action => this.isdnService.getByGuid(action.attachment[0].generic_doc_hdr_guid, AppConfig.apiVisa).pipe(
            map((a: any) => {
                this.viewColFacade.updateInstance(2, {
                    deactivateAdd: false,
                    deactivateReturn: false,
                    deactivateList: false
                });
                this.viewColFacade.resetIndex(2);
                return InternalSalesReturnActions.selectSalesReturnForEdit({ genDoc: a.data })
            }),
        ))
    ));

    uploadFiles$ = createEffect(() =>
        this.actions$.pipe(
          ofType(AttachmentActions.uploadSRImportAttachmentsInit),
          withLatestFrom(
            this.draftStore.select(AttachmentSelectors.selectAll),
            this.store.select(InternalSalesReturnSelectors.selectDelimeter)
          ),
          mergeMap(([action, attachment, delimeter]) => {
            const formdata: FormData = new FormData();
            attachment.forEach((attach) => {
              formdata.append("file", attach.file);
              formdata.append("delimiter", delimeter);
            });
    
            console.log(formdata.getAll("file"));
    
            return this.fileImportService
              .postFileUploadETLWithAttachments(formdata, AppConfig.apiVisa)
              .pipe(
                map((a) => {
                  this.toastr.success("Files added successfully", "Success", {
                    tapToDismiss: true,
                  });
                  this.viewColFacade.updateInstance(0, {
                    deactivateAdd: false,
                    deactivateList: false,
                  });
                  this.viewColFacade.resetIndex(0);
                  return AttachmentActions.uploadAttachmentsSuccess({
                    attachment: a.data,
                  });
                }),
                catchError((error) => {
                  this.toastr.error(error.message, error.code, {
                    tapToDismiss: true,
                    progressBar: true,
                    timeOut: 2000,
                  });
                  return of(AttachmentActions.uploadAttachmentsFailed());
                })
              );
          })
        )
      );

    constructor(
        private actions$: Actions,
        private isdnService: InternalSalesReturnRequestService,
        private fileImportService: SalesReturnFileImportService,
        private genDocAttachmentService: GenericDocAttachmentService,
        private viewColFacade: ViewColumnFacade,
        private readonly store: Store<InternalSalesReturnStates>,
        private readonly draftStore: Store<DraftStates>,
        private toastr: ToastrService,
    ) { }
}
