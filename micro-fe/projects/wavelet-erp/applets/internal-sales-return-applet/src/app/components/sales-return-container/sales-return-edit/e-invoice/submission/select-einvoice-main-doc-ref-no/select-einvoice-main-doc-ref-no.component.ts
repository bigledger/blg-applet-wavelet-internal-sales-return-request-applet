import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { DocumentShortCodesClass, MembershipCardContainerModel, MembershipCardService, MyEInvoiceToIRBHdrLinesService, Pagination, SubQueryService } from 'blg-akaun-ts-lib';
import { pageFiltering, pageSorting } from 'projects/shared-utilities/listing.utils';
import { SearchQueryModel } from 'projects/shared-utilities/models/query.model';
import { PaginationComponent } from 'projects/shared-utilities/utilities/pagination/pagination.component';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../../../facades/view-column.facade';
import { toIRBSearchModel } from '../../../../../../models/advanced-search-models/to_irb.model';
import { InternalSalesReturnStates } from '../../../../../../state-controllers/internal-sales-return-controller/store/states';
import { DraftStates } from '../../../../../../state-controllers/draft-controller/store/states';
import { HDRSelectors } from '../../../../../../state-controllers/draft-controller/store/selectors';
import moment from 'moment';
import { InternalSalesReturnActions } from '../../../../../../state-controllers/internal-sales-return-controller/store/actions';

interface LocalState {
  deactivateAdd: boolean;
  deactivateList: boolean;
  deactivateReturn: boolean;
  selectedRow: any;
}

@Component({
  selector: 'app-select-einvoice-main-doc-ref-no',
  templateUrl: './select-einvoice-main-doc-ref-no.component.html',
  styleUrls: ['./select-einvoice-main-doc-ref-no.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class MainDetailsSelectEinvoiceMainDocRefNoComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Select E-Invoice Main Doc Ref No';
  protected readonly index = 42;
  protected localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateAdd$ = this.componentStore.select(state => state.deactivateAdd);
  readonly deactivateList$ = this.componentStore.select(state => state.deactivateList);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);

  prevIndex: number;
  branchGuid: string;
  protected prevLocalState: any;

  // change search model
  searchModel = toIRBSearchModel;
  baseConditionalCriteria = [
    { columnName: "calcTotalRecords", operator: "=", value: "true" },
    { columnName: 'orderBy', operator: '=', value: 'updated_date' },
    { columnName: 'order', operator: '=', value: 'DESC' },
    { columnName: 'hdr_generic_doc_hdr_server_doc_types', operator: '=', value: 'INTERNAL_SALES_INVOICE' },
    { columnName: 'hdr_einvoice_document_statuses', operator: '=', value: 'Valid' },
  ];
  defaultConditionalCriteria = [...this.baseConditionalCriteria]

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true
  };

  gridApi;

  columnsDefs = [
    {
      headerName: 'E-Invoice No./Running No.',
      field: 'bl_fi_my_einvoice_to_irb_hdr.running_no',
      minWidth: 200,
      cellStyle: () => ({'text-align': 'left'}),
      checkboxSelection: params => params.data.bl_fi_my_einvoice_to_irb_hdr.submission_status === 'NOT_SUBMITTED',
    },
    {
      headerName: 'Company Code',
      field: 'bl_fi_my_einvoice_to_irb_hdr.code_company',
      minWidth: 150,
      cellStyle: () => ({'text-align': 'left'}),
    },
    {
      headerName: 'Doc No.',
      field: 'bl_fi_my_einvoice_to_irb_hdr.generic_doc_hdr_server_doc_1',
      minWidth: 100,
      cellStyle: () => ({'text-align': 'left'}),
      checkboxSelection: params => params.data.bl_fi_my_einvoice_to_irb_hdr.submission_status === 'NOT_SUBMITTED',
    },
    {
      headerName: "Doc Short Code",
      field: "bl_fi_my_einvoice_to_irb_hdr.generic_doc_hdr_server_doc_type",
      minWidth: 100,
      cellStyle: () => ({ "text-align": "left" }),
      valueFormatter: (params) =>
        params.value
          ? DocumentShortCodesClass.serverDocTypeToShortCodeMapper(
              params.value
            )
          : ""
    },
    {
      headerName: 'E-Invoice Document Status',
      field: 'bl_fi_my_einvoice_to_irb_hdr.einvoice_document_status',
      cellStyle: () => ({'text-align': 'left'})
    },
    {
      headerName: 'Status',
      field: 'bl_fi_my_einvoice_to_irb_hdr.submission_status',
      cellStyle: () => ({'text-align': 'left'})
    },
    {
      headerName: 'LHDN Submission',
      field: 'bl_fi_my_einvoice_to_irb_hdr.lhdn_submission_guid',
      cellStyle: () => ({'text-align': 'left'})
    },
    {
      headerName: 'LHDN Document',
      field: 'bl_fi_my_einvoice_to_irb_hdr.lhdn_document_guid',
      cellStyle: () => ({'text-align': 'left'})
    },
    {
      headerName: 'Buyer Name', field: 'bl_fi_my_einvoice_to_irb_hdr.buyer_name', cellStyle: () => ({'text-align': 'left'}),
    },
    {
      headerName: 'Buyer ID', field: 'bl_fi_my_einvoice_to_irb_hdr.buyer_id_no', cellStyle: () => ({'text-align': 'left'}),
    },
    {
      headerName: 'Buyer Tax ID', field: 'bl_fi_my_einvoice_to_irb_hdr.buyer_tax_id', cellStyle: () => ({'text-align': 'left'}),
    },
    {
      headerName: 'Supplier Name', field: 'bl_fi_my_einvoice_to_irb_hdr.supplier_name', cellStyle: () => ({'text-align': 'left'}),
    },
    {
      headerName: 'Supplier ID', field: 'bl_fi_my_einvoice_to_irb_hdr.supplier_id_no', cellStyle: () => ({'text-align': 'left'}),
    },
    {
      headerName: 'Supplier Tax ID', field: 'bl_fi_my_einvoice_to_irb_hdr.supplier_tax_id', cellStyle: () => ({'text-align': 'left'}),
    },
    {
      headerName: 'E Invoice Version', field: 'bl_fi_my_einvoice_to_irb_hdr.einvoice_ver', cellStyle: () => ({'text-align': 'left'}),
    },
    {
      headerName: 'E Invoice Type', field: 'bl_fi_my_einvoice_to_irb_hdr.einvoice_type', cellStyle: () => ({'text-align': 'left'}),
    },
    {
      headerName: 'E Invoice Code', field: 'bl_fi_my_einvoice_to_irb_hdr.einvoice_code_no', cellStyle: () => ({'text-align': 'left'}),
    },
    {
      headerName: 'E Invoice Original Ref.', field: 'bl_fi_my_einvoice_to_irb_hdr.original_einvoice_ref_no', cellStyle: () => ({'text-align': 'left'}),
    },
    {
      headerName: 'E Invoice Date',
      field: 'bl_fi_my_einvoice_to_irb_hdr.einvoice_datetime',
      minWidth: 100,
      valueFormatter: (params) => moment(params.value).format('YYYY-MM-DD'),
      cellStyle: () => ({'text-align': 'left'})
    },
  ];


  SQLGuids: string[] = null;
  pagination = new Pagination();

  @ViewChild(PaginationComponent) paginationComp: PaginationComponent;

  constructor(
    protected viewColFacade: ViewColumnFacade,
    private sqlService: SubQueryService,
    protected memberService: MembershipCardService,
    private myEInvoiceToIRBHdrLinesService: MyEInvoiceToIRBHdrLinesService,
    protected readonly draftStore: Store<DraftStates>,
    protected store: Store<InternalSalesReturnStates>,
    protected readonly componentStore: ComponentStore<LocalState>) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => { this.prevIndex = resolve });
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.subs.sink = this.draftStore.select(HDRSelectors.selectBranchGuid).subscribe(resolve => { this.branchGuid = resolve; });

    this.baseConditionalCriteria.push({ columnName: 'hdr_branch_guids', operator: '=', value: this.branchGuid });
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
  }

  onAdd() {
    // TODO: add simple customer creation
    this.viewColFacade.gotoFourOhFour();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.setGridData();
  }

  resetBaseConditionalCriteria() {
    this.baseConditionalCriteria = JSON.parse(JSON.stringify(this.defaultConditionalCriteria));
    this.baseConditionalCriteria.push({ columnName: 'hdr_branch_guids', operator: '=', value: this.branchGuid });
  }

  onSearch($event) {
    console.log("onSearch", $event)
    let criteriaToAppend = [];
    if ($event) {
      criteriaToAppend.push(
        { columnName: 'search_word', operator: '=', value: $event },
        { columnName: 'hdr_branch_guids', operator: '=', value: this.branchGuid }
      );
      this.baseConditionalCriteria = this.baseConditionalCriteria.concat(criteriaToAppend);
    }
    else {
      this.resetBaseConditionalCriteria()
    }
    this.setGridData();
  }


  onAdvancedSearch($event) {
    let criteriaToAppend = [];
    if ($event.docNo) {
      criteriaToAppend.push(
        { columnName: 'hdr_generic_doc_hdr_server_doc_1s', operator: '=', value: $event.docNo },
      );
    }
    if ($event.runningNo) {
      criteriaToAppend.push(
        { columnName: 'to_irb_running_nos', operator: '=', value: $event.runningNo },
      );
    }
    this.baseConditionalCriteria = this.baseConditionalCriteria.concat(criteriaToAppend);
    this.setGridData();
  }

  setGridData() {
    const apiVisa = AppConfig.apiVisa;
    const datasource = {
      getRows: grid => {
        const filter = pageFiltering(grid.request.filterModel);
        const sortOn = pageSorting(grid.request.sortModel);
        this.pagination.offset = this.SQLGuids ? 0 : grid.request.startRow;
        this.pagination.limit = grid.request.endRow - grid.request.startRow;
        this.pagination.conditionalCriteria = this.baseConditionalCriteria;
        this.subs.sink = this.myEInvoiceToIRBHdrLinesService.getByCriteria(this.pagination, apiVisa).subscribe(resolved => {
          const data = sortOn(resolved.data).filter(entity => filter.by(entity));
          const totalRecords = filter.isFiltering ? resolved.totalRecords : data.length;
          grid.success({
            rowData: data,
            rowCount: totalRecords
          });
        }, err => {
          grid.fail();
        });

      }
    };
    this.gridApi.setServerSideDatasource(datasource);
  }

  onToggle(e: boolean) {
    this.viewColFacade.toggleColumn(e);
  }

  onRowClicked(toIrb: any) {
    console.log("toIrb",toIrb)
    if (toIrb) {
      this.store.dispatch(InternalSalesReturnActions.selectEInvoiceMainDocRef({ toIrb: toIrb }));
    }
    this.onReturn()
  }

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateReturn: false,
      deactivateMember: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
