import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { FileDetails, FilesDetailsRequest, InternalSalesReturnService } from 'blg-akaun-ts-lib';
import { AppConfig } from 'projects/shared-utilities/visa';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { ToastConstants } from '../../../../models/constants/toast.constants';
import { SalesReturnActions } from '../../../sales-return-controller/store/actions';
import { AttachmentActions } from '../actions';
import { AttachmentSelectors, HDRSelectors } from '../selectors';
import { DraftStates } from '../states';
import { AttachmentState } from '../states/atachment.states';

@Injectable()
export class AttachmentEffects {

    uploadAttachments$ = createEffect(() => this.actions$.pipe(
        ofType(AttachmentActions.uploadAttachmentsInit),
        withLatestFrom(this.store.select(AttachmentSelectors.selectAll), this.draftStore.select(HDRSelectors.selectHdr)),
        mergeMap(([action, attachment, draft]) => {
            const fileRequest = new FilesDetailsRequest();
            attachment.forEach(attach => {
                const fileDetail = new FileDetails(attach.fileAttributes.fileName, attach.fileAttributes);
                fileRequest.addFileDetail(fileDetail);
            });
            return this.prService.addAttachmentsAndDetails(
            draft.guid.toString(), attachment.map(attach => attach.file), AppConfig.apiVisa, fileRequest).pipe(
                map(a => {
                    this.viewColFacade.showSuccessToast(ToastConstants.attachmentAddedSuccess);
                    // return AttachmentActions.uploadAttachmentsSuccess({ ext: a.data.map(d => d.bl_fi_generic_doc_ext).flat() });
                    return AttachmentActions.uploadAttachmentsSuccess({ ext: a.data.map(d => d.bl_fi_generic_doc_ext).flat() });
                }),
                catchError(err => {
                    this.viewColFacade.showFailedToast(err);
                    return of(AttachmentActions.uploadAttachmentsFailed());
                })
            );
        })
    ));

    selectReturn$ = createEffect(() => this.actions$.pipe(
        ofType(AttachmentActions.uploadAttachmentsSuccess),
        exhaustMap(action => this.prService.getByGuid(action.ext[0].guid_doc_hdr, AppConfig.apiVisa).pipe(
          map((a: any) => {
            this.viewColFacade.updateInstance(2, {
                deactivateAdd: false,
                deactivateReturn: false,
                deactivateList: false
              });
              this.viewColFacade.resetIndex(2);
            return SalesReturnActions.selectReturnForEdit({ genDoc: a.data})
          }),
        ))
    ));

    constructor(
        private actions$: Actions,
        private prService: InternalSalesReturnService,
        private viewColFacade: ViewColumnFacade,
        private readonly store: Store<AttachmentState>,
        private readonly draftStore: Store<DraftStates>
    ) { }
}
