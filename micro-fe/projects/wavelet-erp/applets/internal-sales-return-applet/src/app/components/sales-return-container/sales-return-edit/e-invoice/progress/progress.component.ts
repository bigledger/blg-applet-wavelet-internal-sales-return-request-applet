import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { AppConfig } from "projects/shared-utilities/visa";
import { Subject, forkJoin, of } from "rxjs";
import { SubSink } from "subsink2";
import moment from "moment";
import { GenericDocEInvoicePostingQueueService, MyEInvoiceBatchPoolDocHdrService, MyEInvoiceGenDocToIRBSubmissionHistoryService, MyEInvoiceGenDocToIRBSubmissionQueueService, TenantUserProfileService, Pagination } from "blg-akaun-ts-lib";
import { map, switchMap } from "rxjs/operators";
import { InternalSalesReturnStates } from "../../../../../state-controllers/internal-sales-return-controller/store/states";
import { InternalSalesReturnSelectors } from "../../../../../state-controllers/internal-sales-return-controller/store/selectors";

@Component({
  selector: "app-progress",
  templateUrl: "./progress.component.html",
  styleUrls: ["./progress.component.scss"],
})
export class ProgressComponent implements OnInit, OnDestroy {

  protected subs = new SubSink();
  apiVisa = AppConfig.apiVisa;
  public form: FormGroup;
  protected _onDestroy = new Subject<void>();
  isCustomer;
  hide: boolean = true;
  genericDocHdrGuid;
  // default values
  defaultMessage = "Processed"
  defaultIcon = "task_alt"
  // einvoice activity
  inPostingQueue: boolean = false;
  inBatchPool: boolean = false;
  inInternalSubmissionQueue: boolean = false;
  inSubmissionHistory: boolean = false;

  allDate;
  // posting queue
  postingQueueMessage;
  postingQueueIcon;
  // batch pool
  batchPoolMessage;
  batchPoolIcon;
  // internal Submission Queue
  internalSubmissionQueueMessage;
  internalSubmissionQueueIcon;
  // internal Submission History
  internalSubmissionHistoryMessage;
  internalSubmissionHistoryIcon;

  interval;

  constructor(
    // private readonly store: Store<TicketStates>,
    private profileService: TenantUserProfileService,
    protected readonly store: Store<InternalSalesReturnStates>,
    private genericDocEInvoicePostingQueueService: GenericDocEInvoicePostingQueueService,
    private myEInvoiceBatchPoolDocHdrService: MyEInvoiceBatchPoolDocHdrService,
    private myEInvoiceGenDocToIRBSubmissionQueueService: MyEInvoiceGenDocToIRBSubmissionQueueService,
    private myEInvoiceGenDocToIRBSubmissionHistoryService: MyEInvoiceGenDocToIRBSubmissionHistoryService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {

    this.patchProgressDetails();
    this.interval = setInterval(() => {
      this.patchProgressDetails();
    }, 3000);

  }

  patchProgressDetails() {

    this.subs.sink = this.store
    .select(InternalSalesReturnSelectors.selectInternalSalesReturns).subscribe(genDoc => {
      this.genericDocHdrGuid = genDoc.bl_fi_generic_doc_hdr.guid;
    })
    let pagination = new Pagination()
    pagination.conditionalCriteria = [
      { columnName: "generic_doc_hdr_guids",  operator: "=" ,value: this.genericDocHdrGuid },
    ]
    forkJoin({
      postingQueue: this.genericDocEInvoicePostingQueueService.getByCriteria(pagination,AppConfig.apiVisa),
      batchPool: this.myEInvoiceBatchPoolDocHdrService.getByCriteria(pagination,AppConfig.apiVisa),
      internalSubmissionQueue: this.myEInvoiceGenDocToIRBSubmissionQueueService.getByCriteria(pagination,AppConfig.apiVisa),
      submissionHistory: this.myEInvoiceGenDocToIRBSubmissionHistoryService.getByCriteria(pagination,AppConfig.apiVisa)
    }).pipe(
      map(response => {
        if (response.postingQueue.data.length) {

          this.inPostingQueue = true;
          this.postingQueueMessage = "In Queue";
          this.postingQueueIcon = "hourglass_top";

          this.batchPoolMessage = "Pending";
          this.batchPoolIcon = "hourglass_top"

          this.internalSubmissionQueueMessage = "Pending";
          this.internalSubmissionQueueIcon = "hourglass_top";

          this.internalSubmissionHistoryMessage = "Pending";
          this.internalSubmissionHistoryIcon = "hourglass_top";

          this.allDate = moment(response.postingQueue.data[0]?.bl_fi_generic_doc_einvoice_posting_queue?.updated_date).format('DD MMMM YYYY, HH:mm')

        }
        else if (response.batchPool.data.length) {

          this.inBatchPool = true;
          this.batchPoolMessage = this.removeFields(response.batchPool.data[0]?.bl_fi_my_einvoice_batch_pool_doc_hdr?.validation_error);
          this.batchPoolIcon = "close"

          this.postingQueueMessage = this.defaultMessage;
          this.postingQueueIcon = this.defaultIcon;

          this.internalSubmissionQueueMessage = "Pending";
          this.internalSubmissionQueueIcon = "hourglass_top";
          
          this.internalSubmissionHistoryMessage = "Pending";
          this.internalSubmissionHistoryIcon = "hourglass_top";

          this.allDate = moment(response.batchPool.data[0]?.bl_fi_my_einvoice_batch_pool_doc_hdr?.updated_date).format('DD MMMM YYYY, HH:mm')

          clearInterval(this.interval)
        } 
        else if (response.internalSubmissionQueue.data.length) {
          this.inInternalSubmissionQueue = true;
          this.postingQueueMessage = this.defaultMessage;
          this.postingQueueIcon = this.defaultIcon;

          this.batchPoolMessage = "Required fields fullfiled";
          this.batchPoolIcon = this.defaultIcon;

          this.internalSubmissionHistoryMessage = "Pending";
          this.internalSubmissionHistoryIcon = "hourglass_top";

          if(response.internalSubmissionQueue.data[0]?.bl_fi_my_einvoice_gen_doc_to_irb_submission_queue.submission_status === "NOT_SUBMITTED"){
            this.internalSubmissionQueueMessage = "Waiting to submit";
            this.internalSubmissionQueueIcon = "hourglass_top";
          } 
          else {
            const submissionStatus = JSON.parse((<any>response).internalSubmissionQueue.data[0]?.bl_fi_my_einvoice_gen_doc_to_irb_submission_queue?.request_response)
            console.log("submissionStatus",submissionStatus)
            this.internalSubmissionQueueMessage = submissionStatus ? submissionStatus?.rejectedDocuments[0]?.error?.details[0]?.message : "Document Rejected";
            this.internalSubmissionQueueIcon = "close";
            clearInterval(this.interval)
          }
          this.allDate = moment(response.internalSubmissionQueue.data[0]?.bl_fi_my_einvoice_gen_doc_to_irb_submission_queue?.updated_date).format('DD MMMM YYYY, HH:mm')

        } 
        else if (response.submissionHistory.data.length) {
          this.inSubmissionHistory = true;

          this.postingQueueMessage = this.defaultMessage;
          this.postingQueueIcon = this.defaultIcon;

          this.batchPoolMessage = "Required fields fullfiled";
          this.batchPoolIcon = this.defaultIcon;

          this.internalSubmissionQueueMessage = this.defaultMessage;
          this.internalSubmissionQueueIcon = this.defaultIcon;

          this.internalSubmissionHistoryMessage = "Document Accepted";
          this.internalSubmissionHistoryIcon = this.defaultIcon;

          this.allDate = moment(response.submissionHistory.data[0]?.bl_fi_my_einvoice_gen_doc_to_irb_submission_history?.updated_date).format('DD MMMM YYYY, HH:mm')

          clearInterval(this.interval)
        }

        this.changeDetectorRef.detectChanges()

      })
    ).subscribe();
  }

  removeFields(input: any) {
    const patterns = [
        /Hdr Missing fields\nDocument no: \d+\nDocument type: [^\n]+\n/,
        /-+\n/
    ];
    patterns.forEach(pattern => {
        input = input.replace(pattern, '');
    });

    return input;
}
  

  ngOnDestroy() {
    this.subs.unsubscribe();
    clearInterval(this.interval)
  }
}
