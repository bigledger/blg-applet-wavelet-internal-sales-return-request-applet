import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Store } from "@ngrx/store";
import {
  Pagination,
  GenericDocContainerModel,
  InternalPaymentVouchersService,
  BranchService,
  SupplierService,
  TenantUserProfileService,
  SubQueryService,
  SalesInvoiceService,
  CompanyService,
  GenericDocAllService,
} from "blg-akaun-ts-lib";
import moment from "moment";
import { ToastrService } from "ngx-toastr";
import {
  pageFiltering,
  pageSorting,
} from "projects/shared-utilities/listing.utils";
import { SearchQueryModel } from "projects/shared-utilities/models/query.model";
import { PaginationClientSideComponent } from "projects/shared-utilities/utilities/pagination-client-side/pagination-client-side.component";
import { ViewColumnComponent } from "projects/shared-utilities/view-column.component";
import { AppConfig } from "projects/shared-utilities/visa";
import { InternalSalesReturnStates } from "../../../../../../state-controllers/internal-sales-return-controller/store/states";
import { forkJoin, iif, Observable, of, Subject, zip } from "rxjs";
import { mergeMap, catchError, map } from "rxjs/operators";
import { SubSink } from "subsink2";
import { ViewColumnFacade } from "../../../../../../facades/view-column.facade";
import { InternalSalesReturnSelectors } from "../../../../../../state-controllers/internal-sales-return-controller/store/selectors";
import { salesInvoiceSearchModel } from "../../../../../../models/advanced-search-models/sales-invoice.model";
import { InternalSalesReturnActions } from "../../../../../../state-controllers/internal-sales-return-controller/store/actions";
import { PaginationComponent } from "projects/shared-utilities/utilities/pagination/pagination.component";

interface LocalState {
  deactivateAdd: boolean;
  deactivateList: boolean;
  selectedRow: any;
}

@Component({
  selector: "app-invoice-listing",
  templateUrl: "./invoice-listing.component.html",
  styleUrls: ["./invoice-listing.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore],
})
export class CustomerInvoiceListingComponent extends ViewColumnComponent {
  protected subs = new SubSink();

  protected compName = "Ivoice Listing";
  protected readonly index = 42;
  protected localState: LocalState;
  protected prevLocalState: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateAdd$ = this.componentStore.select(
    (state) => state.deactivateAdd
  );

  prevIndex: number;
  toggleColumn$: Observable<boolean>;
  searchModel = salesInvoiceSearchModel;
  gridApi;
  SQLGuids: string[] = [];
  pagination = new Pagination();

  paymentVoucher$: Observable<GenericDocContainerModel[]>;
  totalCount: number;
  totalRecords$: Subject<number> = new Subject<number>();

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
      headerName: "Company Code",
      field: "bl_fi_generic_doc_hdr.code_company",
      cellStyle: () => ({ "text-align": "left" }),
      floatingFilter: true,
    },
    {
      headerName: "Branch Code",
      field: "bl_fi_generic_doc_hdr.code_branch",
      cellStyle: () => ({ "text-align": "left" }),
      floatingFilter: true,
    },
    {
      headerName: "Server Doc Type",
      field: "bl_fi_generic_doc_hdr.server_doc_type",
      cellStyle: () => ({ "text-align": "left" }),
      floatingFilter: true,
    },
    {
      headerName: "Invoice No",
      field: "bl_fi_generic_doc_hdr.server_doc_1",
      cellStyle: () => ({ "text-align": "left" }),
      floatingFilter: true,
    },
    {
      headerName: "Transaction Date",
      field: "bl_fi_generic_doc_hdr.date_txn",
      cellStyle: () => ({ "text-align": "right" }),
      valueFormatter: (params) => moment(params.value).format("YYYY-MM-DD"),
    },
  ];

  @ViewChild(PaginationComponent)
  paginationComp: PaginationComponent;
  customerGuid: string;
  dtoObject;
  constructor(
    private viewColFacade: ViewColumnFacade,
    private subQueryService: SubQueryService,
    private genericDocAllService: GenericDocAllService,
    private readonly store: Store<InternalSalesReturnStates>,
    private toastr: ToastrService,
    private readonly componentStore: ComponentStore<LocalState>
  ) {
    super();
  }

  ngOnInit() {
    this.toggleColumn$ = this.viewColFacade.toggleColumn$;
    this.subs.sink = this.localState$.subscribe((a) => {
      this.localState = a;
      this.componentStore.setState(a);
    });

    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(
      (resolve) => (this.prevIndex = resolve)
    );
    this.subs.sink = this.viewColFacade
      .prevLocalState$()
      .subscribe((resolve) => (this.prevLocalState = resolve));

    this.subs.sink = this.store
      .select(InternalSalesReturnSelectors.selectCustomerForSalesReturn)
      .subscribe((response) => {
        this.customerGuid = response;
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
        if (this.SQLGuids.length > 0) {
          this.dtoObject = {
            offset: this.SQLGuids.length!==0 ? 0 : grid.request.startRow,
            limit: grid.request.endRow - grid.request.startRow,
            doc_entity_hdr_guid: this.customerGuid,
            guids: this.SQLGuids
              ? this.SQLGuids.slice(grid.request.startRow, grid.request.endRow)
              : null,
            server_doc_types: [
              "INTERNAL_SALES_CASHBILL",
              "INTERNAL_SALES_INVOICE",
            ],
            orderBy: "server_doc_type,server_doc_1",
            calcTotalRecords: true
          };
        } else {
          this.dtoObject = {
            offset: this.SQLGuids.length!==0 ? 0 : grid.request.startRow,
            limit: grid.request.endRow - grid.request.startRow,
            doc_entity_hdr_guid: this.customerGuid,
            server_doc_types: [
              "INTERNAL_SALES_CASHBILL",
              "INTERNAL_SALES_INVOICE",
            ],
            orderBy: "server_doc_type,server_doc_1",
            calcTotalRecords: true
          };
        }
        this.subs.sink = this.genericDocAllService
          .getByGenericCriteriaSnapshot(this.dtoObject, apiVisa)
          .subscribe(
            (a) => {
              const start = grid.request.startRow;
              const end = grid.request.endRow;
              const totalRecords = a["totalRecords"];
              console.log("totalRecords",a["totalRecords"]);
              grid.successCallback(a.data, totalRecords);
            },
            (err) => {
              grid.failCallback();
            }
          );
      },
    };
    this.gridApi.setServerSideDatasource(datasource);
  }

  onToggle(e: boolean) {
    this.viewColFacade.toggleColumn(e);
  }

  setTotalRecordCount(totalCount: number) {
    this.totalRecords$.next(totalCount);
  }

  onSearch(e: SearchQueryModel) {
    if (!e.isEmpty) {
      const sql = {
        subquery:
          e.queryString + `AND hdr.doc_entity_hdr_guid='${this.customerGuid}'`,
        table: e.table,
      };
      this.subs.sink = this.subQueryService
        .post(sql, AppConfig.apiVisa)
        .subscribe({
          next: (resolve) => {
            this.SQLGuids = resolve.data;
            if (this.SQLGuids.length !== 0 || this.SQLGuids.length <= 50) {
              this.gridApi.refreshServerSideStore();
            } else {
              this.toastr.error(
                "Result Set Too Large. Please Refine Search",
                "Error",
                {
                  tapToDismiss: true,
                  progressBar: true,
                  timeOut: 2000,
                }
              );
            }
          },
        });
    } else {
      this.SQLGuids = [];
      this.gridApi.refreshServerSideStore();
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

  onRowClicked(entity: GenericDocContainerModel) {
    console.log(entity);
    this.store.dispatch(
      InternalSalesReturnActions.selectInvoiceForSalesReturn({
        invoiceGuid: entity.bl_fi_generic_doc_hdr.guid.toString(),
      })
    );
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateAdd: true,
      deactivateList: false,
    });
    this.viewColFacade.updateInstance(43, {
      ...this.localState,
      docType: entity.bl_fi_generic_doc_hdr.server_doc_type
    });
    this.viewColFacade.onNextAndReset(this.index, 43);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
