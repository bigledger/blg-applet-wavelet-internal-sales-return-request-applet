import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Store } from "@ngrx/store";
import { ComponentStore } from "@ngrx/component-store";
import {
  CompanyContainerModel,
  CompanyService,
  GenericDocContainerModel,
  Pagination,
  T2TAuditTrailService,
  GenericDocEInvoicePostingQueueService
} from "blg-akaun-ts-lib";
import {
  pageFiltering,
  pageSorting,
} from "projects/shared-utilities/listing.utils";
import { Observable } from "rxjs";
import { AppConfig } from "projects/shared-utilities/visa";
import { ViewColumnComponent } from "projects/shared-utilities/view-column.component";
import { SubSink } from "subsink2";
import { ViewColumnFacade } from '../../../../../facades/view-column.facade';
import { InternalSalesReturnStates } from '../../../../../state-controllers/internal-sales-return-controller/store/states';
import { InternalSalesReturnSelectors } from '../../../../../state-controllers/internal-sales-return-controller/store/selectors';

interface LocalState {
  deactivateAdd: boolean;
  deactivateList: boolean;
  selectedRow: any;
}

@Component({
  selector: "app-pending-posting-to-irb-or-batch-queue",
  templateUrl: "./pending-posting-to-irb-or-batch-queue.component.html",
  styleUrls: ["./pending-posting-to-irb-or-batch-queue.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore],
})
export class PendingPostingToIRBOrBatchQueueComponent extends ViewColumnComponent {
  protected subs = new SubSink();

  protected compName = "Pending Posting To IRB Or Batch Queue";
  protected readonly index = 7;
  private localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateAdd$ = this.componentStore.select(
    (state) => state.localState.deactivateAdd
  );
  readonly deactivateList$ = this.componentStore.select(
    (state) => state.localState.deactivateList
  );

  toggleColumn$: Observable<boolean>;
  // searchModel = internalPackingOrderSearchModel;
  SQLGuids: string[] = null;
  pagination = new Pagination();
  salesInvoiceGuid;
  defaultColDef = {
    filter: "agTextColumnFilter",
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true,
  };

  gridApi;

  columnsDefs = [
    {
      headerName: "Validation Error",
      field: "bl_fi_generic_doc_einvoice_posting_queue.validation_error",
      comparator: (valueA, valueB) =>
        valueA.toLowerCase().localeCompare(valueB.toLowerCase()),
      suppressSizeToFit: false,
      cellStyle: () => ({ "text-align": "left" }),
    },

 
  ];


  rowData = [];


  constructor(
    private viewColFacade: ViewColumnFacade,
    private compService: CompanyService,
    protected readonly store: Store<InternalSalesReturnStates>,
    private genericDocEInvoicePostingQueueService: GenericDocEInvoicePostingQueueService,
    private readonly componentStore: ComponentStore<{ localState: LocalState }>
  ) {
    super();
  }

  ngOnInit() {
    this.toggleColumn$ = this.viewColFacade.toggleColumn$;
    this.subs.sink = this.localState$.subscribe((a) => {
      this.localState = a;
      this.componentStore.setState({ localState: a });
    });
    this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectInternalSalesReturns).subscribe(data => {
      this.salesInvoiceGuid = data.bl_fi_generic_doc_hdr.guid;
    })
  }

  onNext() {
    console.log("Nothing");
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
        this.pagination.offset = this.SQLGuids ? 0 : grid.request.startRow;
        this.pagination.limit = grid.request.endRow - grid.request.startRow;
        this.pagination.conditionalCriteria = [
          { columnName: "calcTotalRecords", operator: "=", value: "true" },
          { columnName: "generic_doc_hdr_guids", operator: "=", value: this.salesInvoiceGuid },
          {
            columnName: "guids",
            operator: "=",
            value: this.SQLGuids
              ? this.SQLGuids.slice(
                grid.request.startRow,
                grid.request.endRow
              ).toString()
              : "",
          },
        ];
        this.subs.sink = this.genericDocEInvoicePostingQueueService
          .getByCriteria(this.pagination, apiVisa)
          .subscribe(
            (resolved) => {
              const data = sortOn(resolved.data).filter((entity) =>
                filter.by(entity)
              );
              const totalRecords = filter.isFiltering
                ? this.SQLGuids
                  ? this.SQLGuids.length
                  : resolved.totalRecords
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
    this.gridApi.refreshServerSideStore();
  }

  onToggle(e: boolean) {
    // this.viewColFacade.toggleColumn(e);
  }

  onRowClicked(entity: CompanyContainerModel) {
    console.log("No action");
    // this.store.dispatch(AuditTrailActions.selectGuid({guid: entity.bl_fi_mst_comp.guid}))
    // if (!this.localState.deactivateList) {
    //   this.viewColFacade.updateInstance<LocalState>(this.index,
    //     {
    //       ...this.localState,
    //       deactivateAdd: false,
    //       deactivateList: true
    //     });
    //   this.viewColFacade.onNextAndReset(this.index, 2);
    // }
  }

  onSearch(e: string) { }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
