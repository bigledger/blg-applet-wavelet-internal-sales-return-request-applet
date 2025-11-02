import { Component, ViewChild } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Store } from "@ngrx/store";
import {
  Pagination,
  SalesReturnFileImportHelperContainerModel,
  SalesReturnFileImportHelperService,
} from "blg-akaun-ts-lib";
import moment from "moment";
import {
  pageFiltering,
  pageSorting,
} from "projects/shared-utilities/listing.utils";
import { PaginationComponent } from "projects/shared-utilities/utilities/pagination/pagination.component";
import { ViewColumnComponent } from "projects/shared-utilities/view-column.component";
import { AppConfig } from "projects/shared-utilities/visa";
import { Observable } from "rxjs";
import { SubSink } from "subsink2";
import { ViewColumnFacade } from "../../../../../facades/view-column.facade";
import { FileImportSelectors } from "../../../../../state-controllers/file-import-controller/store/selectors";
import { FileImportStates } from "../../../../../state-controllers/file-import-controller/store/states";
import { FileImportActions } from "../../../../../state-controllers/file-import-controller/store/actions";
import { ListingInputModel } from 'projects/shared-utilities/models/listing-input.model';
import { ListingService } from 'projects/shared-utilities/services/listing-service';
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';
import { PaginationV2Component } from 'projects/shared-utilities/utilities/pagination-v2/pagination-v2.component';
import { ToastrService } from 'ngx-toastr';
import { SearchQueryModel } from 'projects/shared-utilities/models/query.model';
import { ExportStatusBarComponent } from 'projects/shared-utilities/utilities/status-bar/export-status-bar.component';
import { GridOptions } from "ag-grid-enterprise";

interface LocalState {
  deactivateAdd: boolean;
  deactivateList: boolean;
  selectedRow: any;
  deactivateReturn: boolean;
  selectedIndex: number;
}

@Component({
  selector: "app-helper-checking-listing-error",
  templateUrl: "./helper-checking-listing-error.component.html",
  styleUrls: ["./helper-checking-listing-error.component.css"],
})
export class HelperCheckingListingErrorComponent extends ViewColumnComponent {
  protected compName = "Helper Checking Listing Error";
  protected readonly index = 3;
  private localState: LocalState;
  columnsDefs: any;
  searchQuery: SearchQueryModel;
  totalRecords = 0;
  limit = 50;
  // searchModel = helpercheckingSearchModel;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateAdd$ = this.componentStore.select(
    (state) => state.localState.deactivateAdd
  );
  readonly deactivateList$ = this.componentStore.select(
    (state) => state.localState.deactivateList
  );

  toggleColumn$: Observable<boolean>;
  apiVisa = AppConfig.apiVisa;

  defaultColDef = {
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    floatingFilter: true,
  };

  gridApi;
  rowData: any = [];
  sideBar;
  rowSelection;
  helperchecking$: Observable<SalesReturnFileImportHelperContainerModel[]>;
  newArr: any = [];
  helperchecking: any = [];
  helpercheckingArray: any = [];
  newHelpercheckingArray: any = [];
  fileGuid: any;
  SQLGuids: string[] = null;
  pagination = new Pagination();
  private subSink = new SubSink();
  public arr: any = [];

  @ViewChild(PaginationV2Component, {static: false})
  private paginationComponent: PaginationV2Component;
  gridOptions: GridOptions = {
    statusBar: {
      statusPanels: [
          { statusPanel: 'agTotalAndFilteredRowCountComponent', key: 'totalAndFilter', align: 'left' },
          { statusPanel: 'agSelectedRowCountComponent', align: 'left' },
          { statusPanel: 'agAggregationComponent', align: 'right' },
          { statusPanel: ExportStatusBarComponent, key: 'statusBarExportKey'}
      ]
    },
    defaultColDef: {
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        minWidth: 200,
        flex: 2,
        sortable: true,
        resizable: true,
        enableRowGroup: true,
    },
    columnTypes: UtilitiesModule.columnTypes,
    defaultExcelExportParams: UtilitiesModule.getDefaultExportParams(),
    defaultCsvExportParams: UtilitiesModule.getDefaultExportParams(),
    pagination: false,
    animateRows: true,
    sideBar: true,
    rowSelection: 'single',
    rowGroupPanelShow: 'always',
    suppressAggFuncInHeader: true,
    groupDisplayType: 'multipleColumns',
    suppressRowClickSelection: false,
    onSortChanged: this.onSortChanged,
    onFilterChanged: this.onFilterChanged
  }
  constructor(
    protected toastr: ToastrService,
    protected listingService: ListingService,
    private readonly store: Store<FileImportStates>,
    private readonly componentStore: ComponentStore<{ localState: LocalState }>,
    private viewColFacade: ViewColumnFacade,
    private helpercheckingService: SalesReturnFileImportHelperService
  ) {
    super();
    this.rowSelection = "multiple";
    this.sideBar = { toolPanels: ["columns"], defaultToolPanel: "" };

    this.columnsDefs = [
      {
        headerName: "Line Number",
        field: "bl_fi_internal_sales_return_import_file_helper.line_number",
        cellStyle: () => ({ "text-align": "left" }),
        sort: "ASC",
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Processed",
        field: "bl_fi_internal_sales_return_import_file_helper.processed",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: 'Validation Error',
        cellStyle: () => ({ 'text-align': 'left', 'font-weight': 'bold', 'color': 'red' }),
        field: 'bl_fi_internal_sales_return_import_file_helper.validation_error_description',
        cellRenderer: (params) => {
          if (params.value && params.value.trim() !== '') {
            // Extract the first 20 characters of the error as a preview
            const errorPreview = params.value.substring(0, 20) + (params.value.length > 20 ? '...' : '');
        
            // Return the error preview with a hover tooltip for the full error
            return `
              <span 
                style="color: red; font-weight: bold;" 
                title="${params.value}">
                &#9888; ${errorPreview}
              </span>`;
          }
          return ''; 
        },
        tooltipField: 'bl_fi_internal_sales_return_import_file_helper.validation_error_description',
      },
      {
        headerName: 'Sales Return No',
        field: 'bl_fi_generic_doc_hdr_server_doc_1',
        type: 'textColumn'
      },
      {
        headerName: "Branch Code",
        field: "bl_fi_internal_sales_return_import_file_helper.branch_code",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Location Code",
        field: "bl_fi_internal_sales_return_import_file_helper.location_code",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Settlement/Item Code",
        field:
          "bl_fi_internal_sales_return_import_file_helper.settlement_or_item_code",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Settlement/Item Code Error",
        field:
          "bl_fi_internal_sales_return_import_file_helper.settlement_or_item_code_error",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Trade Tariff Code",
        field:
          "bl_fi_internal_sales_return_import_file_helper.trade_tariff_code",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Line Item Remarks",
        field:
          "bl_fi_internal_sales_return_import_file_helper.line_item_remarks",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Sales Agent Code",
        field:
          "bl_fi_internal_sales_return_import_file_helper.sales_agent_code",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Sales Agent Validation Error",
        field:
          "bl_fi_internal_sales_return_import_file_helper.sales_agent_error",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Branch Validation Error",
        field:
          "bl_fi_internal_sales_return_import_file_helper.branch_validate_error",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Location Validation Error",
        field:
          "bl_fi_internal_sales_return_import_file_helper.location_validate_error",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Transaction Number",
        field:
          "bl_fi_internal_sales_return_import_file_helper.transaction_no",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Transaction Date",
        field:
          "bl_fi_internal_sales_return_import_file_helper.txn_date",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Transaction Date Validation Error",
        field: "bl_fi_internal_sales_return_import_file_helper.txn_date_error",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Validity Days",
        field:
          "bl_fi_internal_sales_return_import_file_helper.validity_days",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Validity Days Error",
        field:
          "bl_fi_internal_sales_return_import_file_helper.validity_days_error",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Header Ref No",
        field:
          "bl_fi_internal_sales_return_import_file_helper.hdr_ref_no",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Header Ref No Validation Error",
        field:
          "bl_fi_internal_sales_return_import_file_helper.hdr_ref_no_error",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Credit Terms",
        field:
          "bl_fi_internal_sales_return_import_file_helper.credit_terms",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Credit Limit",
        field:
          "bl_fi_internal_sales_return_import_file_helper.credit_limit",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Header Description",
        field:
          "bl_fi_internal_sales_return_import_file_helper.hdr_description",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Header Remarks",
        field:
          "bl_fi_internal_sales_return_import_file_helper.hdr_remarks",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Currency",
        field:
          "bl_fi_internal_sales_return_import_file_helper.doc_currency",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Currency Validation Error",
        field:
          "bl_fi_internal_sales_return_import_file_helper.doc_currency_error",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Tracking ID",
        field:
          "bl_fi_internal_sales_return_import_file_helper.tracking_id",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Entity Validation Error",
        field:
          "bl_fi_internal_sales_return_import_file_helper.entity_validate_error",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Item Ref No",
        field: "bl_fi_internal_sales_return_import_file_helper.item_ref_no",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Txn Type",
        field:
          "bl_fi_internal_sales_return_import_file_helper.txn_type",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Txn Type Validation Error",
        field: "bl_fi_internal_sales_return_import_file_helper.txn_type_error",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Quantity",
        field: "bl_fi_internal_sales_return_import_file_helper.qty",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Quantity Validation Error",
        field: "bl_fi_internal_sales_return_import_file_helper.qty_error",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "UOM",
        field: "bl_fi_internal_sales_return_import_file_helper.uom",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Amount Including Tax",
        field: "bl_fi_internal_sales_return_import_file_helper.amount_incl_tax",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Unit Price Including Tax",
        field: "bl_fi_internal_sales_return_import_file_helper.unit_price_incl_tax",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Tax GST Code",
        field: "bl_fi_internal_sales_return_import_file_helper.tax_gst_code",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Tax GST PCT",
        field: "bl_fi_internal_sales_return_import_file_helper.tax_gst_pct",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Tax WHT Code",
        field: "bl_fi_internal_sales_return_import_file_helper.tax_wht_code",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Tax WHT PCT",
        field: "bl_fi_internal_sales_return_import_file_helper.tax_wht_pct",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Item Batch Number",
        field: "bl_fi_internal_sales_return_import_file_helper.item_batch_no",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Item Bin Number",
        field: "bl_fi_internal_sales_return_import_file_helper.item_bin_no",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Item Tracking ID",
        field: "bl_fi_internal_sales_return_import_file_helper.item_tracking_id",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Posting Status",
        field: "bl_fi_internal_sales_return_import_file_helper.posting_status",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Posting Status Error",
        field: "bl_fi_internal_sales_return_import_file_helper.posting_status_error",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Amount Validation Error",
        field: "bl_fi_internal_sales_return_import_file_helper.amount_error",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Txn GST Validation Error",
        field: "bl_fi_internal_sales_return_import_file_helper.tax_gst_error",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Txn WHT Validation Error",
        field: "bl_fi_internal_sales_return_import_file_helper.tax_wht_error",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Item Serial Number",
        field:
          "bl_fi_internal_sales_return_import_file_helper.item_serial_no",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Item Serial Number Validation Error",
        field:
          "bl_fi_internal_sales_return_import_file_helper.item_serial_no_error",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Contra Error",
        field: "bl_fi_internal_sales_return_import_file_helper.contra_error",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Short Error Message",
        field:
          "bl_fi_internal_sales_return_import_file_helper.short_error_message",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Error Message",
        field:
          "bl_fi_internal_sales_return_import_file_helper.error_stack_trace",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Entity Code",
        field: "bl_fi_internal_sales_return_import_file_helper.entity_code",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Entity Name",
        field: "bl_fi_internal_sales_return_import_file_helper.entity_name",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Entity ARAP Type",
        field: "bl_fi_internal_sales_return_import_file_helper.entity_arap_type",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Entity Type",
        field: "bl_fi_internal_sales_return_import_file_helper.entity_type",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Entity Phone",
        field: "bl_fi_internal_sales_return_import_file_helper.entity_phone",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Billing Name",
        field: "bl_fi_internal_sales_return_import_file_helper.billing_name",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Billing Email",
        field: "bl_fi_internal_sales_return_import_file_helper.billing_email",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Billing Phone",
        field: "bl_fi_internal_sales_return_import_file_helper.billing_phone",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Billing Address Line 1",
        field: "bl_fi_internal_sales_return_import_file_helper.billing_address_line_1",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Billing Address Line 2",
        field: "bl_fi_internal_sales_return_import_file_helper.billing_address_line_2",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Billing Address Line 3",
        field: "bl_fi_internal_sales_return_import_file_helper.billing_address_line_3",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Billing Address Line 4",
        field: "bl_fi_internal_sales_return_import_file_helper.billing_address_line_4",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Billing Address Line 5",
        field: "bl_fi_internal_sales_return_import_file_helper.billing_address_line_5",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Billing Country",
        field: "bl_fi_internal_sales_return_import_file_helper.billing_country",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Billing State",
        field: "bl_fi_internal_sales_return_import_file_helper.billing_state",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Billing City",
        field: "bl_fi_internal_sales_return_import_file_helper.billing_city",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Billing Postcode",
        field: "bl_fi_internal_sales_return_import_file_helper.billing_postcode",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Shipping Name",
        field: "bl_fi_internal_sales_return_import_file_helper.shipping_name",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Shipping Email",
        field: "bl_fi_internal_sales_return_import_file_helper.shipping_email",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Shipping Phone",
        field: "bl_fi_internal_sales_return_import_file_helper.shipping_phone",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Shipping Address Line 1",
        field: "bl_fi_internal_sales_return_import_file_helper.shipping_address_line_1",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Shipping Address Line 2",
        field: "bl_fi_internal_sales_return_import_file_helper.shipping_address_line_2",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Shipping Address Line 3",
        field: "bl_fi_internal_sales_return_import_file_helper.shipping_address_line_3",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Shipping Address Line 4",
        field: "bl_fi_internal_sales_return_import_file_helper.shipping_address_line_4",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Shipping Address Line 5",
        field: "bl_fi_internal_sales_return_import_file_helper.shipping_address_line_5",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Shipping Country",
        field: "bl_fi_internal_sales_return_import_file_helper.shipping_country",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Shipping State",
        field: "bl_fi_internal_sales_return_import_file_helper.shipping_state",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Shipping City",
        field: "bl_fi_internal_sales_return_import_file_helper.shipping_city",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Shipping Postcode",
        field: "bl_fi_internal_sales_return_import_file_helper.shipping_postcode",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "E-Return Entity Tax ID Number",
        field: "bl_fi_internal_sales_return_import_file_helper.entity_ereturn_tax_id_no",
        cellStyle: () => ({ "text-align": "left" }),
        width: 250,
        flex: 0,
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "E-Return Entity ID Type",
        field: "bl_fi_internal_sales_return_import_file_helper.entity_ereturn_id_type",
        cellStyle: () => ({ "text-align": "left" }),
        width: 250,
        flex: 0,
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "E-Return Entity ID Value",
        field: "bl_fi_internal_sales_return_import_file_helper.entity_ereturn_id_value",
        cellStyle: () => ({ "text-align": "left" }),
        width: 250,
        flex: 0,
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "E-Return Buyer TIN Number",
        field: "bl_fi_internal_sales_return_import_file_helper.ereturn_buyer_tin_no",
        cellStyle: () => ({ "text-align": "left" }),
        width: 250,
        flex: 0,
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "E-Return Buyer Entity ID Type",
        field: "bl_fi_internal_sales_return_import_file_helper.ereturn_buyer_entity_id_type",
        cellStyle: () => ({ "text-align": "left" }),
        width: 250,
        flex: 0,
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "E-Return Buyer ID Number",
        field: "bl_fi_internal_sales_return_import_file_helper.ereturn_buyer_id_no",
        cellStyle: () => ({ "text-align": "left" }),
        width: 250,
        flex: 0,
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "E-Return Buyer SST Number",
        field: "bl_fi_internal_sales_return_import_file_helper.ereturn_buyer_sst_no",
        cellStyle: () => ({ "text-align": "left" }),
        width: 250,
        flex: 0,
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "E-Return Buyer Name",
        field: "bl_fi_internal_sales_return_import_file_helper.ereturn_buyer_name",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "E-Return Buyer Email",
        field: "bl_fi_internal_sales_return_import_file_helper.ereturn_buyer_email",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "E-Return Buyer Phone",
        field: "bl_fi_internal_sales_return_import_file_helper.ereturn_buyer_phone",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "E-Return Buyer Address Line 1",
        field: "bl_fi_internal_sales_return_import_file_helper.ereturn_buyer_address_line_1",
        cellStyle: () => ({ "text-align": "left" }),
        width: 250,
        flex: 0,
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "E-Return Buyer Address Line 2",
        field: "bl_fi_internal_sales_return_import_file_helper.ereturn_buyer_address_line_2",
        cellStyle: () => ({ "text-align": "left" }),
        width: 250,
        flex: 0,
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "E-Return Buyer Address Line 3",
        field: "bl_fi_internal_sales_return_import_file_helper.ereturn_buyer_address_line_3",
        cellStyle: () => ({ "text-align": "left" }),
        width: 250,
        flex: 0,
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "E-Return Buyer Address Line 4",
        field: "bl_fi_internal_sales_return_import_file_helper.ereturn_buyer_address_line_4",
        cellStyle: () => ({ "text-align": "left" }),
        width: 250,
        flex: 0,
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "E-Return Buyer Address Line 5",
        field: "bl_fi_internal_sales_return_import_file_helper.ereturn_buyer_address_line_5",
        cellStyle: () => ({ "text-align": "left" }),
        width: 250,
        flex: 0,
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "E-Return Buyer Country",
        field: "bl_fi_internal_sales_return_import_file_helper.ereturn_buyer_country",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "E-Return Buyer State",
        field: "bl_fi_internal_sales_return_import_file_helper.ereturn_buyer_state",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "E-Return Buyer City",
        field: "bl_fi_internal_sales_return_import_file_helper.ereturn_buyer_city",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "E-Return Buyer Postcode",
        field: "bl_fi_internal_sales_return_import_file_helper.ereturn_buyer_postcode",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "E-Return Submission Type",
        field: "bl_fi_internal_sales_return_import_file_helper.ereturn_submission_type",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "E-Return Submission Type Error",
        field: "bl_fi_internal_sales_return_import_file_helper.ereturn_submission_type_error",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        width: 250,
        flex: 0,
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },

      {
        headerName: "E-return Billing Frequency",
        field: "bl_fi_internal_sales_return_import_file_helper.ereturn_billing_frequency",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },

      {
        headerName: "E-return Billing Period Start",
        field: "bl_fi_internal_sales_return_import_file_helper.ereturn_billing_period_start",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },

      {
        headerName: "E-return Billing Period End",
        field: "bl_fi_internal_sales_return_import_file_helper.ereturn_billing_period_end",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },

      {
        headerName: "Status",
        field: "bl_fi_internal_sales_return_import_file_helper.status",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Segment Code",
        field: "bl_fi_internal_sales_return_import_file_helper.segment_code",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Segment Code Error",
        field: "bl_fi_internal_sales_return_import_file_helper.segment_code_error",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "GL Dimension",
        field: "bl_fi_internal_sales_return_import_file_helper.gl_dimension_code",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "GL Dimension Error",
        field: "bl_fi_internal_sales_return_import_file_helper.gl_dimension_code_error",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Profit Centre",
        field: "bl_fi_internal_sales_return_import_file_helper.profit_centre_code",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Profit Centre Error",
        field: "bl_fi_internal_sales_return_import_file_helper.profit_centre_code_error",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Project Code",
        field: "bl_fi_internal_sales_return_import_file_helper.project_code",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Project Code Error",
        field: "bl_fi_internal_sales_return_import_file_helper.project_code_error",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Entity Branch",
        field: "bl_fi_internal_sales_return_import_file_helper.entity_branch_code",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Entity Branch Error",
        field: "bl_fi_internal_sales_return_import_file_helper.entity_branch_error",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "GL Code",
        field: "bl_fi_internal_sales_return_import_file_helper.gl_code",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "GL Code Error",
        field: "bl_fi_internal_sales_return_import_file_helper.gl_code_error",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "STL Amount",
        field: "bl_fi_internal_sales_return_import_file_helper.stl_amount",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "STL Remarks",
        field: "bl_fi_internal_sales_return_import_file_helper.stl_remarks",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Client Doc Type",
        field: "bl_fi_internal_sales_return_import_file_helper.client_doc_type",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Client Doc 1",
        field: "bl_fi_internal_sales_return_import_file_helper.client_doc_1",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Client Doc 2",
        field: "bl_fi_internal_sales_return_import_file_helper.client_doc_2",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Client Doc 3",
        field: "bl_fi_internal_sales_return_import_file_helper.client_doc_3",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Client Doc 4",
        field: "bl_fi_internal_sales_return_import_file_helper.client_doc_4",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Client Doc 5",
        field: "bl_fi_internal_sales_return_import_file_helper.client_doc_5",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: 'Line Client Doc 1',
        field: 'bl_fi_internal_sales_return_import_file_helper.line_client_doc_1',
        type: 'textColumn'
      },
      {
        headerName: "Validation Status",
        field: "bl_fi_internal_sales_return_import_file_helper.validation_status",
        cellStyle: () => ({ "text-align": "left" }),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
      {
        headerName: "Created Date",
        field: "bl_fi_internal_sales_return_import_file_helper.created_date",
        cellStyle: () => ({ "text-align": "left" }),
        valueFormatter: (params) => moment(params.value).format("YYYY-MM-DD"),
        filter: "agSetColumnFilter", // Use agSetColumnFilter for a dropdown filter
        filterParams: {
          applyMiniFilterWhileTyping: true,
        },
      },
    ];

    this.columnsDefs.forEach(col => {
      if (col.field.endsWith('_error') || col.headerName.endsWith('Error')) {
        col.cellStyle = () => ({
          "text-align": "left",
          "color": "red",
          "font-weight": "bold",
        });
      }
    });
  }

  ngOnInit() {
    this.toggleColumn$ = this.viewColFacade.toggleColumn$;

    this.localState$.subscribe((a) => {
      this.localState = a;
      this.componentStore.setState({ localState: a });
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.store.select(FileImportSelectors.selectfileImportGuid)
      .subscribe((data) => {
        this.fileGuid = data;
        this.store.dispatch(FileImportActions.loadFileImportErrorData({ fileImportHdrGuid: this.fileGuid }));
      }
    );
    this.store.select(FileImportSelectors.selectFileImportErrorData).subscribe((data) => {
      if (data) {
        this.rowData = data;
        this.gridApi.setRowData(this.rowData);
      }
    });
  }

  onFirstDataRendered(params) {
    UtilitiesModule.autoSizeAllColumns(params);
  }

  onSortChanged(e) {
    e.api.refreshCells();
  }

  onFilterChanged(e) {
    e.api.refreshCells();
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }
}
