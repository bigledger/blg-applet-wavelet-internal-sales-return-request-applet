import { Component, OnInit, ViewChild } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Store } from "@ngrx/store";
import { RowHeightParams } from "ag-grid-community";
import { UUID } from "angular2-uuid";
import {
  CustomerBranchLinkingService,
  GenericDocContainerModel,
  Pagination,
  ReturnBySerialNumbersService,
  bl_fi_generic_doc_line_RowClass,
  bl_fi_generic_doc_link_RowClass
} from "blg-akaun-ts-lib";
import { ToastrService } from "ngx-toastr";
import {
  pageFiltering,
  pageSorting,
} from "projects/shared-utilities/listing.utils";
import { SessionSelectors } from "projects/shared-utilities/modules/session/session-controller/selectors";
import { SessionStates } from "projects/shared-utilities/modules/session/session-controller/states";
import { PaginationComponent } from "projects/shared-utilities/utilities/pagination/pagination.component";
import { AppConfig } from "projects/shared-utilities/visa";
import { Observable } from "rxjs";
import { SubSink } from "subsink2";
import { ViewColumnFacade } from "../../../../../facades/view-column.facade";
import { AppletSettings } from "../../../../../models/applet-settings.model";
import { InternalSalesReturnStates } from "../../../../../state-controllers/internal-sales-return-controller/store/states";
import { SerialNumberCellRendererComponent } from "../../../../utilities/serial-number-cell-renderer/serial-number-cell-renderer.component";

interface LocalState {
  deactivateAdd: boolean;
  deactivateList: boolean;
  selectedRow: any;
}

@Component({
  selector: "app-search-by-serial-number",
  templateUrl: "./search-by-serial-number.component.html",
  styleUrls: ["./search-by-serial-number.component.css"],
})
export class SearchBySerialNumberComponent implements OnInit {
  protected subs = new SubSink();

  protected compName = "Serialized Line Listing";
  protected readonly index = 1;
  protected localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateAdd$ = this.componentStore.select(
    (state) => state.deactivateAdd
  );

  toggleColumn$: Observable<boolean>;
  // searchModel = salesInvoiceSearchModel;
  gridApi;
  SQLGuids: string[] = null;
  pagination = new Pagination();
  searchText: string;

  paymentVoucher$: Observable<GenericDocContainerModel[]>;

  defaultColDef = {
    filter: "agTextColumnFilter",
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true,
  };

  appletSettings: AppletSettings;

  masterSettings$ = this.sessionStore.select(
    SessionSelectors.selectMasterSettings
  );

  columnsDefs = [
    {
      headerName: "Company Code",
      field: "bl_fi_generic_doc_hdr.code_company",
      cellStyle: () => ({ "text-align": "left" }),
      floatingFilter: true,
      checkboxSelection: true,
    },
    {
      headerName: "Branch Code",
      field: "bl_fi_generic_doc_hdr.code_branch",
      cellStyle: () => ({ "text-align": "left" }),
      floatingFilter: true,
    },
    {
      headerName: "Customer",
      field: "bl_fi_generic_doc_hdr.doc_entity_hdr_json",
      cellStyle: () => ({ "text-align": "left" }),
      floatingFilter: true,
      valueGetter: (p) => {
        return (
          p.data.bl_fi_generic_doc_hdr.doc_entity_hdr_json["entityName"] +
          " - " +
          p.data.bl_fi_generic_doc_hdr.doc_entity_hdr_json["phoneNumber"] +
          " - " +
          p.data.bl_fi_generic_doc_hdr.doc_entity_hdr_json["email"] +
          " - " +
          p.data.bl_fi_generic_doc_hdr.doc_entity_hdr_json["entityId"]
        );
      },
    },
    {
      headerName: "Item Code",
      field: "bl_fi_generic_doc_line.item_code",
      cellStyle: () => ({ "text-align": "left" }),
      floatingFilter: true,
    },
    {
      headerName: "Item Name",
      field: "bl_fi_generic_doc_line.item_name",
      cellStyle: () => ({ "text-align": "left" }),
      floatingFilter: true,
    },
    {
      headerName: "Base Qty",
      field: "bl_fi_generic_doc_line.quantity_base",
      type: "numericColumn",
      cellStyle: () => ({ "text-align": "left" }),
      floatingFilter: true,
    },
    {
      headerName: "Previous Returned Qty",
      field: "previous_returned_qty",
      type: "numericColumn",
      cellStyle: () => ({ "text-align": "left" }),
      floatingFilter: true,
    },
    {
      headerName: "Previous Sales Return",
      field: "bl_fi_generic_doc_hdr_previous_sales_return",
      cellStyle: () => ({ "text-align": "left" }),
      floatingFilter: true,
      valueGetter: (p) => {
        if (p.data.bl_fi_generic_doc_hdr_previous_sales_return.length === 0) {
          return "";
        } else {
          let serverDocs: string[] = [];
          p.data.bl_fi_generic_doc_hdr_previous_sales_return.forEach(
            (record) => {
              serverDocs.push(record.server_doc_1);
            }
          );
          return serverDocs;
        }
      },
    },
    {
      headerName: "Return Qty",
      field: "serialNumbersToBeReturnedLength",
      type: "numericColumn",
      cellStyle: () => ({ "text-align": "right" }),
      floatingFilter: true,
      editable: true,
    },
    {
      headerName: "Return Price",
      field: "returnPrice",
      type: "numericColumn",
      cellStyle: () => ({ "text-align": "right" }),
      floatingFilter: true,
      editable: true,
      valueGetter: (params) => {
        // Return the returnPrice if it exists, otherwise default to unit_price_txn
        return params.data.returnPrice != null
          ? params.data.returnPrice
          : params.data.bl_fi_generic_doc_line.unit_price_txn;
      },
      valueSetter: (params) => {
        // Update the returnPrice with the new value
        params.data.returnPrice = params.newValue;
        return true; // Return true to indicate the value has been successfully updated
      },
    },
    {
      headerName: "Price",
      field: "bl_fi_generic_doc_line.unit_price_txn",
      cellStyle: () => ({ "text-align": "right" }),
      floatingFilter: true,
    },
    {
      headerName: "Serial",
      cellRenderer: "serialNumberCellRenderer",
      field: "return_serial_no",
      cellStyle: () => ({ "text-align": "left" }),
    },
  ];

  @ViewChild(PaginationComponent)
  paginationComp: PaginationComponent;
  serialNumber: string[] = [];

  frameworkComponents = {
    serialNumberCellRenderer: SerialNumberCellRendererComponent,
  };

  constructor(
    protected readonly sessionStore: Store<SessionStates>,
    private customerBranchLinkingService: CustomerBranchLinkingService,
    private viewColFacade: ViewColumnFacade,
    private returnBySerialNumbersService: ReturnBySerialNumbersService,
    private readonly store: Store<InternalSalesReturnStates>,
    private toastr: ToastrService,
    private readonly componentStore: ComponentStore<LocalState>
  ) {}

  ngOnInit() {
    this.toggleColumn$ = this.viewColFacade.toggleColumn$;
    this.subs.sink = this.localState$.subscribe((a) => {
      this.localState = a;
      this.componentStore.setState(a);
    });

    this.subs.sink = this.masterSettings$.subscribe({
      next: (resolve: AppletSettings) => {
        this.appletSettings = resolve;
      },
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.setGridData();
  }

  setGridData() {
    const apiVisa = AppConfig.apiVisa;
    const datasource = {
      getRows: (grid) => {
        const filter = pageFiltering(grid.request.filterModel);
        const sortOn = pageSorting(grid.request.sortModel);

        let dto = { invoice_guids: [""], serial_numbers: this.serialNumber };
        this.subs.sink = this.returnBySerialNumbersService
          .getLines(dto, apiVisa)
          .subscribe(
            (resolved) => {
              const data = sortOn(resolved.data).filter((entity) =>
                filter.by(entity)
              );
              const totalRecords = filter.isFiltering
                ? resolved.data.length
                : data.length;
              grid.success({
                rowData: data,
                rowCount: totalRecords,
              });
            },
            (err) => {
              grid.fail();
            }
          );
      },
    };
    this.gridApi.setServerSideDatasource(datasource);
  }

  onToggle(e: boolean) {
    this.viewColFacade.toggleColumn(e);
  }

  onSearch(searchText: any) {
    if (this.searchText === null || this.searchText === "") {
      this.setGridData();
      this.serialNumber = [];
    } else {
      this.serialNumber.push(searchText);
      this.setGridData();
    }
  }

  onAddToSalesReturn() {
    if (this.appletSettings.ENABLE_BRANCH_FILTER === true) {
      const selectedData = this.gridApi.getSelectedRows();

      selectedData.forEach((record) => {
        let hdr = new GenericDocContainerModel();
        hdr.bl_fi_generic_doc_hdr = record.bl_fi_generic_doc_hdr;

        const line = new bl_fi_generic_doc_line_RowClass();
        line.guid = UUID.UUID().toLowerCase();

        let unitDiscount =
          record.bl_fi_generic_doc_line.amount_discount /
          record.bl_fi_generic_doc_line.quantity_base;

        line.item_guid = record.bl_fi_generic_doc_line.item_guid;
        line.item_code = record.bl_fi_generic_doc_line.item_code;
        line.item_name = record.bl_fi_generic_doc_line.item_name;
        line.quantity_base = +record.serialNumbersToBeReturnedLength;
        record.bl_fi_generic_doc_line.unit_price_std = record.returnPrice
          ? +record.returnPrice
          : record.bl_fi_generic_doc_line.unit_price_std;
        line.amount_std = <any>(
          (record.bl_fi_generic_doc_line.unit_price_std *
            +record.serialNumbersToBeReturnedLength)
        );
        line.amount_discount = <any>(
          (unitDiscount * +record.serialNumbersToBeReturnedLength)
        );
        line.amount_net = <any>(+line.amount_std - +line.amount_discount);
        line.tax_gst_code = record.bl_fi_generic_doc_line.tax_gst_code;
        line.tax_gst_rate = record.bl_fi_generic_doc_line.tax_gst_rate;
        line.tax_gst_type = record.bl_fi_generic_doc_line.tax_gst_type;
        line.amount_tax_gst = <any>(+line.amount_net * +line.tax_gst_rate);
        line.tax_wht_code = record.bl_fi_generic_doc_line.tax_wht_code;
        line.tax_wht_rate = record.bl_fi_generic_doc_line.tax_wht_rate;
        line.amount_tax_wht = <any>(+line.amount_net * +line.tax_wht_rate);
        line.amount_txn = <any>(
          (+line.amount_net + +line.amount_tax_gst - +line.amount_tax_wht)
        );
        line.item_remarks = record.bl_fi_generic_doc_line.item_remarks;
        line.item_txn_type = record.bl_fi_generic_doc_line.item_txn_type;
        line.item_sub_type = record.bl_fi_generic_doc_line.item_sub_type;
        line.guid_dimension = record.bl_fi_generic_doc_line.guid_dimension;
        line.guid_profit_center =
          record.bl_fi_generic_doc_line.guid_profit_center;
        line.guid_project = record.bl_fi_generic_doc_line.guid_project;
        line.guid_segment = record.bl_fi_generic_doc_line.guid_segment;
        line.item_property_json =
          record.bl_fi_generic_doc_line.item_property_json;
        // line.line_property_json = <any>{ delivery_instructions: { ...this.itemDetails.delivery.form.value } };
        line.unit_price_std = record.bl_fi_generic_doc_line.unit_price_std;
        line.unit_price_txn = <any>(+line.amount_txn / +line.quantity_base);
        line.uom = record.bl_fi_generic_doc_line.uom;
        line.uom_to_base_ratio =
          record.bl_fi_generic_doc_line.uom_to_base_ratio;
        line.qty_by_uom =
          +record.serialNumbersToBeReturnedLength /
          +record.bl_fi_generic_doc_line.uom_to_base_ratio;
        line.unit_price_std_by_uom =
          +line.unit_price_std * +line.uom_to_base_ratio;
        line.unit_price_txn_by_uom = <any>(
          this.round(
            +line.amount_txn / (+line.uom_to_base_ratio * +line.quantity_base),
            2
          )
        );
        line.unit_disc_by_uom = <any>(
          (unitDiscount * record.bl_fi_generic_doc_line.uom_to_base_ratio)
        );
        line.txn_type = "PNS";
        line.quantity_signum = 1;
        line.amount_signum = -1;
        line.server_doc_type = "INTERNAL_SALES_RETURN";
        line.client_doc_type = "INTERNAL_SALES_RETURN";
        line.date_txn = new Date();
        line.status = "ACTIVE";
        line.serial_no = <any>{
          serialNumbers: record.serialNumbersToBeReturned,
        };
        line.unit_price_net =
          +line.unit_price_std - +line.amount_discount / +line.quantity_base;
        line.delivery_branch_guid =
          record.bl_fi_generic_doc_line.delivery_branch_guid;
        line.delivery_branch_code =
          record.bl_fi_generic_doc_line.delivery_branch_code;
        line.delivery_location_guid =
          record.bl_fi_generic_doc_line.delivery_location_guid;
        line.delivery_location_code =
          record.bl_fi_generic_doc_line.delivery_location_code;
        line.sales_entity_hdr_guid =
          record.bl_fi_generic_doc_line.sales_entity_hdr_guid;
        line.sales_entity_hdr_name =
          record.bl_fi_generic_doc_line.sales_entity_hdr_name;
        line.sales_entity_hdr_code =
          record.bl_fi_generic_doc_line.sales_entity_hdr_code;
        // Add gen_doc_link here - item type means it is off an existing order
        const link = new bl_fi_generic_doc_link_RowClass();
        link.guid_doc_2_line = line.guid;
        link.guid_doc_1_hdr = record.bl_fi_generic_doc_hdr.guid;
        link.guid_doc_1_line = record.bl_fi_generic_doc_line.guid;
        link.server_doc_type_doc_1_hdr = "INTERNAL_SALES_INVOICE";
        link.server_doc_type_doc_1_line = "INTERNAL_SALES_INVOICE";
        link.server_doc_type_doc_2_hdr = "INTERNAL_SALES_RETURN";
        link.server_doc_type_doc_2_line = "INTERNAL_SALES_RETURN";
        link.txn_type = "RETURN";
        link.quantity_signum = 1;
        link.quantity_contra = line.quantity_base;
        link.date_txn = new Date();
        link.status = "DRAFT";

        if (
          record.serialNumbersToBeReturnedLength === null ||
          record.serialNumbersToBeReturnedLength === undefined
        ) {
          this.toastr.error("Please Enter Return Qty", "Error", {
            tapToDismiss: true,
            progressBar: true,
            timeOut: 1300,
          });
        } else {
          let pagination = new Pagination();
          pagination.conditionalCriteria.push({
            columnName: "branch_guid",
            operator: "=",
            value: hdr.bl_fi_generic_doc_hdr.guid_branch.toString(),
          });
          pagination.conditionalCriteria.push({
            columnName: "customer_hdr_guid",
            operator: "=",
            value: hdr.bl_fi_generic_doc_hdr.doc_entity_hdr_guid.toString(),
          });

          this.subs.sink = this.customerBranchLinkingService
            .getByCriteria(pagination, AppConfig.apiVisa)
            .subscribe((response) => {
              if (response.data.length > 0) {
                if (this.appletSettings?.WARN_EXCESS_RETURN_QUANTITY) {
                  if (
                    (+record.serialNumbersToBeReturnedLength || 0) +
                      (+record.previous_returned_qty || 0) <=
                    +record.bl_fi_generic_doc_line.quantity_base
                  ) {
                    this.viewColFacade.updateMainOnKOImport(hdr);
                    this.viewColFacade.addLink(link);

                    this.viewColFacade.addLineItem(line, "create");
                  } else {
                    this.toastr.error(
                      "Total return quantity is greater that the invoice qty",
                      "Error",
                      {
                        tapToDismiss: true,
                        progressBar: true,
                        timeOut: 2000,
                      }
                    );
                  }
                } else {
                  this.viewColFacade.updateMainOnKOImport(hdr);
                  this.viewColFacade.addLink(link);

                  this.viewColFacade.addLineItem(line, "create");
                }
              } else {
                this.toastr.error("Customer not linked to branch", "Error", {
                  tapToDismiss: true,
                  progressBar: true,
                  timeOut: 2000,
                });
              }
            });
        }
      });
    } else {
      const selectedData = this.gridApi.getSelectedRows();

      selectedData.forEach((record) => {
        let hdr = new GenericDocContainerModel();
        hdr.bl_fi_generic_doc_hdr = record.bl_fi_generic_doc_hdr;

        const line = new bl_fi_generic_doc_line_RowClass();
        line.guid = UUID.UUID().toLowerCase();

        let unitDiscount =
          record.bl_fi_generic_doc_line.amount_discount /
          record.bl_fi_generic_doc_line.quantity_base;

        line.item_guid = record.bl_fi_generic_doc_line.item_guid;
        line.item_code = record.bl_fi_generic_doc_line.item_code;
        line.item_name = record.bl_fi_generic_doc_line.item_name;
        line.quantity_base = +record.serialNumbersToBeReturnedLength;
        record.bl_fi_generic_doc_line.unit_price_std = record.returnPrice
          ? +record.returnPrice
          : record.bl_fi_generic_doc_line.unit_price_std;
        line.amount_std = <any>(
          (record.bl_fi_generic_doc_line.unit_price_std *
            +record.serialNumbersToBeReturnedLength)
        );
        line.amount_discount = <any>(
          (unitDiscount * +record.serialNumbersToBeReturnedLength)
        );
        line.amount_net = <any>(+line.amount_std - +line.amount_discount);
        line.tax_gst_code = record.bl_fi_generic_doc_line.tax_gst_code;
        line.tax_gst_rate = record.bl_fi_generic_doc_line.tax_gst_rate;
        line.tax_gst_type = record.bl_fi_generic_doc_line.tax_gst_type;
        line.amount_tax_gst = <any>(+line.amount_net * +line.tax_gst_rate);
        line.tax_wht_code = record.bl_fi_generic_doc_line.tax_wht_code;
        line.tax_wht_rate = record.bl_fi_generic_doc_line.tax_wht_rate;
        line.amount_tax_wht = <any>(+line.amount_net * +line.tax_wht_rate);
        line.amount_txn = <any>(
          (+line.amount_net + +line.amount_tax_gst - +line.amount_tax_wht)
        );
        line.item_remarks = record.bl_fi_generic_doc_line.item_remarks;
        line.item_txn_type = record.bl_fi_generic_doc_line.item_txn_type;
        line.item_sub_type = record.bl_fi_generic_doc_line.item_sub_type;
        line.guid_dimension = record.bl_fi_generic_doc_line.guid_dimension;
        line.guid_profit_center =
          record.bl_fi_generic_doc_line.guid_profit_center;
        line.guid_project = record.bl_fi_generic_doc_line.guid_project;
        line.guid_segment = record.bl_fi_generic_doc_line.guid_segment;
        line.item_property_json =
          record.bl_fi_generic_doc_line.item_property_json;
        // line.line_property_json = <any>{ delivery_instructions: { ...this.itemDetails.delivery.form.value } };
        line.unit_price_std = record.bl_fi_generic_doc_line.unit_price_std;
        line.unit_price_txn = <any>(+line.amount_txn / +line.quantity_base);
        line.uom = record.bl_fi_generic_doc_line.uom;
        line.uom_to_base_ratio =
          record.bl_fi_generic_doc_line.uom_to_base_ratio;
        line.qty_by_uom =
          +record.serialNumbersToBeReturnedLength /
          +record.bl_fi_generic_doc_line.uom_to_base_ratio;
        line.unit_price_std_by_uom =
          +line.unit_price_std * +line.uom_to_base_ratio;
        line.unit_price_txn_by_uom = <any>(
          this.round(
            +line.amount_txn / (+line.uom_to_base_ratio * +line.quantity_base),
            2
          )
        );
        line.unit_disc_by_uom = <any>(
          (unitDiscount * record.bl_fi_generic_doc_line.uom_to_base_ratio)
        );
        line.txn_type = "PNS";
        line.quantity_signum = 1;
        line.amount_signum = -1;
        line.server_doc_type = "INTERNAL_SALES_RETURN";
        line.client_doc_type = "INTERNAL_SALES_RETURN";
        line.date_txn = new Date();
        line.status = "ACTIVE";
        line.serial_no = <any>{
          serialNumbers: record.serialNumbersToBeReturned,
        };
        line.unit_price_net =
          +line.unit_price_std - +line.amount_discount / +line.quantity_base;
        line.delivery_branch_guid =
          record.bl_fi_generic_doc_line.delivery_branch_guid;
        line.delivery_branch_code =
          record.bl_fi_generic_doc_line.delivery_branch_code;
        line.delivery_location_guid =
          record.bl_fi_generic_doc_line.delivery_location_guid;
        line.delivery_location_code =
          record.bl_fi_generic_doc_line.delivery_location_code;

        // Add gen_doc_link here - item type means it is off an existing order
        const link = new bl_fi_generic_doc_link_RowClass();
        link.guid_doc_2_line = line.guid;
        link.guid_doc_1_hdr = record.bl_fi_generic_doc_hdr.guid;
        link.guid_doc_1_line = record.bl_fi_generic_doc_line.guid;
        link.server_doc_type_doc_1_hdr = "INTERNAL_SALES_INVOICE";
        link.server_doc_type_doc_1_line = "INTERNAL_SALES_INVOICE";
        link.server_doc_type_doc_2_hdr = "INTERNAL_SALES_RETURN";
        link.server_doc_type_doc_2_line = "INTERNAL_SALES_RETURN";
        link.txn_type = "RETURN";
        link.quantity_signum = 1;
        link.quantity_contra = line.quantity_base;
        link.date_txn = new Date();
        link.status = "DRAFT";

        if (
          record.serialNumbersToBeReturnedLength === null ||
          record.serialNumbersToBeReturnedLength === undefined
        ) {
          this.toastr.error("Please Enter Return Qty", "Error", {
            tapToDismiss: true,
            progressBar: true,
            timeOut: 1300,
          });
        } else {
          if (this.appletSettings?.WARN_EXCESS_RETURN_QUANTITY) {
            if (
              (+record.serialNumbersToBeReturnedLength || 0) +
                (+record.previous_returned_qty || 0) <=
              +record.bl_fi_generic_doc_line.quantity_base
            ) {
              this.viewColFacade.updateMainOnKOImport(hdr);
              this.viewColFacade.addLink(link);

              this.viewColFacade.addLineItem(line, "create");
            } else {
              this.toastr.error(
                "Total return quantity is greater that the invoice qty",
                "Error",
                {
                  tapToDismiss: true,
                  progressBar: true,
                  timeOut: 2000,
                }
              );
            }
          } else {
            this.viewColFacade.updateMainOnKOImport(hdr);
            this.viewColFacade.addLink(link);

            this.viewColFacade.addLineItem(line, "create");
          }
        }
      });
    }
  }

  round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  onReset() {
    this.searchText = null;
  }

  getRowHeight(params: RowHeightParams) {
    if (params.data?.return_serial_no.length) {
      const rowHeight = +params.data.return_serial_no.length * 60;
      return rowHeight;
    }
  }

  onRowClicked(entity: GenericDocContainerModel) {}

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
