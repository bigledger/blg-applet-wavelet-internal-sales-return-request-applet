import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Store } from "@ngrx/store";
import { RowHeightParams } from "ag-grid-enterprise";
import { UUID } from "angular2-uuid";
import {
  CustomerBranchLinkingService,
  GenericDocContainerModel,
  Pagination,
  ReturnSalesInvoiceService,
  bl_fi_generic_doc_line_RowClass,
  bl_fi_generic_doc_link_RowClass,
  SalesInvoiceService,
  InternalSalesCashbillService
} from "blg-akaun-ts-lib";
import { ToastrService } from "ngx-toastr";
import {
  pageFiltering,
  pageSorting,
} from "projects/shared-utilities/listing.utils";
import { SessionSelectors } from "projects/shared-utilities/modules/session/session-controller/selectors";
import { SessionStates } from "projects/shared-utilities/modules/session/session-controller/states";
import { PaginationClientSideComponent } from "projects/shared-utilities/utilities/pagination-client-side/pagination-client-side.component";
import { ViewColumnComponent } from "projects/shared-utilities/view-column.component";
import { AppConfig } from "projects/shared-utilities/visa";
import { AppletSettings } from "projects/wavelet-erp/applets/internal-sales-return-applet/src/app/models/applet-settings.model";
import { PNSActions } from "projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/draft-controller/store/actions";
import { DraftStates } from "projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/draft-controller/store/states";
import { Observable } from "rxjs";
import { SubSink } from "subsink2";
import { ViewColumnFacade } from "../../../../../../../facades/view-column.facade";
import { AppletConstants } from "../../../../../../../models/constants/applet-constants";
import { InternalSalesReturnSelectors } from "../../../../../../../state-controllers/internal-sales-return-controller/store/selectors";
import { InternalSalesReturnStates } from "../../../../../../../state-controllers/internal-sales-return-controller/store/states";
import { InternalSalesReturnActions } from "../../../../../../../state-controllers/internal-sales-return-controller/store/actions";
import { SerialNumberCellRendererComponent } from "../../../../../../utilities/serial-number-cell-renderer/serial-number-cell-renderer.component";
interface LocalState {
  deactivateAdd: boolean;
  deactivateList: boolean;
  selectedRow: any;
}

@Component({
  selector: "app-invoice-line-listing",
  templateUrl: "./invoice-line-listing.component.html",
  styleUrls: ["./invoice-line-listing.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore],
})
export class CustomerInvoiceLineListingComponent extends ViewColumnComponent {
  protected subs = new SubSink();

  protected compName = "Invoice Line Listing";
  protected readonly index = 43;
  protected localState: LocalState;
  protected prevLocalState: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateAdd$ = this.componentStore.select(
    (state) => state.deactivateAdd
  );
  prevIndex: number;
  toggleColumn$: Observable<boolean>;
  gridApi;
  SQLGuids: string[] = null;
  pagination = new Pagination();

  cellRules = {
    "rag-red": (params) => {
      console.log('cellRules', params)
      if (params.value === undefined) {
        return true;
      } else {
        return false;
      }
    },
  };

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
      headerName: "Item Code",
      field: "source_gen_doc_line.item_code",
      cellStyle: () => ({ "text-align": "left" }),
      floatingFilter: true,
      checkboxSelection: true,
    },
    {
      headerName: "Item Name",
      field: "source_gen_doc_line.item_name",
      cellStyle: () => ({ "text-align": "left" }),
      floatingFilter: true,
    },
    {
      headerName: "Base Qty",
      field: "source_gen_doc_line.quantity_base",
      type: "numericColumn",
      cellStyle: () => ({ "text-align": "right" }),
      floatingFilter: true,
    },
    {
      headerName: "Previous Returned Qty",
      field: "target_gen_doc_line_qty",
      type: "numericColumn",
      cellStyle: () => ({ "text-align": "right" }),
      floatingFilter: true,
    },
    {
      headerName: "Previous Sales Return",
      field: "target_server_doc1s",
      cellStyle: () => ({ "text-align": "right" }),
      floatingFilter: true
    },
    {
      headerName: "Return Qty",
      field: "serialNumbersToBeReturnedLength",
      type: "numericColumn",
      // cellStyle: () => ({ "text-align": "right" }),
      floatingFilter: true,
      editable: true,
      cellStyle: () => ({ "text-align": "right" }),
      cellClassRules: this.cellRules,
    },
    /* {
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
    }, */
    {
      headerName: "Price",
      field: "source_gen_doc_line.unit_price_txn",
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

  @ViewChild(PaginationClientSideComponent)
  paginationComp: PaginationClientSideComponent;
  invoiceGuid: string;

  frameworkComponents = {
    serialNumberCellRenderer: SerialNumberCellRendererComponent,
  };
  docType;
  constructor(
    private readonly draftStore: Store<DraftStates>,
    protected readonly sessionStore: Store<SessionStates>,
    private customerBranchLinkingService: CustomerBranchLinkingService,
    private viewColFacade: ViewColumnFacade,
    private readonly store: Store<InternalSalesReturnStates>,
    private readonly componentStore: ComponentStore<LocalState>,
    private returnSalesInvoiceService: ReturnSalesInvoiceService,
    private toastr: ToastrService,
    private salesInvoiceService: SalesInvoiceService,
    private salesCashbillService: InternalSalesCashbillService
  ) {
    super();
  }

  ngOnInit() {
    this.toggleColumn$ = this.viewColFacade.toggleColumn$;
    this.subs.sink = this.localState$.subscribe((a) => {
      this.docType = a.docType;
      this.localState = a;
      this.componentStore.setState(a);
    });

    this.subs.sink = this.store
      .select(InternalSalesReturnSelectors.selectInvoiceForSalesReturn)
      .subscribe((response) => {
        this.invoiceGuid = response;
      });

    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(
      (resolve) => (this.prevIndex = resolve)
    );
    this.subs.sink = this.viewColFacade
      .prevLocalState$()
      .subscribe((resolve) => (this.prevLocalState = resolve));

    this.subs.sink = this.masterSettings$.subscribe({
      next: (resolve: AppletSettings) => {
        this.appletSettings = resolve;
      },
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    if(this.docType==='INTERNAL_SALES_CASHBILL'){
      this. setGridDataCashbill();
    }else{
      this.setGridData();
    }
  }

  setGridData() {
    const apiVisa = AppConfig.apiVisa;
    const datasource = {
      getRows: (grid) => {
        const filter = pageFiltering(grid.request.filterModel);
        const sortOn = pageSorting(grid.request.sortModel);
        let dto = {
          generic_doc_hdr_guids: [this.invoiceGuid],
          server_doc_type_2: AppletConstants.docType,
        };
        this.subs.sink = this.salesInvoiceService
          .getOutstandingItems(dto, apiVisa)
          .subscribe(
            (resolved: any) => {
              resolved.data = resolved.data.map((record) => {
                const serverDocList = record.target_gen_doc_hdr
                ? record.target_gen_doc_hdr.map((hdr) => hdr.server_doc_1).join(", ")
                : "";

                if (
                  record.source_gen_doc_line?.item_sub_type === "SERIAL_NUMBER"
                ) {
                  let extractedSerialNumbers = [];
                  if (record.gen_doc_links) {
                    record.gen_doc_links.forEach((link) => {
                      if (link.serial_no?.serialNumbers) {
                        extractedSerialNumbers.push(
                          ...link.serial_no.serialNumbers
                        );
                      }
                    });
                  }

                  const sourceSerialNumbers =
                    record.source_gen_doc_line.serial_no?.serialNumbers || [];

                  const uniqueSerialNumbers = sourceSerialNumbers.filter(
                    (serial) => !extractedSerialNumbers.includes(serial)
                  );

                  console.log(
                    "serialNumbers",
                    record.source_gen_doc_line.serial_no?.serialNumbers
                  );

                  return {
                    ...record,
                    return_serial_no: uniqueSerialNumbers,
                    target_server_doc1s: serverDocList,
                  };
                }

                return {
                  ...record,
                  return_serial_no: [],
                  target_server_doc1s: serverDocList,
                };
              });
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

  setGridDataCashbill() {
    const apiVisa = AppConfig.apiVisa;
    const datasource = {
      getRows: (grid) => {
        const filter = pageFiltering(grid.request.filterModel);
        const sortOn = pageSorting(grid.request.sortModel);
        let dto = {
          generic_doc_hdr_guids: [this.invoiceGuid],
          server_doc_type_2: AppletConstants.docType,
        };
        this.subs.sink = this.salesCashbillService
          .getOutstandingItems(dto, apiVisa)
          .subscribe(
            (resolved: any) => {
              resolved.data = resolved.data.map((record) => {
                const serverDocList = record.target_gen_doc_hdr
                ? record.target_gen_doc_hdr.map((hdr) => hdr.server_doc_1).join(", ")
                : "";

                if (
                  record.source_gen_doc_line?.item_sub_type === "SERIAL_NUMBER"
                ) {
                  let extractedSerialNumbers = [];
                  if (record.gen_doc_links) {
                    record.gen_doc_links.forEach((link) => {
                      if (link.serial_no?.serialNumbers) {
                        extractedSerialNumbers.push(
                          ...link.serial_no.serialNumbers
                        );
                      }
                    });
                  }

                  const sourceSerialNumbers =
                    record.source_gen_doc_line.serial_no?.serialNumbers || [];

                  const uniqueSerialNumbers = sourceSerialNumbers.filter(
                    (serial) => !extractedSerialNumbers.includes(serial)
                  );

                  console.log(
                    "serialNumbers",
                    record.source_gen_doc_line.serial_no?.serialNumbers
                  );

                  return {
                    ...record,
                    return_serial_no: uniqueSerialNumbers,
                    target_server_doc1s: serverDocList,
                  };
                }

                return {
                  ...record,
                  return_serial_no: [],
                  target_server_doc1s: serverDocList,
                };
              });
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

  getRowHeight(params: RowHeightParams) {
    if (params.data?.return_serial_no.length) {
      const rowHeight = +params.data.return_serial_no.length * 60;
      return rowHeight;
    }
  }

  onReturn() {
    this.viewColFacade.updateInstance<LocalState>(this.prevIndex, {
      ...this.prevLocalState,
      deactivateReturn: false,
      deactivateAdd: false,
      deactivateList: false,
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  onReturnToMain() {
    this.viewColFacade.updateInstance<LocalState>(this.prevIndex, {
      ...this.prevLocalState,
      deactivateReturn: false,
      deactivateAdd: false,
      deactivateList: false,
    });
    this.viewColFacade.onPrev(this.prevIndex);

    this.viewColFacade.updateInstance<LocalState>(this.prevIndex, {
      ...this.prevLocalState,
      deactivateReturn: false,
      deactivateAdd: false,
      deactivateList: false,
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  onToggle(e: boolean) {
    this.viewColFacade.toggleColumn(e);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onAddToSalesReturn() {
    const selectedData = this.gridApi.getSelectedRows();

    if(!selectedData.length){
      this.toastr.error("Please select an item to return", "Error", {
        tapToDismiss: true,
        progressBar: true,
        timeOut: 1300,
      });
      return;
    }
    const totalOutstanding = selectedData.reduce(
      (sum, record) => sum + (record.outstanding_source_gen_doc_line_qty || 0),
      0
    );

    if (totalOutstanding === 0) {
      this.toastr.error("No more outstanding items to return", "Error", {
        tapToDismiss: true,
        progressBar: true,
        timeOut: 1300,
      });
      return;
    }
    const hasInvalidRecord = selectedData.some((record) => {
      if (
        record.serialNumbersToBeReturnedLength === null ||
        record.serialNumbersToBeReturnedLength === undefined
      ) {
        this.toastr.error("Please Enter Return Qty", "Error", {
          tapToDismiss: true,
          progressBar: true,
          timeOut: 1300,
        });
        return true;
      }
      return false;
    });

    if (hasInvalidRecord) {
      return;
    }
    this.store.dispatch(InternalSalesReturnActions.updateKOStatus({ status:"IN_PROGRESS" }));
    if (this.appletSettings.ENABLE_BRANCH_FILTER === true) {
      let hasSerialError = false;
      selectedData.forEach((record) => {
        if (
          record.source_gen_doc_line.item_sub_type === "SERIAL_NUMBER" &&
          !record.serialNumbersToBeReturned
        ) {
          hasSerialError = true;
        }
      });
      if (hasSerialError) {
        this.toastr.error("Please Select Serial Number", "Error", {
          tapToDismiss: true,
          progressBar: true,
          timeOut: 1300,
        });
        return;
      } else {
        selectedData.forEach((record) => {
          let hdr = new GenericDocContainerModel();
          const line = new bl_fi_generic_doc_line_RowClass();

          line.guid = UUID.UUID().toLowerCase();

          hdr.bl_fi_generic_doc_hdr = record.source_gen_doc_hdr;

          let unitDiscount =
            record.source_gen_doc_line.amount_discount /
            record.source_gen_doc_line.quantity_base;

          line.item_guid = record.source_gen_doc_line.item_guid;
          line.item_code = record.source_gen_doc_line.item_code;
          line.item_name = record.source_gen_doc_line.item_name;
          line.quantity_base = +record.serialNumbersToBeReturnedLength;
          record.source_gen_doc_line.unit_price_std = record.returnPrice
            ? +record.returnPrice
            : record.source_gen_doc_line.unit_price_std;
          line.amount_std = <any>(
            (record.source_gen_doc_line.unit_price_std *
              +record.serialNumbersToBeReturnedLength)
          );
          line.amount_discount = <any>(
            (unitDiscount * +record.serialNumbersToBeReturnedLength)
          );
          line.amount_net = <any>(+line.amount_std - +line.amount_discount);
          line.tax_gst_code = record.source_gen_doc_line.tax_gst_code;
          line.tax_gst_rate = record.source_gen_doc_line.tax_gst_rate;
          line.tax_gst_type = record.source_gen_doc_line.tax_gst_type;
          line.amount_tax_gst = <any>(+line.amount_net * +line.tax_gst_rate);
          line.tax_wht_code = record.source_gen_doc_line.tax_wht_code;
          line.tax_wht_rate = record.source_gen_doc_line.tax_wht_rate;
          line.amount_tax_wht = <any>(+line.amount_net * +line.tax_wht_rate);
          line.amount_txn = <any>(
            (+line.amount_net + +line.amount_tax_gst - +line.amount_tax_wht)
          );
          line.item_remarks = record.source_gen_doc_line.item_remarks;
          line.item_txn_type = record.source_gen_doc_line.item_txn_type;
          line.item_sub_type = record.source_gen_doc_line.item_sub_type;
          line.guid_dimension = record.source_gen_doc_line.guid_dimension;
          line.guid_profit_center =
            record.source_gen_doc_line.guid_profit_center;
          line.guid_project = record.source_gen_doc_line.guid_project;
          line.guid_segment = record.source_gen_doc_line.guid_segment;
          line.item_property_json =
            record.source_gen_doc_line.item_property_json;
          // line.line_property_json = <any>{ delivery_instructions: { ...this.itemDetails.delivery.form.value } };
          line.unit_price_std = record.source_gen_doc_line.unit_price_std;
          line.unit_price_txn = <any>(+line.amount_txn / +line.quantity_base);
          line.uom = record.source_gen_doc_line.uom;
          line.uom_to_base_ratio =
            record.source_gen_doc_line.uom_to_base_ratio;
          line.qty_by_uom =
            +record.serialNumbersToBeReturnedLength /
            +record.source_gen_doc_line.uom_to_base_ratio;
          line.unit_price_std_by_uom =
            +line.unit_price_std * +line.uom_to_base_ratio;
          line.unit_price_txn_by_uom = <any>(
            this.round(
              +line.amount_txn /
                (+line.uom_to_base_ratio * +line.quantity_base),
              2
            )
          );
          line.unit_disc_by_uom = <any>(
            (unitDiscount * record.source_gen_doc_line.uom_to_base_ratio)
          );
          line.txn_type = "PNS";
          line.quantity_signum = 0;
          line.amount_signum = 0;
          line.server_doc_type = "INTERNAL_SALES_RETURN_REQUEST";
          line.client_doc_type = "INTERNAL_SALES_RETURN_REQUEST";
          line.date_txn = new Date();
          line.status = "ACTIVE";
          line.serial_no = <any>{
            serialNumbers: record.serialNumbersToBeReturned,
          };
          line.unit_price_net =
            +line.unit_price_std - +line.amount_discount / +line.quantity_base;
          line.delivery_branch_guid =
            record.source_gen_doc_line.delivery_branch_guid;
          line.delivery_branch_code =
            record.source_gen_doc_line.delivery_branch_code;
          line.delivery_location_guid =
            record.source_gen_doc_line.delivery_location_guid;
          line.delivery_location_code =
            record.source_gen_doc_line.delivery_location_code;
          line.sales_entity_hdr_guid =
            record.source_gen_doc_line.sales_entity_hdr_guid;
          line.sales_entity_hdr_name =
            record.source_gen_doc_line.sales_entity_hdr_name;
          line.sales_entity_hdr_code =
            record.source_gen_doc_line.sales_entity_hdr_code;

          // Add gen_doc_link here - item type means it is off an existing order
          const link = new bl_fi_generic_doc_link_RowClass();
          link.guid_doc_2_line = line.guid;
          link.guid_doc_1_hdr = record.source_gen_doc_hdr.guid;
          link.guid_doc_1_line = record.source_gen_doc_line.guid;
          link.server_doc_type_doc_1_hdr = this.docType;
          link.server_doc_type_doc_1_line = this.docType;
          link.server_doc_type_doc_2_hdr = AppletConstants.docType;
          link.server_doc_type_doc_2_line = AppletConstants.docType;
          link.txn_type = "RETURN";
          link.quantity_signum = 0;
          link.quantity_contra = line.quantity_base;
          link.date_txn = new Date();
          link.status = "DRAFT";
          link.serial_no = <any>{
            serialNumbers: record.serialNumbersToBeReturned,
          };

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
                        (+record.target_gen_doc_line_qty || 0) <=
                      +record.source_gen_doc_line.quantity_base
                    ) {
                      this.viewColFacade.updateMainOnKOImport(hdr);
                      this.viewColFacade.addLink(link);
                      if (line.item_sub_type === "SERIAL_NUMBER") {
                        const newline: any = { ...line };
                        if (!Array.isArray(newline.serial_no)) {
                          if (
                            newline.serial_no &&
                            <any>newline.serial_no.serialNumbers.length
                          ) {
                            this.draftStore.dispatch(
                              PNSActions.validatePNSSerialNo({ line: newline })
                            );
                          } else {
                            this.draftStore.dispatch(
                              PNSActions.validatePNSNoSerialNo({
                                line: newline,
                              })
                            );
                          }
                        }
                      }
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
                    if (line.item_sub_type === "SERIAL_NUMBER") {
                      const newline: any = { ...line };
                      if (!Array.isArray(newline.serial_no)) {
                        if (
                          newline.serial_no &&
                          <any>newline.serial_no.serialNumbers.length
                        ) {
                          this.draftStore.dispatch(
                            PNSActions.validatePNSSerialNo({ line: newline })
                          );
                        } else {
                          this.draftStore.dispatch(
                            PNSActions.validatePNSNoSerialNo({ line: newline })
                          );
                        }
                      }
                    }
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
      }
    } else {
      let hasSerialError = false;
      selectedData.forEach((record) => {
        if (
          record.source_gen_doc_line.item_sub_type === "SERIAL_NUMBER" &&
          !record.serialNumbersToBeReturned
        ) {
          hasSerialError = true;
        }
      });
      if (hasSerialError) {
        this.toastr.error("Please Select Serial Number", "Error", {
          tapToDismiss: true,
          progressBar: true,
          timeOut: 1300,
        });
        return;
      } else {
        selectedData.forEach((record) => {
          let hdr = new GenericDocContainerModel();
          const line = new bl_fi_generic_doc_line_RowClass();

          line.guid = UUID.UUID().toLowerCase();

          hdr.bl_fi_generic_doc_hdr = record.source_gen_doc_hdr;

          let unitDiscount =
            record.source_gen_doc_line.amount_discount /
            record.source_gen_doc_line.quantity_base;

          line.item_guid = record.source_gen_doc_line.item_guid;
          line.item_code = record.source_gen_doc_line.item_code;
          line.item_name = record.source_gen_doc_line.item_name;
          line.quantity_base = +record.serialNumbersToBeReturnedLength;
          record.source_gen_doc_line.unit_price_std = record.returnPrice
            ? +record.returnPrice
            : record.source_gen_doc_line.unit_price_std;
          line.amount_std = <any>(
            (record.source_gen_doc_line.unit_price_std *
              +record.serialNumbersToBeReturnedLength)
          );
          line.amount_discount = <any>(
            (unitDiscount * +record.serialNumbersToBeReturnedLength)
          );
          line.amount_net = <any>(+line.amount_std - +line.amount_discount);
          line.tax_gst_code = record.source_gen_doc_line.tax_gst_code;
          line.tax_gst_rate = record.source_gen_doc_line.tax_gst_rate;
          line.tax_gst_type = record.source_gen_doc_line.tax_gst_type;
          line.amount_tax_gst = <any>(+line.amount_net * +line.tax_gst_rate);
          line.tax_wht_code = record.source_gen_doc_line.tax_wht_code;
          line.tax_wht_rate = record.source_gen_doc_line.tax_wht_rate;
          line.amount_tax_wht = <any>(+line.amount_net * +line.tax_wht_rate);
          line.amount_txn = <any>(
            (+line.amount_net + +line.amount_tax_gst - +line.amount_tax_wht)
          );
          line.item_remarks = record.source_gen_doc_line.item_remarks;
          line.item_txn_type = record.source_gen_doc_line.item_txn_type;
          line.item_sub_type = record.source_gen_doc_line.item_sub_type;
          line.guid_dimension = record.source_gen_doc_line.guid_dimension;
          line.guid_profit_center =
            record.source_gen_doc_line.guid_profit_center;
          line.guid_project = record.source_gen_doc_line.guid_project;
          line.guid_segment = record.source_gen_doc_line.guid_segment;
          line.item_property_json =
            record.source_gen_doc_line.item_property_json;
          // line.line_property_json = <any>{ delivery_instructions: { ...this.itemDetails.delivery.form.value } };
          line.unit_price_std = record.source_gen_doc_line.unit_price_std;
          line.unit_price_txn = <any>(+line.amount_txn / +line.quantity_base);
          line.uom = record.source_gen_doc_line.uom;
          line.uom_to_base_ratio =
            record.source_gen_doc_line.uom_to_base_ratio;
          line.qty_by_uom =
            +record.serialNumbersToBeReturnedLength /
            +record.source_gen_doc_line.uom_to_base_ratio;
          line.unit_price_std_by_uom =
            +line.unit_price_std * +line.uom_to_base_ratio;
          line.unit_price_txn_by_uom = <any>(
            this.round(
              +line.amount_txn /
                (+line.uom_to_base_ratio * +line.quantity_base),
              2
            )
          );
          line.unit_disc_by_uom = <any>(
            (unitDiscount * record.source_gen_doc_line.uom_to_base_ratio)
          );
          line.txn_type = "PNS";
          line.quantity_signum = 0;
          line.amount_signum = 0;
          line.server_doc_type = "INTERNAL_SALES_RETURN_REQUEST";
          line.client_doc_type = "INTERNAL_SALES_RETURN_REQUEST";
          line.date_txn = new Date();
          line.status = "ACTIVE";
          line.serial_no = <any>{
            serialNumbers: record.serialNumbersToBeReturned,
          };
          line.unit_price_net =
            +line.unit_price_std - +line.amount_discount / +line.quantity_base;
          line.delivery_branch_guid =
            record.source_gen_doc_line.delivery_branch_guid;
          line.delivery_branch_code =
            record.source_gen_doc_line.delivery_branch_code;
          line.delivery_location_guid =
            record.source_gen_doc_line.delivery_location_guid;
          line.delivery_location_code =
            record.source_gen_doc_line.delivery_location_code;

          // Add gen_doc_link here - item type means it is off an existing order
          const link = new bl_fi_generic_doc_link_RowClass();
          link.guid_doc_2_line = line.guid;
          link.guid_doc_1_hdr = record.source_gen_doc_hdr.guid;
          link.guid_doc_1_line = record.source_gen_doc_line.guid;
          link.server_doc_type_doc_1_hdr = this.docType;
          link.server_doc_type_doc_1_line = this.docType;
          link.server_doc_type_doc_2_hdr = AppletConstants.docType;
          link.server_doc_type_doc_2_line = AppletConstants.docType;
          link.txn_type = "RETURN";
          link.quantity_signum = 0;
          link.quantity_contra = line.quantity_base;
          link.date_txn = new Date();
          link.status = "DRAFT";
          link.serial_no = <any>{
            serialNumbers: record.serialNumbersToBeReturned,
          };

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
                  (+record.target_gen_doc_line_qty || 0) <=
                +record.source_gen_doc_line.quantity_base
              ) {
                this.viewColFacade.updateMainOnKOImport(hdr);
                this.viewColFacade.addLink(link);
                if (line.item_sub_type === "SERIAL_NUMBER") {
                  const newline: any = { ...line };
                  if (!Array.isArray(newline.serial_no)) {
                    if (
                      newline.serial_no &&
                      <any>newline.serial_no.serialNumbers.length
                    ) {
                      this.draftStore.dispatch(
                        PNSActions.validatePNSSerialNo({ line: newline })
                      );
                    } else {
                      this.draftStore.dispatch(
                        PNSActions.validatePNSNoSerialNo({ line: newline })
                      );
                    }
                  }
                }
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
              if (line.item_sub_type === "SERIAL_NUMBER") {
                const newline: any = { ...line };
                if (!Array.isArray(newline.serial_no)) {
                  if (
                    newline.serial_no &&
                    <any>newline.serial_no.serialNumbers.length
                  ) {
                    this.draftStore.dispatch(
                      PNSActions.validatePNSSerialNo({ line: newline })
                    );
                  } else {
                    this.draftStore.dispatch(
                      PNSActions.validatePNSNoSerialNo({ line: newline })
                    );
                  }
                }
              }
              this.viewColFacade.addLineItem(line, "create");
            }
          }
        });
      }
    }
    this.store.dispatch(InternalSalesReturnActions.updateKOStatus({ status:"DONE" }));
    setTimeout(() => {
      this.onReturnToMain();
    }, 1000);
  }

  onAddAllToSalesReturn() {
    this.store.dispatch(InternalSalesReturnActions.updateKOStatus({ status:"IN_PROGRESS" }));
    if (this.appletSettings.ENABLE_BRANCH_FILTER === true) {
      const selectedData = this.getAllRows();
      // let hasSerialError = false;
      // selectedData.forEach((record) => {
      //   if (
      //     record.source_gen_doc_line.item_sub_type === "SERIAL_NUMBER" &&
      //     !record.serialNumbersToBeReturned
      //   ) {
      //     hasSerialError = true;
      //   }
      // });
      // if (hasSerialError) {
      //   this.toastr.error("Please Select Serial Number", "Error", {
      //     tapToDismiss: true,
      //     progressBar: true,
      //     timeOut: 1300,
      //   });
      // } else {
      selectedData.forEach((record) => {
        let hdr = new GenericDocContainerModel();
        const line = new bl_fi_generic_doc_line_RowClass();

        line.guid = UUID.UUID().toLowerCase();

        hdr.bl_fi_generic_doc_hdr = record.source_gen_doc_hdr;

        let unitDiscount =
          record.source_gen_doc_line.amount_discount /
          record.source_gen_doc_line.quantity_base;

        line.item_guid = record.source_gen_doc_line.item_guid;
        line.item_code = record.source_gen_doc_line.item_code;
        line.item_name = record.source_gen_doc_line.item_name;
        line.quantity_base = +record.source_gen_doc_line.quantity_base;
        line.amount_std = <any>(
          (record.source_gen_doc_line.unit_price_std * +record.source_gen_doc_line.quantity_base)
        );
        line.amount_discount = <any>(unitDiscount * +record.source_gen_doc_line.quantity_base);
        line.amount_net = <any>(+line.amount_std - +line.amount_discount);
        line.tax_gst_code = record.source_gen_doc_line.tax_gst_code;
        line.tax_gst_rate = record.source_gen_doc_line.tax_gst_rate;
        line.tax_gst_type = record.source_gen_doc_line.tax_gst_type;
        line.amount_tax_gst = <any>(+line.amount_net * +line.tax_gst_rate);
        line.tax_wht_code = record.source_gen_doc_line.tax_wht_code;
        line.tax_wht_rate = record.source_gen_doc_line.tax_wht_rate;
        line.amount_tax_wht = <any>(+line.amount_net * +line.tax_wht_rate);
        line.amount_txn = <any>(
          (+line.amount_net + +line.amount_tax_gst - +line.amount_tax_wht)
        );
        line.item_remarks = record.source_gen_doc_line.item_remarks;
        line.item_txn_type = record.source_gen_doc_line.item_txn_type;
        line.item_sub_type = record.source_gen_doc_line.item_sub_type;
        line.guid_dimension = record.source_gen_doc_line.guid_dimension;
        line.guid_profit_center =
          record.source_gen_doc_line.guid_profit_center;
        line.guid_project = record.source_gen_doc_line.guid_project;
        line.guid_segment = record.source_gen_doc_line.guid_segment;
        line.item_property_json =
          record.source_gen_doc_line.item_property_json;
        // line.line_property_json = <any>{ delivery_instructions: { ...this.itemDetails.delivery.form.value } };
        line.unit_price_std = record.source_gen_doc_line.unit_price_std;
        line.unit_price_txn = <any>(+line.amount_txn / +line.quantity_base);
        line.uom = record.source_gen_doc_line.uom;
        line.uom_to_base_ratio =
          record.source_gen_doc_line.uom_to_base_ratio;
        line.qty_by_uom =
          +record.source_gen_doc_line.quantity_base / +record.source_gen_doc_line.uom_to_base_ratio;
        line.unit_price_std_by_uom =
          +line.unit_price_std * +line.uom_to_base_ratio;
        line.unit_price_txn_by_uom = <any>(
          this.round(
            +line.amount_txn / (+line.uom_to_base_ratio * +line.quantity_base),
            2
          )
        );
        line.unit_disc_by_uom = <any>(
          (unitDiscount * record.source_gen_doc_line.uom_to_base_ratio)
        );
        line.txn_type = "PNS";
        line.quantity_signum = 0;
        line.amount_signum = 0;
        line.server_doc_type = "INTERNAL_SALES_RETURN_REQUEST";
        line.client_doc_type = "INTERNAL_SALES_RETURN_REQUEST";
        line.date_txn = new Date();
        line.status = "ACTIVE";
        line.serial_no = <any>{ serialNumbers: record.return_serial_no };
        line.unit_price_net =
          +line.unit_price_std - +line.amount_discount / +line.quantity_base;
        line.delivery_branch_guid =
          record.source_gen_doc_line.delivery_branch_guid;
        line.delivery_branch_code =
          record.source_gen_doc_line.delivery_branch_code;
        line.delivery_location_guid =
          record.source_gen_doc_line.delivery_location_guid;
        line.delivery_location_code =
          record.source_gen_doc_line.delivery_location_code;
        line.sales_entity_hdr_guid =
          record.source_gen_doc_line.sales_entity_hdr_guid;
        line.sales_entity_hdr_name =
          record.source_gen_doc_line.sales_entity_hdr_name;
        line.sales_entity_hdr_code =
          record.source_gen_doc_line.sales_entity_hdr_code;
        // Add gen_doc_link here - item type means it is off an existing order
        const link = new bl_fi_generic_doc_link_RowClass();
        link.guid_doc_2_line = line.guid;
        link.guid_doc_1_hdr = record.source_gen_doc_hdr.guid;
        link.guid_doc_1_line = record.source_gen_doc_line.guid;
        link.server_doc_type_doc_1_hdr = this.docType;
        link.server_doc_type_doc_1_line = this.docType;
        link.server_doc_type_doc_2_hdr = AppletConstants.docType;
        link.server_doc_type_doc_2_line = AppletConstants.docType;
        link.txn_type = "RETURN";
        link.quantity_signum = 0;
        link.quantity_contra = line.quantity_base;
        link.date_txn = new Date();
        link.status = "DRAFT";
        link.serial_no = <any>{ serialNumbers: record.return_serial_no };

        // if (
        //   record.serialNumbersToBeReturnedLength === null ||
        //   record.serialNumbersToBeReturnedLength === undefined
        // ) {
        //   this.toastr.error("Please Enter Return Qty", "Error", {
        //     tapToDismiss: true,
        //     progressBar: true,
        //     timeOut: 1300,
        //   });
        // } else {
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
              // if (
              //   (+record.serialNumbersToBeReturnedLength || 0) +
              //     (+record.target_gen_doc_line_qty || 0) <=
              //   +record.source_gen_doc_line.quantity_base
              // ) {
              this.viewColFacade.updateMainOnKOImport(hdr);
              this.viewColFacade.addLink(link);

              this.viewColFacade.addLineItem(line, "create");
              // } else {
              //   this.toastr.error(
              //     "Total return quantity is greater that the invoice qty",
              //     "Error",
              //     {
              //       tapToDismiss: true,
              //       progressBar: true,
              //       timeOut: 2000,
              //     }
              //   );
              // }
            } else {
              this.toastr.error("Customer not linked to branch", "Error", {
                tapToDismiss: true,
                progressBar: true,
                timeOut: 2000,
              });
            }
          });
        // }
      });
      // }
    } else {
      const selectedData = this.getAllRows();
      // let hasSerialError = false;
      // selectedData.forEach((record) => {
      //   if (
      //     record.source_gen_doc_line.item_sub_type === "SERIAL_NUMBER" &&
      //     !record.serialNumbersToBeReturned
      //   ) {
      //     hasSerialError = true;
      //   }
      // });
      // if (hasSerialError) {
      //   this.toastr.error("Please Select Serial Number", "Error", {
      //     tapToDismiss: true,
      //     progressBar: true,
      //     timeOut: 1300,
      //   });
      // } else {
      selectedData.forEach((record) => {
        let hdr = new GenericDocContainerModel();
        const line = new bl_fi_generic_doc_line_RowClass();

        line.guid = UUID.UUID().toLowerCase();

        hdr.bl_fi_generic_doc_hdr = record.source_gen_doc_hdr;

        let unitDiscount =
          record.source_gen_doc_line.amount_discount /
          record.source_gen_doc_line.quantity_base;

        line.item_guid = record.source_gen_doc_line.item_guid;
        line.item_code = record.source_gen_doc_line.item_code;
        line.item_name = record.source_gen_doc_line.item_name;
        line.quantity_base = +record.source_gen_doc_line.quantity_base;
        line.amount_std = <any>(
          (record.source_gen_doc_line.unit_price_std * +record.source_gen_doc_line.quantity_base)
        );
        line.amount_discount = <any>(unitDiscount * +record.source_gen_doc_line.quantity_base);
        line.amount_net = <any>(+line.amount_std - +line.amount_discount);
        line.tax_gst_code = record.source_gen_doc_line.tax_gst_code;
        line.tax_gst_rate = record.source_gen_doc_line.tax_gst_rate;
        line.tax_gst_type = record.source_gen_doc_line.tax_gst_type;
        line.amount_tax_gst = <any>(+line.amount_net * +line.tax_gst_rate);
        line.tax_wht_code = record.source_gen_doc_line.tax_wht_code;
        line.tax_wht_rate = record.source_gen_doc_line.tax_wht_rate;
        line.amount_tax_wht = <any>(+line.amount_net * +line.tax_wht_rate);
        line.amount_txn = <any>(
          (+line.amount_net + +line.amount_tax_gst - +line.amount_tax_wht)
        );
        line.item_remarks = record.source_gen_doc_line.item_remarks;
        line.item_txn_type = record.source_gen_doc_line.item_txn_type;
        line.item_sub_type = record.source_gen_doc_line.item_sub_type;
        line.guid_dimension = record.source_gen_doc_line.guid_dimension;
        line.guid_profit_center =
          record.source_gen_doc_line.guid_profit_center;
        line.guid_project = record.source_gen_doc_line.guid_project;
        line.guid_segment = record.source_gen_doc_line.guid_segment;
        line.item_property_json =
          record.source_gen_doc_line.item_property_json;
        // line.line_property_json = <any>{ delivery_instructions: { ...this.itemDetails.delivery.form.value } };
        line.unit_price_std = record.source_gen_doc_line.unit_price_std;
        line.unit_price_txn = <any>(+line.amount_txn / +line.quantity_base);
        line.uom = record.source_gen_doc_line.uom;
        line.uom_to_base_ratio =
          record.source_gen_doc_line.uom_to_base_ratio;
        line.qty_by_uom =
          +record.source_gen_doc_line.quantity_base / +record.source_gen_doc_line.uom_to_base_ratio;
        line.unit_price_std_by_uom =
          +line.unit_price_std * +line.uom_to_base_ratio;
        line.unit_price_txn_by_uom = <any>(
          this.round(
            +line.amount_txn / (+line.uom_to_base_ratio * +line.quantity_base),
            2
          )
        );
        line.unit_disc_by_uom = <any>(
          (unitDiscount * record.source_gen_doc_line.uom_to_base_ratio)
        );
        line.txn_type = "PNS";
        line.quantity_signum = 0;
        line.amount_signum = 0;
        line.server_doc_type = "INTERNAL_SALES_RETURN_REQUEST";
        line.client_doc_type = "INTERNAL_SALES_RETURN_REQUEST";
        line.date_txn = new Date();
        line.status = "ACTIVE";
        line.serial_no = <any>{ serialNumbers: record.return_serial_no };
        line.unit_price_net =
          +line.unit_price_std - +line.amount_discount / +line.quantity_base;
        line.delivery_branch_guid =
          record.source_gen_doc_line.delivery_branch_guid;
        line.delivery_branch_code =
          record.source_gen_doc_line.delivery_branch_code;
        line.delivery_location_guid =
          record.source_gen_doc_line.delivery_location_guid;
        line.delivery_location_code =
          record.source_gen_doc_line.delivery_location_code;
        // Add gen_doc_link here - item type means it is off an existing order
        const link = new bl_fi_generic_doc_link_RowClass();
        link.guid_doc_2_line = line.guid;
        link.guid_doc_1_hdr = record.source_gen_doc_hdr.guid;
        link.guid_doc_1_line = record.source_gen_doc_line.guid;
        link.server_doc_type_doc_1_hdr = this.docType;
        link.server_doc_type_doc_1_line = this.docType;
        link.server_doc_type_doc_2_hdr = AppletConstants.docType;
        link.server_doc_type_doc_2_line = AppletConstants.docType;
        link.txn_type = "RETURN";
        link.quantity_signum = 0;
        link.quantity_contra = line.quantity_base;
        link.date_txn = new Date();
        link.status = "DRAFT";
        link.serial_no = <any>{ serialNumbers: record.return_serial_no };

        // if (
        //   record.serialNumbersToBeReturnedLength === null ||
        //   record.serialNumbersToBeReturnedLength === undefined
        // ) {
        //   this.toastr.error("Please Enter Return Qty", "Error", {
        //     tapToDismiss: true,
        //     progressBar: true,
        //     timeOut: 1300,
        //   });
        // } else {
        // if (
        //   (+record.serialNumbersToBeReturnedLength || 0) +
        //     (+record.target_gen_doc_line_qty || 0) <=
        //   +record.source_gen_doc_line.quantity_base
        // ) {
        this.viewColFacade.updateMainOnKOImport(hdr);
        this.viewColFacade.addLink(link);

        this.viewColFacade.addLineItem(line, "create");
        // } else {
        //   this.toastr.error(
        //     "Total return quantity is greater that the invoice qty",
        //     "Error",
        //     {
        //       tapToDismiss: true,
        //       progressBar: true,
        //       timeOut: 2000,
        //     }
        //   );
        // }
        // }
      });
      // }
    }
    this.store.dispatch(InternalSalesReturnActions.updateKOStatus({ status:"DONE" }));
    setTimeout(() => {
      this.onReturnToMain();
    }, 1000);
  }

  getAllRows() {
    let rowData = [];
    this.gridApi.forEachNode((node) => rowData.push(node.data));
    return rowData;
  }

  round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  onCellEditingStarted($event) {
    if ($event.data.return_serial_no.length !== 0) {
      this.gridApi.stopEditing();
    }
  }
}
