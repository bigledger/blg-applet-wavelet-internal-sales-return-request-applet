import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  ARAPService, bl_fi_generic_doc_hdr_RowClass,
  BranchService,
  GenericDocARAPContainerModel, GenericDocHdrService, Pagination,
  DocumentShortCodesClass,
} from 'blg-akaun-ts-lib';
import moment from 'moment';
import { AppConfig } from 'projects/shared-utilities/visa';
import { Observable, forkJoin, iif, of, Subject, combineLatest } from 'rxjs';
import { SubSink } from 'subsink2';
import { salesReturnSearchModel } from '../../../../models/advanced-search-models/internal-sales-return.model';
import { InternalSalesReturnSelectors } from '../../../../state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnStates } from '../../../../state-controllers/internal-sales-return-controller/store/states';
import { InternalSalesReturnActions } from '../../../../state-controllers/internal-sales-return-controller/store/actions';
import { catchError, exhaustMap, map, mergeMap, debounceTime, filter, switchMap } from 'rxjs/operators';
import { DraftStates } from '../../../../state-controllers/draft-controller/store/states'
import { ContraSelectors } from '../../../../state-controllers/draft-controller/store/selectors';
import {UtilitiesModule} from "../../../../../../../../../shared-utilities/utilities/utilities.module";

export class ContraExtendedView {
  guid;
  docHdrGuid;
  server_doc_type_doc_2;
  bl_fi_generic_doc_hdr_server_doc_1;
  amount_contra;
  date_txn;
  doc_reference;
  xtn_doc_ref_4;
  tracking_id;
  doc_remarks;
  doc_desc;
  client_doc_1;
  client_doc_2;
  client_doc_3;
  client_doc_4;
  client_doc_5;
  date_doc_2;
}

@Component({
  selector: 'app-internal-sales-return-contra-listing',
  templateUrl: './contra-listing.component.html',
  styleUrls: ['./contra-listing.component.scss']
})
export class ContraListingComponent implements OnInit, OnDestroy {

  @Input() localState: any;
  @Input() draft$: Observable<bl_fi_generic_doc_hdr_RowClass>;

  @Output() selectDocument = new EventEmitter();
  @Output() contraEdit = new EventEmitter<GenericDocARAPContainerModel>();
  genDocLock$ = this.store.select(InternalSalesReturnSelectors.selectGenDocLock);

  private subs = new SubSink();

  searchModel = salesReturnSearchModel;
  hdr;
  guid;
  public form: FormGroup;
  gridApi;
  rowData = [];
  postingStatus;
  status;
  SQLGuids: string[] = null;
  pagination = new Pagination();
  errorMessage: boolean = true;
  totalContra = 0;
  selectedTotalRevenue;
  selectedTotalExpense;
  selectedTotalSettlement;
  selectedTotalContra;
  docOpenAmount = 0.00;
  docArapBalance = 0.00;
  refreshArapListing;
  genDocLock:boolean;

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true
  };

  updateContraAgGrid$ = this.store.select(InternalSalesReturnSelectors.selectRefreshArapValue);

  columnsDefs = [
    { headerName: 'Doc Short Code', field: 'server_doc_type_doc_2', cellStyle: () => ({ 'text-align': 'left' }), valueFormatter: (params) => params.value ? DocumentShortCodesClass.serverDocTypeToShortCodeMapper(params.value) : "" },
    { headerName: 'Doc No', field: 'bl_fi_generic_doc_hdr_server_doc_1', minWidth: 100, cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Amount Contra', field: 'amount_contra', type: 'numericColumn',  valueFormatter: (params) => parseFloat(params.value).toFixed(2), },
    {
      headerName: 'Date', field: 'date_txn',
      valueFormatter: params => moment(params.value).format('YYYY-MM-DD')
    },
    { headerName: 'Invoice No', field: 'xtn_doc_ref_4', minWidth: 100, cellStyle: () => ({'text-align': 'left'})},
    { headerName: 'Reference No', field: 'doc_reference', minWidth: 100, cellStyle: () => ({'text-align': 'left'})},
    { headerName: 'Remarks', field: 'doc_remarks', cellStyle: () => ({'text-align': 'left'})},
    // { headerName: 'Branch', field: 'branchName', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Tracking No', field: 'tracking_id', minWidth: 100, cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Remarks', field: 'doc_remarks', minWidth: 100, cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Description', field: 'doc_desc', minWidth: 100, cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Client Doc 1', field: 'client_doc_1', minWidth: 100, cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Client Doc 2', field: 'client_doc_2', minWidth: 100, cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Client Doc 3', field: 'client_doc_3', minWidth: 100, cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Client Doc 4', field: 'client_doc_4', minWidth: 100, cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Client Doc 5', field: 'client_doc_5', minWidth: 100, cellStyle: () => ({ 'text-align': 'left' }) },
  ];

  constructor(
    private arapService: ARAPService,
    private genDocHdrService: GenericDocHdrService,
    private brnchService: BranchService,
    protected readonly store: Store<InternalSalesReturnStates>,
    private draftStore: Store<DraftStates>,
    ) {
  }

  ngOnInit() {
    this.subs.sink = this.genDocLock$.subscribe(lock=>{
      this.genDocLock = lock;
    })

    this.getContraList();
    this.subs.sink = combineLatest([
      this.store.select(InternalSalesReturnSelectors.selectedDocOpenAmount),
      this.store.select(InternalSalesReturnSelectors.selectedDocArapBalance),
      this.store.select(InternalSalesReturnSelectors.selectedTotalContra),
      this.draft$,
    ]).pipe(
    ).subscribe({next: async (
        [
          docOpenAmount,docArapBalance, totalContra, hdr
        ]:any) => {
        this.docOpenAmount = docOpenAmount;
        this.docArapBalance = docArapBalance;
        this.totalContra = totalContra;
        this.hdr = hdr;
        this.status = hdr.status;
        this.guid = hdr?.guid;
        this.postingStatus = hdr?.posting_status;
      }});

  }

  getContraList() {
    this.subs.sink = this.draftStore.select(ContraSelectors.selectAll).pipe(
      filter(con => {
        const docGuids = con.map(c => c.guid_doc_2_hdr);
        if (docGuids.length === 0) {
          this.clear()
        }
        return docGuids.length > 0;
      }),
      switchMap(con => {
        const docGuids = con.map(c => c.guid_doc_2_hdr);
        const joinedDocGuids = docGuids.join(',')
        const paging = new Pagination(0, 100, [
          { columnName: 'guids', operator: '=', value: joinedDocGuids },
        ]);
        return this.genDocHdrService.getByCriteria(paging, AppConfig.apiVisa).pipe(
          map(genDoc2 => {
            return {contra: con, genDoc: genDoc2.data};
          })
        )
      })
    ).subscribe(resp => {
      this.getContraView(resp.contra, resp.genDoc)
    })
  }

  getContraView(contra, genDoc) {
    const contraList: any = [];
    contra.forEach(c => {
      const contraExtendedView = new ContraExtendedView();
      contraExtendedView.guid = c.guid;
      contraExtendedView.docHdrGuid = c.guid_doc_1_hdr;
      contraExtendedView.server_doc_type_doc_2 = c?.server_doc_type_doc_2;
      contraExtendedView.bl_fi_generic_doc_hdr_server_doc_1 = c?.bl_fi_generic_doc_hdr_server_doc_1;
      contraExtendedView.amount_contra = c?.amount_contra;
      contraExtendedView.date_txn = c?.date_txn;
      contraExtendedView.date_doc_2 = c?.date_doc_2;
      contraExtendedView.doc_reference = genDoc.find(g => g.bl_fi_generic_doc_hdr.guid === c.guid_doc_2_hdr)?.bl_fi_generic_doc_hdr.doc_reference;
      contraExtendedView.xtn_doc_ref_4 = genDoc.find(g => g.bl_fi_generic_doc_hdr.guid === c.guid_doc_2_hdr)?.bl_fi_generic_doc_hdr.xtn_doc_ref_4;
      contraExtendedView.tracking_id = genDoc.find(g => g.bl_fi_generic_doc_hdr.guid === c.guid_doc_2_hdr)?.bl_fi_generic_doc_hdr.tracking_id;
      contraExtendedView.doc_remarks = genDoc.find(g => g.bl_fi_generic_doc_hdr.guid === c.guid_doc_2_hdr)?.bl_fi_generic_doc_hdr.doc_remarks;
      contraExtendedView.doc_desc = genDoc.find(g => g.bl_fi_generic_doc_hdr.guid === c.guid_doc_2_hdr)?.bl_fi_generic_doc_hdr.doc_desc;
      contraExtendedView.client_doc_1 = genDoc.find(g => g.bl_fi_generic_doc_hdr.guid === c.guid_doc_2_hdr)?.bl_fi_generic_doc_hdr.client_doc_1;
      contraExtendedView.client_doc_2 = genDoc.find(g => g.bl_fi_generic_doc_hdr.guid === c.guid_doc_2_hdr)?.bl_fi_generic_doc_hdr.client_doc_2;
      contraExtendedView.client_doc_3 = genDoc.find(g => g.bl_fi_generic_doc_hdr.guid === c.guid_doc_2_hdr)?.bl_fi_generic_doc_hdr.client_doc_3;
      contraExtendedView.client_doc_4 = genDoc.find(g => g.bl_fi_generic_doc_hdr.guid === c.guid_doc_2_hdr)?.bl_fi_generic_doc_hdr.client_doc_4;
      contraExtendedView.client_doc_5 = genDoc.find(g => g.bl_fi_generic_doc_hdr.guid === c.guid_doc_2_hdr)?.bl_fi_generic_doc_hdr.client_doc_5;

      contraList.push(contraExtendedView);
    });
    this.rowData = contraList;
    this.gridApi.setRowData(this.rowData);
  }

  clear() {
    this.rowData = [];
    if (this.gridApi) {
      this.gridApi.setRowData([]); // Use an empty array instead of null
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();

    this.subs.sink = this.updateContraAgGrid$.subscribe(a => {
      if(a) {
        this.clear();
        this.getContraList();
        this.store.dispatch(InternalSalesReturnActions.refreshArapListing({ refreshArapListing: false }));
      }
    });

  }

  onAdd() {
    this.selectDocument.emit();
  }

  posting() {
    if (this.status === "TEMP") {
      return true;
    }
    else if (this.genDocLock){
      return false;
    }
    // else if (this.hdr?.forex_doc_hdr_guid) {
    //   return false;
    // }
    return !((this.postingStatus === "VOID" || this.postingStatus === "DISCARDED") || (this.status !== 'ACTIVE' && this.status !== null));
  }

  onRowClicked(contra: GenericDocARAPContainerModel) {
    this.store.dispatch(InternalSalesReturnActions.refreshArapListing({ refreshArapListing: false }));
    let entity = contra['bl_fi_generic_doc_hdr'];
    this.store.dispatch(InternalSalesReturnActions.selectContraDoc({ entity }));
    this.contraEdit.emit(contra);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  isForex(){
    return (this.hdr?.base_doc_ccy && this.hdr?.base_doc_ccy !== this.hdr?.doc_ccy);
  }

  getForex(amt) {
    if (this.isForex()) {
      if (this.hdr?.base_doc_xrate && this.hdr?.base_doc_xrate !== 0) {
        amt = parseFloat(amt) / this.hdr?.base_doc_xrate;
      }
      else {
        amt = 0;
      }
      return '(' + this.hdr?.base_doc_ccy + ' ' + UtilitiesModule.currencyFormatter(amt) + ')';
    }
    return '';
  }

  getTotal() {
    return UtilitiesModule.currencyFormatter(this.totalContra);
  }

  getOpenAmount() {
    return UtilitiesModule.currencyFormatter(this.docOpenAmount);
  }

  getARAP() {
    return UtilitiesModule.currencyFormatter(this.docArapBalance);
  }

}
