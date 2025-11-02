import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  ChangeDetectorRef
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { AppConfig } from "projects/shared-utilities/visa";
import { Subject, forkJoin, of, Observable, ReplaySubject } from "rxjs";
import { SubSink } from "subsink2";
import moment from "moment";
import { TenantUserProfileService,MyEInvoiceToIRBHdrLinesService, Pagination, CountryService, PagingResponseModel, MyEInvoiceGenDocToIRBSubmissionHistoryService } from "blg-akaun-ts-lib";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { InternalSalesReturnStates } from '../../../../../state-controllers/internal-sales-return-controller/store/states';
import { InternalSalesReturnSelectors } from '../../../../../state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnActions } from '../../../../../state-controllers/internal-sales-return-controller/store/actions';
import { SubmissionTypes } from '../../../../../models/einvoice.model';
import { DraftStates } from '../../../../../state-controllers/draft-controller/store/states';
import { HDRSelectors, LinkSelectors, PNSSelectors } from '../../../../../state-controllers/draft-controller/store/selectors';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ViewColumnFacade } from '../../../../../facades/view-column.facade';
import { IDTypeOptions } from "projects/shared-utilities/models/constants.model";

interface LocalState {
  deactivateReturn: boolean;
  deactivateAdd: boolean;
  deactivateList: boolean;
  selectedIndex: number;
  accountSelectedIndex: number;
  selectedLine: any;
  deleteConfirmation: boolean;
  deliveryDetailSelectedIndex: number;
  expandedPanel: number;
  initialExpansion: boolean;
}
@Component({
  selector: "app-submission",
  templateUrl: "./submission.component.html",
  styleUrls: ["./submission.component.scss"],
})
export class SubmissionComponent implements OnInit, OnDestroy {

  @Input() isInExpansionPanel: boolean = false;

  protected subs = new SubSink();
  apiVisa = AppConfig.apiVisa;
  public form: FormGroup;
  protected _onDestroy = new Subject<void>();
  isCustomer;
  hide: boolean = true;
  qrCodeImage$: Observable<{ qrCode: string }>;
  hdr_guid;
  isDisabled = true;
  submissionTypes = SubmissionTypes;
  selectedInternalSalesReturn;
  isPostingStatusFinal = false;
  protected localState: LocalState;
  // Country
  countryOptions: any[] = [];
  filteredCountryOptions: ReplaySubject<any[]> = new ReplaySubject<[]>(1);
  countryOptionsFilterCtrl: FormControl = new FormControl();
  // States
  states = [];
  disableIndividual = true;
  disableSingleGeneral = true;
  buyerIdType = IDTypeOptions.values;
  disableConsolidatedSubmission = false;
  disableSingleGeneralSubmission = false;

  constructor(
    // private readonly store: Store<TicketStates>,
    private myEInvoiceToIRBHdrLinesService: MyEInvoiceToIRBHdrLinesService,
    private myEInvoiceGenDocToIRBSubmissionHistoryService: MyEInvoiceGenDocToIRBSubmissionHistoryService,
    protected readonly store: Store<InternalSalesReturnStates>,
    protected readonly draftStore: Store<DraftStates>,
    private cdr: ChangeDetectorRef,
    private countryService: CountryService,
    private viewColFacade: ViewColumnFacade,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      submissionType: new FormControl(),
      documentNo: new FormControl(""),
      documentType: new FormControl(""),
      documentDate: new FormControl(""),
      buyerName: new FormControl(""),
      buyerEntityId: new FormControl(""),
      buyerIdNo: new FormControl(""),
      buyerTaxId: new FormControl(""),
      buyerSalesServiceTaxId: new FormControl(""),
      buyerEmail: new FormControl(""),
      buyerContactNo: new FormControl(""),
      buyerAddressName: new FormControl(""),
      buyerAddressLine1: new FormControl(""),
      buyerAddressLine2: new FormControl(""),
      buyerAddressLine3: new FormControl(""),
      buyerAddressLine4: new FormControl(""),
      buyerAddressLine5: new FormControl(""),
      buyerCountry: new FormControl(""),
      buyerState: new FormControl(""),
      buyerStateCode: new FormControl(""),
      buyerCity: new FormControl(""),
      buyerPostcode: new FormControl(""),
      validationUrl: new FormControl(""),
      buyerIdType: new FormControl(""),
      einvoiceEntityHdrGuid: new FormControl(""),
      originalEinvoiceRefNo: new FormControl(""),
      originalEinvoiceRefUUID: new FormControl(""),
    });
    
    this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectCurrentCompanyDetails).subscribe(comp => {
      console.log("current Comp details", comp)
      if(comp){
        this.disableConsolidatedSubmission = comp.disable_consolidated_submission
        this.disableSingleGeneralSubmission = comp.disable_single_general_submission
      }
    })

    this.patchDetails();

    this.countryOptionsFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterCountryOptions();
    });

    this.getCountries();
  }

  patchDetails() {
    console.log("patche details");
    this.subs.sink = this.draftStore.select(HDRSelectors.selectHdr)
      .subscribe(( selectedInternalSalesReturn ) => {
        if(selectedInternalSalesReturn.doc_entity_hdr_guid && (<any>selectedInternalSalesReturn.billing_json)?.billingAddress){
          this.disableIndividual = false;
          this.disableSingleGeneral = false;
          this.selectedInternalSalesReturn = selectedInternalSalesReturn;
        }
        this.form.patchValue({
          documentNo: selectedInternalSalesReturn.server_doc_1,
          documentDate: selectedInternalSalesReturn.date_txn,
          documentType: selectedInternalSalesReturn.server_doc_type,
          submissionType: selectedInternalSalesReturn.einvoice_submission_type,
          buyerName: "",
          buyerEntityId: "",
          buyerIdNo: "",
          buyerTaxId: "",
          buyerSalesServiceTaxId: "",
          buyerEmail: "",
          buyerContactNo: "",
          buyerAddressName: "",
          buyerAddressLine1: "",
          buyerAddressLine2: "",
          buyerAddressLine3: "",
          buyerAddressLine4: "",
          buyerAddressLine5: "",
          buyerCountry: "",
          buyerState: "",
          buyerStateCode: "",
          buyerCity: "",
          buyerPostcode: "",
          buyerIdType: "",
        })
        this.form.patchValue({
          documentNo: selectedInternalSalesReturn.server_doc_1,
          documentDate: selectedInternalSalesReturn.date_txn,
          documentType: selectedInternalSalesReturn.server_doc_type,
          submissionType: selectedInternalSalesReturn.einvoice_submission_type,
          buyerName:(<any>selectedInternalSalesReturn.einvoice_buyer_entity_hdr_json)?.entityName ?? (<any>selectedInternalSalesReturn.doc_entity_hdr_json)?.entityName,
          buyerEntityId:(<any>selectedInternalSalesReturn.einvoice_buyer_entity_hdr_json)?.entityId ?? (<any>selectedInternalSalesReturn.doc_entity_hdr_json)?.entityId,
          buyerIdNo: (<any>selectedInternalSalesReturn.einvoice_buyer_entity_hdr_json)?.idNumber ?? (<any>selectedInternalSalesReturn.doc_entity_hdr_json)?.idNumber,
          buyerTaxId: (<any>selectedInternalSalesReturn.einvoice_buyer_entity_hdr_json)?.einvoiceTaxIdNo ?? (<any>selectedInternalSalesReturn.doc_entity_hdr_json)?.einvoiceTaxIdNo,
          buyerIdType: (<any>selectedInternalSalesReturn.einvoice_buyer_entity_hdr_json)?.buyerIdType ?? (<any>selectedInternalSalesReturn.doc_entity_hdr_json)?.identityType,
          buyerSalesServiceTaxId: (<any>selectedInternalSalesReturn.einvoice_buyer_entity_hdr_json)?.buyerSalesServiceTaxId ,
          buyerEmail: (<any>selectedInternalSalesReturn.einvoice_buyer_entity_hdr_json)?.email ?? (<any>selectedInternalSalesReturn.doc_entity_hdr_json)?.email,
          buyerContactNo: (<any>selectedInternalSalesReturn.einvoice_buyer_entity_hdr_json)?.phoneNumber ?? (<any>selectedInternalSalesReturn.doc_entity_hdr_json)?.phoneNumber,
          buyerAddressName: (<any>selectedInternalSalesReturn.einvoice_buyer_entity_hdr_json)?.einvoiceAddress?.buyerAddressName ?? (<any>selectedInternalSalesReturn.billing_json).billingAddress?.name,
          buyerAddressLine1: (<any>selectedInternalSalesReturn.einvoice_buyer_entity_hdr_json)?.einvoiceAddress?.buyerAddressLine1 ?? (<any>selectedInternalSalesReturn.billing_json).billingAddress?.address_line_1,
          buyerAddressLine2: (<any>selectedInternalSalesReturn.einvoice_buyer_entity_hdr_json)?.einvoiceAddress?.buyerAddressLine2 ?? (<any>selectedInternalSalesReturn.billing_json).billingAddress?.address_line_2,
          buyerAddressLine3: (<any>selectedInternalSalesReturn.einvoice_buyer_entity_hdr_json)?.einvoiceAddress?.buyerAddressLine3 ?? (<any>selectedInternalSalesReturn.billing_json).billingAddress?.address_line_3,
          buyerAddressLine4: (<any>selectedInternalSalesReturn.einvoice_buyer_entity_hdr_json)?.einvoiceAddress?.buyerAddressLine4 ?? (<any>selectedInternalSalesReturn.billing_json).billingAddress?.address_line_4,
          buyerAddressLine5: (<any>selectedInternalSalesReturn.einvoice_buyer_entity_hdr_json)?.einvoiceAddress?.buyerAddressLine5 ?? (<any>selectedInternalSalesReturn.billing_json).billingAddress?.address_line_5,
          buyerCountry: (<any>selectedInternalSalesReturn.einvoice_buyer_entity_hdr_json)?.einvoiceAddress?.buyerCountry ?? (<any>selectedInternalSalesReturn.billing_json).billingAddress?.country,
          buyerState: (<any>selectedInternalSalesReturn.einvoice_buyer_entity_hdr_json)?.einvoiceAddress?.buyerState ?? (<any>selectedInternalSalesReturn.billing_json).billingAddress?.state,
          buyerStateCode: (<any>selectedInternalSalesReturn.einvoice_buyer_entity_hdr_json)?.einvoiceAddress?.buyerStateCode ?? (<any>selectedInternalSalesReturn.billing_json).billingAddress?.stateCode,
          buyerCity: (<any>selectedInternalSalesReturn.einvoice_buyer_entity_hdr_json)?.einvoiceAddress?.buyerCity ?? (<any>selectedInternalSalesReturn.billing_json).billingAddress?.city,
          buyerPostcode: (<any>selectedInternalSalesReturn.einvoice_buyer_entity_hdr_json)?.einvoiceAddress?.buyerPostcode ?? (<any>selectedInternalSalesReturn.billing_json).billingAddress?.postal_code,
          originalEinvoiceRefNo: selectedInternalSalesReturn?.original_einvoice_ref_no, // running_no
          originalEinvoiceRefUUID: selectedInternalSalesReturn?.einvoice_main_document_ref_to_irb_lhdn_document_guid, // to_irb.lhdn_document_guid
        });
        this.patchStates(this.form.value?.buyerCountry)

        if(selectedInternalSalesReturn.posting_status === "FINAL"){
          this.isPostingStatusFinal = true;
          this.form.disable();
          this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectEInvoiceEnabled).subscribe(data => {
            console.log("einvoiceabe",data);
            if(data){
              this.getDataFromToIRB(selectedInternalSalesReturn.guid)
            }
          })
        }
        console.log("main concern",this.form.value)
      });


  }

  getDataFromToIRB(genericDocGuid) {
    let pagination = new Pagination()
    pagination.conditionalCriteria = [
      { columnName: "generic_doc_hdr_guids",  operator: "=" ,value: genericDocGuid },
    ]
    this.subs.sink = this.myEInvoiceGenDocToIRBSubmissionHistoryService.getByCriteria(pagination,AppConfig.apiVisa).subscribe(data => {
      console.log("toIrb",data)
      if(data.data.length){
        this.isDisabled = false;
        this.form.patchValue({
          validationUrl: data.data[0].bl_fi_my_einvoice_gen_doc_to_irb_submission_history?.validation_url
        })
        this.getDigitalSignature(data.data[0].bl_fi_my_einvoice_gen_doc_to_irb_submission_history?.qr_code);
        this.hdr_guid = data.data[0].bl_fi_my_einvoice_gen_doc_to_irb_submission_history?.to_irb_hdr_guid.toString();
      }
    })
  }

  getDigitalSignature(digitalSignature) {


    this.qrCodeImage$ = new Observable((observer) => {
      const imgStr =
        "data:image/png;base64," + digitalSignature;
      observer.next({ qrCode: imgStr });
    });
  }

  onExport() {
      this.store.dispatch(InternalSalesReturnActions.printEInvoiceJasperPdfInit({ hdr: this.hdr_guid }));
  }

  dispatchValueChanges(){
    this.store.dispatch(InternalSalesReturnActions.updateEInvoiceDetails({ form: this.form.value }));
  }

  dispatchSingleGeneralChanges(){
    this.store.dispatch(InternalSalesReturnActions.updateEInvoiceDetails({ form: this.form.value }));
    this.store.dispatch(InternalSalesReturnActions.updateSingleGeneralDetails({ form: this.form.value }));
  }

  onSubmissionTypeChange(event){
    console.log("submission type",event.value);

    if(event.value === "CONSOLIDATED"){
      this.form.patchValue({
        buyerName: "General Public",
        buyerEntityId: "General Public",
        buyerIdNo: "NA",
        buyerTaxId: "EI00000000010",
        buyerIdType: "",
        buyerSalesServiceTaxId: "NA",
        buyerEmail: "NA",
        buyerContactNo: "NA",
        buyerAddressName: "NA",
        buyerAddressLine1: "NA",
        buyerAddressLine2: "NA",
        buyerAddressLine3: "NA",
        buyerAddressLine4: "NA",
        buyerAddressLine5: "NA",
        buyerCountry: "NA",
        buyerState: "NA",
        buyerStateCode: "NA",
        buyerCity: "NA",
        buyerPostcode: "NA",
      })
      this.dispatchValueChanges()

    }

    if(event.value === "INDIVIDUAL"){
      this.form.patchValue({
        submissionType: "INDIVIDUAL",
        buyerName: (<any>this.selectedInternalSalesReturn?.doc_entity_hdr_json)?.entityName,
        buyerEntityId: (<any>this.selectedInternalSalesReturn?.doc_entity_hdr_json)?.entityId,
        buyerIdNo: (<any>this.selectedInternalSalesReturn?.doc_entity_hdr_json)?.idNumber,
        buyerTaxId: (<any>this.selectedInternalSalesReturn?.doc_entity_hdr_json)?.einvoiceTaxIdNo,
        buyerIdType: (<any>this.selectedInternalSalesReturn?.doc_entity_hdr_json)?.identityType,
        buyerEmail: (<any>this.selectedInternalSalesReturn?.doc_entity_hdr_json)?.email,
        buyerContactNo: (<any>this.selectedInternalSalesReturn?.doc_entity_hdr_json)?.phoneNumber,
        buyerAddressName: (<any>this.selectedInternalSalesReturn?.billing_json).billingAddress?.name,
        buyerAddressLine1: (<any>this.selectedInternalSalesReturn?.billing_json).billingAddress?.address_line_1,
        buyerAddressLine2: (<any>this.selectedInternalSalesReturn?.billing_json).billingAddress?.address_line_2,
        buyerAddressLine3: (<any>this.selectedInternalSalesReturn?.billing_json).billingAddress?.address_line_3,
        buyerAddressLine4: (<any>this.selectedInternalSalesReturn?.billing_json).billingAddress?.address_line_4,
        buyerAddressLine5: (<any>this.selectedInternalSalesReturn?.billing_json).billingAddress?.address_line_5,
        buyerCountry: (<any>this.selectedInternalSalesReturn?.billing_json).billingAddress?.country,
        buyerState: (<any>this.selectedInternalSalesReturn?.billing_json).billingAddress?.state,
        buyerStateCode: (<any>this.selectedInternalSalesReturn?.billing_json).billingAddress?.stateCode,
        buyerCity: (<any>this.selectedInternalSalesReturn?.billing_json).billingAddress?.city,
        buyerPostcode: (<any>this.selectedInternalSalesReturn?.billing_json).billingAddress?.postal_code,
        originalEinvoiceRefNo: this.selectedInternalSalesReturn?.original_einvoice_ref_no, // running_no
        originalEinvoiceRefUUID: this.selectedInternalSalesReturn?.einvoice_main_document_ref_to_irb_lhdn_document_guid, // to_irb.lhdn_document_guid
      })

      this.patchStates(this.form.value?.buyerCountry)
      this.dispatchValueChanges()
    }

    if(event.value === "SINGLE-GENERAL"){
      this.form.patchValue({
        submissionType: "SINGLE-GENERAL",
        buyerName: (<any>this.selectedInternalSalesReturn?.doc_entity_hdr_json)?.entityName,
        buyerEntityId: (<any>this.selectedInternalSalesReturn?.doc_entity_hdr_json)?.entityId,
        buyerIdNo: (<any>this.selectedInternalSalesReturn?.doc_entity_hdr_json)?.idNumber,
        buyerTaxId: (<any>this.selectedInternalSalesReturn?.doc_entity_hdr_json)?.einvoiceTaxIdNo,
        buyerIdType: (<any>this.selectedInternalSalesReturn?.doc_entity_hdr_json)?.identityType,
        buyerEmail: (<any>this.selectedInternalSalesReturn?.doc_entity_hdr_json)?.email,
        buyerContactNo: (<any>this.selectedInternalSalesReturn?.doc_entity_hdr_json)?.phoneNumber,
        buyerAddressName: (<any>this.selectedInternalSalesReturn?.billing_json).billingAddress?.name,
        buyerAddressLine1: (<any>this.selectedInternalSalesReturn?.billing_json).billingAddress?.address_line_1,
        buyerAddressLine2: (<any>this.selectedInternalSalesReturn?.billing_json).billingAddress?.address_line_2,
        buyerAddressLine3: (<any>this.selectedInternalSalesReturn?.billing_json).billingAddress?.address_line_3,
        buyerAddressLine4: (<any>this.selectedInternalSalesReturn?.billing_json).billingAddress?.address_line_4,
        buyerAddressLine5: (<any>this.selectedInternalSalesReturn?.billing_json).billingAddress?.address_line_5,
        buyerCountry: (<any>this.selectedInternalSalesReturn?.billing_json).billingAddress?.country,
        buyerState: (<any>this.selectedInternalSalesReturn?.billing_json).billingAddress?.state,
        buyerStateCode: (<any>this.selectedInternalSalesReturn?.billing_json).billingAddress?.stateCode,
        buyerCity: (<any>this.selectedInternalSalesReturn?.billing_json).billingAddress?.city,
        buyerPostcode: (<any>this.selectedInternalSalesReturn?.billing_json).billingAddress?.postal_code,
        skipEInvoice: this.selectedInternalSalesReturn.skip_einvoice,
        einvoiceEntityHdrGuid: this.selectedInternalSalesReturn?.doc_entity_hdr_guid.toString(),
        originalEinvoiceRefNo: this.selectedInternalSalesReturn?.original_einvoice_ref_no, // running_no
        originalEinvoiceRefUUID: this.selectedInternalSalesReturn?.einvoice_main_document_ref_to_irb_lhdn_document_guid, // to_irb.lhdn_document_guid
      })
      this.patchStates(this.form.value?.buyerCountry)
      this.dispatchSingleGeneralChanges()
    }

  }

  protected filterCountryOptions() {
    if (!this.countryOptions) {
      return;
    }
    let search = this.countryOptionsFilterCtrl.value;
    if (!search) {
      this.filteredCountryOptions.next(this.countryOptions.slice());
      return;
    } else {
      search = search.trim().toLowerCase();
      this.filteredCountryOptions.next(
        this.countryOptions.filter(
          (option) => option.viewValue.toLowerCase().indexOf(search) > -1
        )
      );
    }
  }

  async getCountries(): Promise<void> {
    this.countryOptions = [];
    let paging = new Pagination();
    paging.limit = 231;
    await this.countryService
      .getByCriteriaPromise(paging, this.apiVisa)
      .then((resp: PagingResponseModel<any>) => {
        resp.data.forEach((eachMember, index) => {
            this.countryOptions.push({
              value: eachMember.bl_fi_country_hdr.alpha3_code,
              viewValue: eachMember.bl_fi_country_hdr.country_name,
              states: eachMember.bl_fi_country_hdr.states_json
            });
        });
      });
    this.countryOptions.sort((a, b) => a.viewValue.localeCompare(b.viewValue));
    this.filteredCountryOptions.next(this.countryOptions.slice());

    this.form.patchValue({
      buyerCountry : this.form.value.buyerCountry
    })
    this.patchStates(this.form.value.buyerCountry)

  }

  patchStates(e){
    console.log("this.einvoice.form",this.form.value);
    const selectedCountry = this.countryOptions.filter(data => {
      return data.viewValue == e;
    })
    console.log("selected country",selectedCountry)

    this.states = selectedCountry[0]?.states?.states

  }

  onStateSelection(event){
    const selectedState = this.states.find(state => state.name === event);
    this.form.patchValue({
      buyerStateCode: selectedState?.code
    })
  }

  selectFromAnotherCustomer(){
    this.store.dispatch(InternalSalesReturnActions.setIsEinvoiceSubmissionAnotherCustomer({isEinvoiceSubmissionAnotherCustomer: true}))
    this.viewColFacade.updateInstance(2, {
      ...this.localState,
      deactivateReturn: true,
      deactivateAdd: true,
      deactivateList: true
    });
    this.viewColFacade.onNextAndReset(2, 4);
  }

    goToEinvoiceMainDocRefNo() {
      // final state disable
      console.log(this.isPostingStatusFinal);
      if (this.isPostingStatusFinal) return;

      this.viewColFacade.updateInstance(2, {
        ...this.localState,
        deactivateReturn: true,
        deactivateAdd: true,
        deactivateList: true
      });
      this.viewColFacade.onNextAndReset(2, 45);
    }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
