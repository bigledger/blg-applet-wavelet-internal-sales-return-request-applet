import {
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Store } from "@ngrx/store";
import { AppConfig } from "projects/shared-utilities/visa";
import { Observable, Subject, forkJoin, of } from "rxjs";
import { SubSink } from "subsink2";
import { MyEInvoiceRequestRejectionContainerModel, MyEInvoiceRequestRejectionService, MyEInvoiceToIrbContainerContainerModel, MyEInvoiceToIRBHdrLinesService, Pagination } from "blg-akaun-ts-lib";
import { map, switchMap } from "rxjs/operators";
import { InternalSalesReturnSelectors } from "../../../../../state-controllers/internal-sales-return-controller/store/selectors";
import { InternalSalesReturnStates } from "../../../../../state-controllers/internal-sales-return-controller/store/states";
import { MatDialog } from "@angular/material/dialog";
import { isNullOrEmpty } from 'projects/shared-utilities/utilities/misc/misc.utils';
import { RejectionReasonPopUpComponent } from "projects/shared-utilities/utilities/einvoice-request-rejection-reason-popup/rejection-popup.component";
import moment from "moment";
@Component({
  selector: "app-cancellation",
  templateUrl: "./cancellation.component.html",
  styleUrls: ["./cancellation.component.scss"],
})
export class CancellationComponent implements OnInit, OnDestroy {

  protected subs = new SubSink();
  apiVisa = AppConfig.apiVisa;
  public form: FormGroup;
  protected _onDestroy = new Subject<void>();
  isEligibleToMakeRejectionRequest: boolean = false;
  alreadyCancellationRequestMade: boolean = false;
  showRemainingTimeForCancellation: boolean = false;
  internalSubmissionToIRBContainer: MyEInvoiceToIrbContainerContainerModel;
  isCustomer;
  rejectionHdrResp: MyEInvoiceRequestRejectionContainerModel[]
  hide: boolean = true;
  qrCodeImage$: Observable<{ qrCode: string }>;
  constructor(
    private myEInvoiceToIRBHdrLinesService: MyEInvoiceToIRBHdrLinesService,
    protected readonly store: Store<InternalSalesReturnStates>,
    private requestRejectionService: MyEInvoiceRequestRejectionService,
    private dialogRef: MatDialog,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      //from bl_fi_my_einvoice_to_irb_hdr
      einvoiceStatus: new FormControl(""),
      cancellationDateTime: new FormControl(""),
      availableTime: new FormControl(""),

      //from bl_fi_my_einvoice_request_rejection_internal_doc_hdr
      cancellationRequestStatus: new FormControl(""),
      cancellationRequestApprovalStatus: new FormControl(""),
      cancellationRequestProcessingStatus: new FormControl(""),
      cancellationRequestSubmittedDatetime: new FormControl(""),
      cancellationReason: new FormControl(""),
    });

    this.patchEinvoiceDetails();

  }

  patchEinvoiceDetails() {
    this.subs.sink = this.store
      .select(InternalSalesReturnSelectors.selectInternalSalesReturns)
      .pipe(
        switchMap((selectedInternalSalesReturn) => {
          const toIrb$ = selectedInternalSalesReturn.bl_fi_generic_doc_hdr.guid ? this.getDataFromToIRB(selectedInternalSalesReturn.bl_fi_generic_doc_hdr.guid) : of("");

          return forkJoin([toIrb$]).pipe(
            switchMap(([toIrb]) => {
              const validationStatus = (<any>toIrb?.[0])?.bl_fi_my_einvoice_to_irb_hdr.einvoice_document_status;
              if (validationStatus === 'Valid') {
                return this.getRejectionHdrData((<any>toIrb?.[0])?.bl_fi_my_einvoice_to_irb_hdr.guid).pipe(
                  map((rejectionHdrResp) => ({ selectedInternalSalesReturn, toIrb, rejectionHdrResp }))
                );
              } else {
                return of({ selectedInternalSalesReturn, toIrb, rejectionHdrResp: null });
              }
            })
          );
        })
      )
      .subscribe(({ selectedInternalSalesReturn, toIrb, rejectionHdrResp }) => {
        if (!isNullOrEmpty(rejectionHdrResp) && rejectionHdrResp?.length > 0) {
          this.populateRejectionHdrTable(<any>rejectionHdrResp[0])
        } else {
          this.checkEligibleToMakeRejectionRequest((<any>toIrb[0]));
        }

        this.form.patchValue({
          einvoiceStatus: (<any>toIrb?.[0])?.bl_fi_my_einvoice_to_irb_hdr.einvoice_document_status,
          cancellationDateTime: (<any>toIrb?.[0])?.bl_fi_my_einvoice_to_irb_hdr.cancellation_datetime,
          availableTime: this.calculateRemainingHour((<any>toIrb?.[0])?.bl_fi_my_einvoice_to_irb_hdr.validation_datetime, (<any>toIrb?.[0])?.bl_fi_my_einvoice_to_irb_hdr.einvoice_document_status),
        });
      });
  }

  getRejectionHdrData(toIrbHdrGuid) {
    const pagination = new Pagination();
    pagination.conditionalCriteria = [
      { columnName: 'to_irb_doc_hdr_guids', operator: '=', value: toIrbHdrGuid?.toString() },
    ];
    return this.requestRejectionService.getByCriteria(pagination, this.apiVisa).pipe(
      map((toIRBData) => toIRBData.data)
    );
  }

  populateRejectionHdrTable(rejectionHdrResp: MyEInvoiceRequestRejectionContainerModel){
    this.alreadyCancellationRequestMade = true;
    this.form.patchValue({
      cancellationRequestStatus: rejectionHdrResp.bl_fi_my_einvoice_request_rejection_internal_doc_hdr.system_requestor_status,
      cancellationRequestApprovalStatus: rejectionHdrResp.bl_fi_my_einvoice_request_rejection_internal_doc_hdr.system_approval_status,
      cancellationRequestProcessingStatus: rejectionHdrResp.bl_fi_my_einvoice_request_rejection_internal_doc_hdr.system_processing_status,
      cancellationRequestSubmittedDatetime: moment(rejectionHdrResp.bl_fi_my_einvoice_request_rejection_internal_doc_hdr.request_submitted_datetime)?.format("YYYY-MM-DD"),
      cancellationReason: rejectionHdrResp.bl_fi_my_einvoice_request_rejection_internal_doc_hdr.reason,
    });
  }

  getDataFromToIRB(genericDocGuid) {
    let pagination = new Pagination()
    pagination.conditionalCriteria = [
      { columnName: "hdr_generic_doc_hdr_guids", operator: "=", value: genericDocGuid },
    ]
    return this.myEInvoiceToIRBHdrLinesService.getByCriteria(pagination, AppConfig.apiVisa).pipe(
      map((toIRBData) => toIRBData.data)
    ) ?? null;
  }

  checkEligibleToMakeRejectionRequest(internalSubmissionToIRB: MyEInvoiceToIrbContainerContainerModel) {
    if (!isNullOrEmpty(internalSubmissionToIRB?.bl_fi_my_einvoice_to_irb_hdr?.einvoice_document_status) && internalSubmissionToIRB?.bl_fi_my_einvoice_to_irb_hdr?.einvoice_document_status === 'Valid') {
      if (this.haveAvailableTime(internalSubmissionToIRB)) {
        this.isEligibleToMakeRejectionRequest = true;
        this.internalSubmissionToIRBContainer = internalSubmissionToIRB;
      }
    }
  }

  haveAvailableTime(internalSubmissionToIRB: MyEInvoiceToIrbContainerContainerModel) {
    if (!isNullOrEmpty(internalSubmissionToIRB.bl_fi_my_einvoice_to_irb_hdr.validation_datetime)) {
      const validationDate = new Date(internalSubmissionToIRB.bl_fi_my_einvoice_to_irb_hdr.validation_datetime);
      const currentDate = new Date();
      const timeDifference = currentDate.getTime() - validationDate.getTime();
      const hoursDifference = timeDifference / (1000 * 3600);
      if (hoursDifference < 72) {
        return true;
      }
    }
    return false;
  }

  calculateRemainingHour(validation_datetime, validationStatus) {
    if (!isNullOrEmpty(validation_datetime) && validationStatus === 'Valid') {
      this.showRemainingTimeForCancellation = true
      const validationDate = new Date(validation_datetime);
      const currentDate = new Date();
      const timeDifference = currentDate.getTime() - validationDate.getTime();
      const hoursDifference = timeDifference / (1000 * 3600);
      if (hoursDifference < 72) {
        return (72 - hoursDifference)?.toFixed(2);
      } else {
        return 0;
      }
    }
    return null;
  }

  requestForRejection() {
    const dialogRef = this.dialogRef.open(RejectionReasonPopUpComponent, {
      data: this.internalSubmissionToIRBContainer
    });
  
    this.subs.sink = dialogRef.afterClosed().subscribe((result: MyEInvoiceRequestRejectionContainerModel) => {
      if (!isNullOrEmpty(result) ) {
        this.populateRejectionHdrTable(result)
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
