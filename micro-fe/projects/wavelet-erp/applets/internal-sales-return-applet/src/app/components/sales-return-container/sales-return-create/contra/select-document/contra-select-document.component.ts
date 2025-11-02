import { formatNumber } from '@angular/common';
import {ChangeDetectionStrategy, Component, ViewChild} from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import {
  bl_fi_generic_doc_arap_contra_RowClass,
  bl_fi_generic_doc_hdr_RowClass,
  BranchService,
  DocumentShortCodesClass,
  GenericDocAllService,
  GenericDocContainerModel,
  Pagination
} from 'blg-akaun-ts-lib';
import * as moment from 'moment';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import {from, Subject} from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../../facades/view-column.facade';
import { SearchQueryModel } from '../../../../../models/query.model';
import { HDRSelectors, ContraSelectors } from '../../../../../state-controllers/draft-controller/store/selectors';
import { DraftStates } from '../../../../../state-controllers/draft-controller/store/states';
import { InternalSalesReturnActions } from '../../../../../state-controllers/internal-sales-return-controller/store/actions';
import { InternalSalesReturnStates } from '../../../../../state-controllers/internal-sales-return-controller/store/states';
import { InternalSalesReturnSelectors } from '../../../../../state-controllers/internal-sales-return-controller/store/selectors';
import { pageFiltering, pageSorting } from 'projects/shared-utilities/listing.utils';
import { InputTextCellRendererComponent } from 'projects/shared-utilities/utilities/input-text-cell-renderer/input-text-cell-renderer.component';
import {UtilitiesModule} from "../../../../../../../../../../shared-utilities/utilities/utilities.module";
import {
  PaginationV2Component
} from "../../../../../../../../../../shared-utilities/utilities/pagination-v2/pagination-v2.component";
import {ValueService} from "../../../../../../../../../../shared-utilities/services/value-service";
import {UUID} from "angular2-uuid";
import {ToastrService} from "ngx-toastr";
import {DateCellRendererComponentV2} from "../../../../utilities/date-cell-renderer-v2/date-cell-renderer-v2.component";
import {ContraV2SearchModel} from "../../../../../models/advanced-search-models/contra-v2.model";
import {GridOptions} from "ag-grid-enterprise";
import {
  SessionSelectors
} from "../../../../../../../../../../shared-utilities/modules/session/session-controller/selectors";
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import {FormControl, FormGroup} from "@angular/forms";

interface LocalState {
  deactivateReturn: boolean;
  deactivateList: boolean;
}

@Component({
  selector: 'app-contra-select-document',
  templateUrl: './contra-select-document.component.html',
  styleUrls: ['./contra-select-document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class ContraSelectDocumentComponent extends ViewColumnComponent {

  private subs = new SubSink();
  apiVisa = AppConfig.apiVisa;

  protected compName = 'Contra Select Document'
  protected readonly index = 14;
  protected localState: LocalState;
  protected prevLocalState: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => (state.deactivateReturn));
  readonly deactivateList$ = this.componentStore.select(state => state.deactivateList);

  hdr: bl_fi_generic_doc_hdr_RowClass;
  searchModel = ContraV2SearchModel;
  prevIndex: number;
  SQLGuids: string[] = null;
  entityHdrGuid;
  compGuid;
  docArapBalance;
  docOpenAmount = 0;
  newDocArapBalance = 0;
  contraAmountToBeMultipliedWith;
  arapBalance;

  form: FormGroup;
  dtoObject;

  rowData = [];
  totalRecords = 0;
  limit = 200;
  searchQuery: SearchQueryModel;

  gridApi;
  gridColumnApi;
  private columnMoveSubject: Subject<void> = new Subject<void>();
  private debounceTimeMs = 500; // Adjust the debounce time as needed

  gridOptions: GridOptions = {
    statusBar: {
      statusPanels: [
        { statusPanel: 'agTotalAndFilteredRowCountComponent', key: 'totalAndFilter', align: 'left' },
        { statusPanel: 'agSelectedRowCountComponent', align: 'left' },
        { statusPanel: 'agAggregationComponent', align: 'right' }
      ]
    },
    defaultColDef: {
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      sortable: true,
      resizable: true,
    },
    columnTypes: UtilitiesModule.columnTypes,
    pagination: true,
    animateRows: true,
    sideBar: true,
    rowSelection: 'multiple',
    rowHeight: 50,
    suppressRowClickSelection: true,
  };

  selectedNodesMap: { [key: string]: boolean } = {};
  columnsDefs = [
    {
      headerName: '',
      floatingFilter: false,
      field: '',
      flex: 2,
      minWidth: 30,
      cellStyle: () => ({'text-align': 'center','display': 'flex','align-items': 'center','justify-content': 'center',}),
      headerCheckboxSelection: true,
      checkboxSelection: function(params) {
        return true;
      },

    },
    {
      headerName: 'Transaction Date', flex: 2, minWidth: 100, field: 'bl_fi_generic_doc_hdr.date_txn', type: 'dateColumn',
      cellStyle: {
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
      },
    },
    { headerName: 'Doc Short Code', flex: 2, minWidth: 80, field: 'bl_fi_generic_doc_hdr.server_doc_type', type: 'textColumn',
      valueFormatter: (params) => params.value ? DocumentShortCodesClass.serverDocTypeToShortCodeMapper(params.value) : "",
      cellStyle: {
        'text-align': 'left',
        'display': 'flex',
        'align-items': 'center',
      },
    },
    { headerName: 'Doc No',flex: 2, minWidth: 100, field: 'bl_fi_generic_doc_hdr.server_doc_1', type: 'textColumn',
      cellStyle: {
        'display': 'flex',
        'align-items': 'center',
        'text-align': 'left',
      },
      cellRenderer: (params) => {
        return `<span class="clickable-cell">${params.value}</span>`;
      }
    },
    { headerName: 'Bal', field: 'newBalance', type: 'decimalColumn', flex: 2, minWidth: 100,
    },
    {
      headerName: 'Amount Contra', field: 'bl_fi_generic_doc_hdr.amount_contra',flex: 2, minWidth: 120,
      cellRendererFramework: InputTextCellRendererComponent,
      cellStyle: {
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'text-align': 'right'
      },
    },
    {
      headerName: "Contra Date",
      field: "contra_date",
      cellRenderer: "dateCellRenderer",
      cellStyle: () => ({ "text-align": "left" }),
      minWidth: 200,
    },
    { headerName: 'Doc Open', field: 'bl_fi_generic_doc_hdr.arap_doc_open', type: 'decimalColumn', flex: 2, minWidth: 100,
      cellStyle: {
        'display': 'flex',
        'align-items': 'center',
        'text-align': 'right'
      },
    },
    { headerName: 'Contra', field: 'bl_fi_generic_doc_hdr.arap_contra', type: 'decimalColumn', flex: 2, minWidth: 100,
      cellStyle: {
        'display': 'flex',
        'align-items': 'center',
        'text-align': 'right'
      },
    },
    { headerName: 'Branch',flex: 2, minWidth: 100, field: 'bl_fi_generic_doc_hdr.code_branch', type: 'textColumn',
      cellStyle: {
        'text-align': 'left',
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
      },
    },
    { headerName: 'Remarks', field: 'bl_fi_generic_doc_hdr.doc_remarks', type: 'textColumn' ,
      cellStyle: {
        'text-align': 'left',
        'display': 'flex',
        'align-items': 'center',
      },
    },
    { headerName: 'Posting Status', field: 'bl_fi_generic_doc_hdr.posting_status', type: 'textColumn',
      cellStyle: {
        'text-align': 'left',
        'display': 'flex',
        'align-items': 'center',
      },
    },
    { headerName: 'Status', field: 'bl_fi_generic_doc_hdr.status', type: 'textColumn' ,
      cellStyle: {
        'text-align': 'left',
        'display': 'flex',
        'align-items': 'center',
      },
    },
    {
      headerName: 'Creation Date', field: 'bl_fi_generic_doc_hdr.created_date', type: 'dateTimeColumn',
      cellStyle: {
        'display': 'flex',
        'align-items': 'center',
      },
    },
    { headerName: 'Quotation', field: 'bl_fi_generic_doc_hdr.xtn_doc_ref_1',
      cellStyle: {
        'text-align': 'left',
        'display': 'flex',
        'align-items': 'center',
      },
    },
    { headerName: 'Order', field: 'bl_fi_generic_doc_hdr.xtn_doc_ref_2',
      cellStyle: {
        'text-align': 'left',
        'display': 'flex',
        'align-items': 'center'
      },
    },
    { headerName: 'Delivery Order', field: 'bl_fi_generic_doc_hdr.xtn_doc_ref_3',
      cellStyle: {
        'text-align': 'left',
        'display': 'flex',
        'align-items': 'center'
      },
    },
    { headerName: 'Invoice', field: 'bl_fi_generic_doc_hdr.xtn_doc_ref_4',
      cellStyle: {
        'text-align': 'left',
        'display': 'flex',
        'align-items': 'center'
      },
    },
    { headerName: 'Others', field: 'bl_fi_generic_doc_hdr.xtn_doc_ref_5',
      cellStyle: {
        'text-align': 'left',
        'display': 'flex',
        'align-items': 'center'
      },
    },
    { headerName: 'Reference', field: 'bl_fi_generic_doc_hdr.doc_reference',
      cellStyle: {
        'text-align': 'left',
        'display': 'flex',
        'align-items': 'center'
      },
    },
    { headerName: 'Tracking No', field: 'bl_fi_generic_doc_hdr.tracking_id',
      cellStyle: {
        'text-align': 'left',
        'display': 'flex',
        'align-items': 'center'
      },
    },
    { headerName: 'Description', field: 'bl_fi_generic_doc_hdr.doc_desc',
      cellStyle: {
        'text-align': 'left',
        'display': 'flex',
        'align-items': 'center'
      },
    },
    { headerName: 'Client Doc 1', field: 'bl_fi_generic_doc_hdr.client_doc_1',
      cellStyle: {
        'text-align': 'left',
        'display': 'flex',
        'align-items': 'center'
      },
    },
    { headerName: 'Client Doc 2', field: 'bl_fi_generic_doc_hdr.client_doc_2',
      cellStyle: {
        'text-align': 'left',
        'display': 'flex',
        'align-items': 'center'
      },
    },
    { headerName: 'Client Doc 3', field: 'bl_fi_generic_doc_hdr.client_doc_3',
      cellStyle: {
        'text-align': 'left',
        'display': 'flex',
        'align-items': 'center'
      },
    },
    { headerName: 'Client Doc 4', field: 'bl_fi_generic_doc_hdr.client_doc_4',
      cellStyle: {
        'text-align': 'left',
        'display': 'flex',
        'align-items': 'center'
      },
    },
    { headerName: 'Client Doc 5', field: 'bl_fi_generic_doc_hdr.client_doc_5',
      cellStyle: {
        'text-align': 'left',
        'display': 'flex',
        'align-items': 'center'
      },
    },
  ];

  frameworkComponents = {
    dateCellRenderer: DateCellRendererComponentV2,
  };

  @ViewChild(PaginationV2Component, { static: false })
  private paginationComponent: PaginationV2Component;

  totalContra = 0;
  contra = 0;
  contraList;
  AUTO_SETTLE_CONTRA = false;
  CONTRA_DATE_SAME_AS_DOC_DATE_TXN = false;

  constructor(
    private viewColFacade: ViewColumnFacade,
    private genDocAllService: GenericDocAllService,
    private branchService: BranchService,
    private readonly store: Store<InternalSalesReturnStates>,
    private readonly draftStore: Store<DraftStates>,
    private readonly componentStore: ComponentStore<LocalState>,
    private valueService: ValueService,
    private toastr: ToastrService,
    private readonly sessionStore: Store<SessionStates>,
    ) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.sessionStore.select(SessionSelectors.selectMasterSettings).subscribe((resolve: any) => {
      this.AUTO_SETTLE_CONTRA = resolve?.AUTO_SETTLE_CONTRA ?? false;
      this.CONTRA_DATE_SAME_AS_DOC_DATE_TXN = resolve?.CONTRA_DATE_SAME_AS_DOC_DATE_TXN ?? false;
    });

    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);

    this.subs.sink = this.draftStore.select(HDRSelectors.selectHdr).subscribe(data => {
      this.hdr = data;
      this.entityHdrGuid = data.doc_entity_hdr_guid;
      this.compGuid = data.guid_comp;
    });

    this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectedDocArapBalance).subscribe(outstanding => {
      this.docArapBalance = Number(outstanding);
      this.newDocArapBalance = this.docArapBalance;
    });

    this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectedTotalContra).subscribe(data => {
      this.contra = data;
    });
    this.totalContra = this.contra;
    this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectedDocOpenAmount).subscribe(data => {
      this.docOpenAmount = data;
    });
    this.subs.sink = this.draftStore.select(ContraSelectors.selectContraNewList).subscribe(data => {
      this.contraList = data;
    });
    this.form = new FormGroup({
      transactionDate: new FormControl(new Date()),
      totalAmountContra: new FormControl(),
    });

    this.subs.sink = this.valueService.valueChanged$.subscribe((value: number) => {
      this.totalContra = this.contra;
      Object.keys(this.selectedNodesMap).forEach(key => {
        const selectedNode = this.gridApi.getRowNode(key);
        if (selectedNode) {
          const absValue = Math.abs(selectedNode.data.bl_fi_generic_doc_hdr.amount_contra);
          const selectedAmt = absValue * selectedNode.data.bl_fi_generic_doc_hdr.amount_signum;
          this.totalContra += selectedAmt;
        }
      });
      this.newDocArapBalance = this.docOpenAmount + this.totalContra;
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.closeToolPanel();

    this.dtoObject = {
      "offset": 0,
      'calcTotalRecords': true,
      "guid_comp" : this.compGuid,
      "doc_entity_hdr_guid" : this.entityHdrGuid,
      "hdr_doc_ccy" : this.hdr.doc_ccy,
      "hdr_posting_status": "FINAL",
      "arap_bal_range": this.docArapBalance < 0 ? "POSITIVE": "NEGATIVE",
      "orderBy": "date_txn"
    }

    this.createData();
  }

  onRowSelected(event: any): void {
    const node = event.node;
    const nodeId = node.id;
    const arapBal = node.data.newBalance;
    if (node.selected) {
      const amountContra = node.data.bl_fi_generic_doc_hdr.amount_contra;

      if (!node.data.isSettled || (node.data.isSettled && amountContra === 0)) {
        let amountToContra = arapBal;
        if (Math.abs(Number(arapBal)) > Math.abs(Number(this.newDocArapBalance))) {
          amountToContra = this.newDocArapBalance*-1;
          let tempTotalContra = this.totalContra + amountToContra;
          if(Math.abs(Number(tempTotalContra)) > Math.abs(Number(this.docOpenAmount))){
            amountToContra = 0.00;
          }
        }else {
          amountToContra = arapBal;
        }
        this.gridApi.getRowNode(nodeId).setDataValue('bl_fi_generic_doc_hdr.amount_contra', amountToContra);
      }
      this.selectedNodesMap[nodeId] = true;
    } else {
      if (this.selectedNodesMap[nodeId]) {
        this.gridApi.getRowNode(nodeId).setDataValue('bl_fi_generic_doc_hdr.amount_contra', 0.00);
        delete this.selectedNodesMap[nodeId];
      }
    }

    this.totalContra =  this.contra;
    Object.keys(this.selectedNodesMap).forEach(key => {
      const selectedNode = this.gridApi.getRowNode(key);
      if (selectedNode) {
        const absValue = Math.abs(selectedNode.data.bl_fi_generic_doc_hdr.amount_contra);
        const amountContra = absValue * selectedNode.data.bl_fi_generic_doc_hdr.amount_signum;
        this.totalContra += amountContra;
      }
    });
    this.newDocArapBalance = this.docOpenAmount + this.totalContra;
  }

  createData(showAll?) {
    if (showAll) {
      this.dtoObject["limit"] = null;
      this.limit = 100000;// to load all data in one page
      this.clear();
    } else {
      this.dtoObject["limit"] = this.limit;
      this.limit = 200
    }

    this.subs.sink = this.genDocAllService.getByGenericCriteriaSnapshot(this.dtoObject, this.apiVisa).pipe(
      mergeMap(a => from(a.data).pipe(
        map(b => {
          const matchedList = this.contraList?.filter(c => c.guid_doc_2_hdr === b.bl_fi_generic_doc_hdr.guid);
          const totalAmountContra = matchedList.reduce((sum, item) => sum + item.amount_contra, 0);

          let newBalance = null;
          if (matchedList.length) {
            newBalance = parseFloat(b.bl_fi_generic_doc_hdr.arap_bal.toString()) - totalAmountContra;
          }else{
            newBalance = b.bl_fi_generic_doc_hdr.arap_bal;
          }
          const assignObj = <any> {
            bl_fi_generic_doc_hdr: b.bl_fi_generic_doc_hdr,
            newBalance: newBalance
          };

          if (this.CONTRA_DATE_SAME_AS_DOC_DATE_TXN) {
            assignObj.contra_date = this.hdr.date_txn;
          }

          Object.assign(b, assignObj);
          return b;
        }),
        toArray(),
        map(c => {
          a.data = c;
          return a;
        })
      ))
    ).subscribe((resolved: any) => {
      console.log(resolved)
      const EPSILON = 0.0001; // Small threshold to consider as zero
      const filteredData = resolved.data.filter(item => Math.abs(Number(item.newBalance)) > EPSILON);
      this.rowData = [...this.rowData, ...this.checkDataRow(filteredData)];
      console.log('this.rowData ===>',this.rowData)
      if (filteredData.length < resolved.data.length) {
        this.totalRecords = filteredData.length;
      } else {
        this.totalRecords = resolved.totalRecords;
      }
      this.gridApi.setRowData(this.rowData);
      this.gridApi.paginationGoToLastPage();
      this.paginationComponent.totalRecords.next(this.totalRecords);
    }, err => {
      console.error(err);
    });
  };

  onSearch(e: any) {
    console.log("search", e);
    if (!e.isEmpty) {
      if (e.keyword && e.keyword.length > 0 && e.keyword.length < 3)  {
        this.toastr.error(
          'Search keyword must more than 2 characters.',
          'Keyword',
          {
            tapToDismiss: true,
            progressBar: true,
            timeOut: 0,
            extendedTimeOut: 0
          }
        );
        return;
      }
      this.searchQuery = e;
    } else {
      this.searchQuery = null;
    }
    this.clear();
    const inputModel = e.queryString;
    // if(e?.keyword){
    //   this.dtoObject['search_word'] = e.keyword;
    // } else {
    //   this.dtoObject['search_word'] = null
    // }

    if(inputModel?.docNo || e?.keyword){
      e?.keyword ? this.dtoObject['server_doc_1'] = e.keyword : this.dtoObject['server_doc_1'] = inputModel.docNo;
    } else {
      this.dtoObject['server_doc_1'] = null;
    }

    if(inputModel?.docType){
      this.dtoObject['server_doc_type'] = inputModel.docType;
    } else {
      this.dtoObject['server_doc_type'] = null
    }

    if (inputModel['creationDateCheckbox']) {
      const dateFrom = UtilitiesModule.checkNull(inputModel['creationDate']['from'],'2022-01-01T00:00:00.000Z');
      const dateTo = UtilitiesModule.checkNull(inputModel['creationDate']['to'],'2099-12-31T00:00:00.000Z');
      this.dtoObject['created_date_from'] = dateFrom;
      this.dtoObject['created_date_to'] = dateTo;
    } else {
      this.dtoObject['created_date_from'] = null;
      this.dtoObject['created_date_to'] = null;
    }


    if (inputModel['transactionDateCheckbox']) {
      const dateFrom = UtilitiesModule.checkNull(inputModel['transactionDate']['from'],'2022-01-01T00:00:00.000Z');
      const dateTo = UtilitiesModule.checkNull(inputModel['transactionDate']['to'],'2099-12-31T00:00:00.000Z');
      this.dtoObject['date_txn_from'] = dateFrom;
      this.dtoObject['date_txn_to'] = dateTo;
    } else {
      this.dtoObject['date_txn_from'] = null;
      this.dtoObject['date_txn_to'] = null;
    }
    this.createData();
  }

  onReturn() {
    this.viewColFacade.updateInstance<LocalState>(this.prevIndex, {
      ...this.prevLocalState,
      deactivateReturn: false,
      deactivateAdd: false,
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onAdd() {
    this.store.dispatch(InternalSalesReturnActions.refreshArapListing({refreshArapListing : true}));
    let selectedRows = this.gridApi.getSelectedRows();
    console.log("selected rows",this.gridApi.getSelectedRows());
    let contraList = [];
    selectedRows.forEach(e => {
      this.arapBalance = e.bl_fi_generic_doc_hdr.arap_bal;
      let contra = new bl_fi_generic_doc_arap_contra_RowClass();
      contra.guid = UUID.UUID().toLowerCase();
      if(this.arapBalance < 0) {
        this.contraAmountToBeMultipliedWith = -1;
      } else {
        this.contraAmountToBeMultipliedWith = 1;
      }

      let contraAmount = Math.abs(Number(((<any>e.bl_fi_generic_doc_hdr).amount_contra)));
      let contraAmountFinal = Number(contraAmount) * this.contraAmountToBeMultipliedWith;
      contra.amount_contra = contraAmountFinal;
      if(e.contra_date){
        contra.date_txn = <any> new Date(e.contra_date);
      }else{
        contra.date_txn = <any> new Date();
      }

      contra.guid_doc_1_hdr = this.hdr.guid.toString();
      contra.guid_doc_2_hdr = e.bl_fi_generic_doc_hdr.guid.toString();
      contra.server_doc_type_doc_1 = this.hdr.server_doc_type.toString();
      contra.server_doc_type_doc_2 = e.bl_fi_generic_doc_hdr.server_doc_type.toString();
      contra.date_doc_1 = this.hdr.date_txn.toString();
      contra.date_doc_2 = e.bl_fi_generic_doc_hdr.date_txn.toString();
      contra = Object.assign({
        ...contra,
        bl_fi_generic_doc_hdr_server_doc_1: e.bl_fi_generic_doc_hdr.server_doc_1
      })
      this.viewColFacade.addContra(contra);
      console.log('contra',contra);
    });
    this.viewColFacade.resetIndex(2);

  }

  onDisableAdd() {
    let result = false;

    if (this.gridApi.getSelectedRows().length === 0) {
      result = true;
    }

    const roundedDocOpenAmount = Math.round(this.docOpenAmount * 100) / 100;
    const roundedTotalContra = Math.round(this.totalContra * 100) / 100;

    if (Math.abs(roundedDocOpenAmount) > 0 && Math.abs(roundedTotalContra) > Math.abs(roundedDocOpenAmount)) {
      result = true;
    }

    return result;
  }

  onMorePage() {
    console.log('on more page click');
    if (this.rowData.length < this.totalRecords) {
      this.createData();
    }
  }

  onAllPage() {
    this.createData(true);
  }

  clear() {
    this.gridApi.setRowData(null);
    this.totalRecords = 0;
    this.rowData = [];
    this.paginationComponent.totalRecords.next(this.totalRecords);
  }

  checkDataRow(rowData) {
    return rowData.filter(item => item.bl_fi_generic_doc_hdr.forex_doc_hdr_guid === null);
  }

  getTotalContraColor() {
    const roundedDocOpenAmount = Math.round(this.docOpenAmount * 100) / 100;
    const roundedTotalContra = Math.round(this.totalContra * 100) / 100;

    if (Math.abs(roundedDocOpenAmount) > 0 && Math.abs(roundedTotalContra) > Math.abs(roundedDocOpenAmount)) {
      return "#ff0000";
    } else {
      return "#1e88e5";
    }
  }

  getTotalContra() {
    return UtilitiesModule.currencyFormatter(this.totalContra);
  }

  getOpenAmount() {
    return UtilitiesModule.currencyFormatter(this.docOpenAmount);
  }

  getARAP() {
    return UtilitiesModule.currencyFormatter(this.docArapBalance);
  }

  getCurrentBalance() {
    return UtilitiesModule.currencyFormatter(this.newDocArapBalance);
  }

  onAutoSettle() {
    const totalAmountContraValue = this.form.controls['totalAmountContra'].value;
    let remainingAmount = totalAmountContraValue;

    this.rowData.forEach(data => {
      const availableBalance = data.newBalance;
      const amountToAssign = Math.min(Math.abs(remainingAmount), Math.abs(availableBalance));
      data.bl_fi_generic_doc_hdr.amount_contra = amountToAssign;
      if (amountToAssign > 0) {
        data.isSettled = true;
      } else {
        data.isSettled = false;
      }

      remainingAmount -= amountToAssign;

      if (remainingAmount <= 0) {
        return;
      }
    });

    this.gridApi.forEachNode(node=> {
      if (node.data.isSettled) {
        node.setSelected(true);
      }else{
        node.setSelected(false);
      }
    })

    this.gridApi.refreshCells({ force: true });
    this.form.controls['totalAmountContra'].setValue(null);
  }

  onReset() {
    this.gridApi.forEachNode(node => {
      node.setSelected(false);
      node.data.isSettled = false;
      node.data.bl_fi_generic_doc_hdr.amount_contra = 0;
    });

    this.gridApi.refreshCells({ force: true });
    this.form.controls['totalAmountContra'].setValue(null);
  }

}
