import {
  Component, ViewChild
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ComponentStore } from "@ngrx/component-store";
import { Store } from "@ngrx/store";
import { SelectionChangedEvent } from "ag-grid-community";
import { UUID } from "angular2-uuid";
import {
  bl_fi_generic_doc_line_RowClass,
  bl_fi_generic_doc_link_RowClass, Pagination, SalesInvoiceService, SubQueryService
} from "blg-akaun-ts-lib";
import moment from "moment";
import { SearchQueryModel } from "projects/shared-utilities/models/query.model";
import { PaginationComponent } from "projects/shared-utilities/utilities/pagination/pagination.component";
import { ViewColumnComponent } from "projects/shared-utilities/view-column.component";
import { AppConfig } from "projects/shared-utilities/visa";
import { SubSink } from "subsink2";
import { ViewColumnFacade } from "../../../../../facades/view-column.facade";
import { importKOSearchModel } from "../../../../../models/advanced-search-models/import-line.model";
import { AppletConstants } from "../../../../../models/constants/applet-constants";
import {
  LinkActions,
  PNSActions
} from "../../../../../state-controllers/draft-controller/store/actions";
import { DraftStates } from "../../../../../state-controllers/draft-controller/store/states";
import { Column2ViewModelActions } from "../../../../../state-controllers/sales-return-view-model-controller/store/actions";
import { Column2ViewSelectors } from "../../../../../state-controllers/sales-return-view-model-controller/store/selectors";
import { ColumnViewModelStates } from "../../../../../state-controllers/sales-return-view-model-controller/store/states";
import { InternalSalesReturnStates } from '../../../../../state-controllers/internal-sales-return-controller/store/states';
import { InternalSalesReturnActions } from '../../../../../state-controllers/internal-sales-return-controller/store/actions';

interface LocalState {
  deactivateReturn: boolean;
  deactivateList: boolean;
  selectedIndex: number;
}

@Component({
  selector: 'app-knock-off-sales-invoice',
  templateUrl: './knock-off-sales-invoice.component.html',
  styleUrls: ['./knock-off-sales-invoice.component.css']
})
export class KnockOffSalesInvoiceComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = "KO For JobSheet";
  protected readonly index = 1;
  protected localState: LocalState;
  protected prevLocalState: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(
    (state) => state.deactivateReturn
  );
  readonly selectedIndex$ = this.componentStore.select(
    (state) => state.selectedIndex
  );

  public form: FormGroup;
  rowData = [];
  gridApi;
  SQLGuids: string[] = null;
  pagination = new Pagination();
  searchModel = importKOSearchModel;

  defaultColDef = {
    filter: "agTextColumnFilter",
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true,
  };

  columnsDefs = [
    {
      headerName: "Doc No",
      field: "bl_fi_generic_doc_hdr.server_doc_1",
      cellStyle: () => ({ "text-align": "left" }),
      checkboxSelection: true,
      valueGetter: (params) => {
        return parseInt(params.data.bl_fi_generic_doc_hdr.server_doc_1);
      },
      sort: "desc",
      floatingFilter: true,
    },
    {
      headerName: "Customer",
      field: "bl_fi_generic_doc_hdr.doc_entity_hdr_json.entityName",
      cellStyle: () => ({ "text-align": "left" }),
      floatingFilter: true,
    },
    {
      headerName: "Branch",
      field: "bl_fi_generic_doc_hdr.code_branch",
      cellStyle: () => ({ "text-align": "left" }),
      floatingFilter: true,
    },
    {
      headerName: "Location",
      field: "bl_fi_generic_doc_hdr.code_location",
      cellStyle: () => ({ "text-align": "left" }),
      floatingFilter: true,
    },
    {
      headerName: "Ref No",
      field: "bl_fi_generic_doc_hdr.doc_reference",
      cellStyle: () => ({ "text-align": "left" }),
      floatingFilter: true,
    },
    {
      headerName: "Txn Date",
      field: "bl_fi_generic_doc_hdr.date_txn",
      type: "rightAligned",
      valueFormatter: (params) => moment(params.value).format("YYYY-MM-DD"),
      floatingFilter: true,
    },
  ];

  @ViewChild(PaginationComponent) paginationComp: PaginationComponent;
  disableButton: boolean;

  constructor(
    protected readonly store: Store<InternalSalesReturnStates>,
    private readonly draftStore: Store<DraftStates>,
    private viewColFacade: ViewColumnFacade,
    private internalSalesInvoiceService: SalesInvoiceService,
    private subQueryService: SubQueryService,
    protected readonly componentStore: ComponentStore<LocalState>,
    public readonly viewModelStore: Store<ColumnViewModelStates>
  ) {
    super();
  }

  ngOnInit() {
    this.form = new FormGroup({
      salesOrder: new FormControl(),
      salesReturn: new FormControl(),
      jobsheet: new FormControl(),
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.retrieveData();
  }

  retrieveData() {
    const apiVisa = AppConfig.apiVisa;
    this.pagination.limit = 500;
    this.pagination.conditionalCriteria = [
      { columnName: "calcTotalRecords", operator: "=", value: "true" },
      {
        columnName: "line_open_queue_server_doc_type_1",
        operator: "=",
        value: "INTERNAL_SALES_INVOICE",
      },
      {
        columnName: "line_open_queue_server_doc_type_2",
        operator: "=",
        value: "INTERNAL_SALES_RETURN_REQUEST",
      },
      {
        columnName: "guids",
        operator: "=",
        value: this.SQLGuids ? this.SQLGuids.toString() : "",
      },
    ];
    this.gridApi.showLoadingOverlay();
    this.subs.sink = this.internalSalesInvoiceService
      .getGenericDocHdrLineLinkImportByCriteria(this.pagination, apiVisa)
      .subscribe(
        (resolved) => {
          let newArrData = new Array();
          newArrData = [...resolved.data].map((doc) => {
            doc.bl_fi_generic_doc_lines.forEach((line) => {
              doc.bl_fi_generic_doc_line_open_queues.forEach((queue) => {
                if (line.guid === queue.guid_doc_1_line) {
                  line.qty_open = queue.qty_open;
                }
              });
            });
            return doc;
          });
          this.rowData = newArrData;
          this.gridApi.setRowData(this.rowData);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  onKO() {
    const apiVisa = AppConfig.apiVisa;
    const selectedGenDoc = this.gridApi.getSelectedRows();
    this.store.dispatch(InternalSalesReturnActions.loadBranchCompany({  compGuid: selectedGenDoc[0].bl_fi_generic_doc_hdr.guid_comp,branchGuid:selectedGenDoc[0].bl_fi_generic_doc_hdr.guid_branch,changeDefault: true , branchObj:null}));
    console.log("selected", selectedGenDoc);
    let hdrGuid = selectedGenDoc[0].bl_fi_generic_doc_hdr.guid;
    let hdrServerDocType =
      selectedGenDoc[0].bl_fi_generic_doc_hdr.server_doc_type;
    let hdrServerDoc = selectedGenDoc[0].bl_fi_generic_doc_hdr.server_doc_1;
    this.viewModelStore.dispatch(
      Column2ViewModelActions.setKOForImport_SIDocNo({
        koForSIDocNo : hdrServerDoc,
      })
    );
    this.viewColFacade.updateMainOnKOImport(selectedGenDoc[0]);
    selectedGenDoc[0].bl_fi_generic_doc_lines.forEach((line) => {
      this.createNewLineAndLink(line, hdrGuid, hdrServerDocType);
    });
  }

  onSelectionChanged(event: SelectionChangedEvent) {
    let serverDoc =
      event.api.getSelectedRows()[0].bl_fi_generic_doc_hdr.server_doc_1;
    this.subs.sink = this.viewModelStore
      .select(Column2ViewSelectors.selectKOForImport_SIDocNo)
      .subscribe((result) => {
        if (result === serverDoc) {
          this.disableButton = true;
        } else {
          this.disableButton = false;
        }
      });
  }

  createNewLineAndLink(
    a: bl_fi_generic_doc_line_RowClass,
    hdrGuid: any,
    hdrServerDocType: any
  ) {
    console.log("Selected Line", a);
    const line = new bl_fi_generic_doc_line_RowClass();
    line.guid = UUID.UUID().toLowerCase();
    line.item_guid = a.item_guid;
    line.item_code = a.item_code;
    line.item_name = a.item_name;
    line.quantity_base = a.qty_open; // knock off qty
    line.unit_price_std = a.unit_price_std;
    line.unit_price_txn = a.unit_price_txn;
    line.tax_gst_code = a.tax_gst_code;
    line.tax_gst_rate = a.tax_gst_rate;
    line.tax_gst_type = a.tax_gst_type;
    line.amount_tax_gst = a.amount_tax_gst;
    line.tax_wht_code = a.tax_wht_code;
    line.tax_wht_rate = a.tax_wht_rate;
    line.amount_tax_wht = a.amount_tax_wht;
    line.amount_discount = a.amount_discount;
    line.amount_net = a.amount_net;
    line.amount_std = a.amount_std;
    line.amount_txn = a.amount_txn;
    line.item_remarks = a.item_remarks;
    line.item_txn_type = a.item_txn_type;
    line.item_sub_type = a.item_sub_type;
    line.guid_dimension = a.guid_dimension;
    line.guid_profit_center = a.guid_profit_center;
    line.guid_project = a.guid_project;
    line.guid_segment = a.guid_segment;
    line.item_property_json = a.item_property_json;
    line.line_property_json = a.line_property_json;
    line.txn_type = a.txn_type;
    line.uom = a.uom;
    line.uom_to_base_ratio = a.uom_to_base_ratio;
    line.qty_by_uom = a.qty_by_uom;
    line.unit_price_std_by_uom = a.unit_price_std_by_uom;
    line.unit_price_txn_by_uom = a.unit_price_txn_by_uom;
    line.unit_disc_by_uom = a.unit_disc_by_uom;
    line.quantity_signum = AppletConstants.quantity_signum;
    line.amount_signum = AppletConstants.amount_signum;
    line.server_doc_type = AppletConstants.docType;
    line.client_doc_type = AppletConstants.docType;
    line.date_txn = new Date();
    line.status = "ACTIVE";
    line.tracking_id = a.tracking_id;
    // To confirm whether to copy these values
    line.serial_no = a.serial_no;
    line.bin_no = a.bin_no;
    line.batch_no = a.batch_no;

    const link = new bl_fi_generic_doc_link_RowClass();
    link.guid_doc_2_line = line.guid;
    link.guid_doc_1_hdr = hdrGuid;
    link.guid_doc_1_line = a.guid;
    link.server_doc_type_doc_1_hdr = hdrServerDocType;
    link.server_doc_type_doc_1_line = a.server_doc_type;
    link.server_doc_type_doc_2_hdr = AppletConstants.docType;
    link.server_doc_type_doc_2_line = AppletConstants.docType;
    // link.txn_type = 'ISO_IPO';
    link.txn_type = "KO";
    link.quantity_signum = 0;
    // link.quantity_contra = line.quantity_base;
    link.quantity_contra = a.qty_open;
    link.date_txn = new Date();
    link.status = "DRAFT";

    this.draftStore.dispatch(LinkActions.addLink({ link }));
    this.draftStore.dispatch(PNSActions.addPNS({ pns: line }));
    this.viewColFacade.showSuccessToast("Jobsheet Successfully Knocked Off");
  }

  onSearch(e: SearchQueryModel) {
    if (!e.isEmpty) {
      const sql = {
        subquery:
          e.queryString +
          `AND queue.server_doc_type_1 = 'INTERNAL_SALES_INVOICE' AND queue.server_doc_type_2 = 'INTERNAL_SALES_RETURN_REQUEST'`,
        table: e.table,
      };
      this.subs.sink = this.subQueryService
        .post(sql, AppConfig.apiVisa)
        .subscribe({
          next: (resolve) => {
            this.SQLGuids = resolve.data;
            // this.paginationComp.firstPage();
            this.retrieveData();
          },
        });
    } else {
      this.SQLGuids = null;
      // this.paginationComp.firstPage();
      this.retrieveData();
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
