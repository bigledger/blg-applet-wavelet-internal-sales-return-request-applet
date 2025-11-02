import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Store } from "@ngrx/store";
import { ComponentStore } from "@ngrx/component-store";
import {
  Pagination,
  EinvoiceNotificationQueueService,
  MyEInvoiceToIRBHdrLinesService
} from "blg-akaun-ts-lib";
import { Observable } from "rxjs";
import { ViewColumnFacade } from "../../../../../facades/view-column.facade";
import { AppConfig } from "projects/shared-utilities/visa";
import { ViewColumnComponent } from "projects/shared-utilities/view-column.component";
import { SubSink } from "subsink2";
import { map, switchMap } from "rxjs/operators";
import { InternalSalesReturnStates } from "../../../../../state-controllers/internal-sales-return-controller/store/states";
import { InternalSalesReturnSelectors } from "../../../../../state-controllers/internal-sales-return-controller/store/selectors";
import { InternalSalesReturnActions } from "../../../../../state-controllers/internal-sales-return-controller/store/actions";
interface LocalState {
  deactivateAdd: boolean;
  deactivateList: boolean;
  selectedIndex: number
}
@Component({
  selector: "app-notification-queue-listing",
  templateUrl: "./notification-queue-listing.component.html",
  styleUrls: ["./notification-queue-listing.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore],
})
export class EinvoiceNotificationQueueListingComponent extends ViewColumnComponent {
  protected subs = new SubSink();
  protected compName = "Einvoice Notification Queue Listing";
  protected readonly index = 2;
  toggleColumn$: Observable<boolean>;
  searchModel;
  private localState: LocalState;
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateAdd$ = this.componentStore.select(state => state.deactivateAdd);
  readonly deactivateList$ = this.componentStore.select(state => state.deactivateList);
  SQLGuids: string[] = null;
  pagination = new Pagination();
  toIrbGuid;
  totalTxnAmount = 0;
  totalGstTaxAmount = 0;
  currency;
  defaultColDef = {
    filter: "agTextColumnFilter",
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 120,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true,
  };
  gridApi;
  columnsDefs = [
    {
      headerName: "Chanel Type",
      field: "bl_fi_my_einvoice_notification_queue.channel_type",
      checkboxSelection: true,
      cellStyle: () => ({ "text-align": "left" }),
    },
    {
      headerName: "Txn Type",
      field: "bl_fi_my_einvoice_notification_queue.txn_type",
      cellStyle: () => ({ "text-align": "left" }),
    },
    {
      headerName: "Desc",
      field: "bl_fi_my_einvoice_notification_queue.descr",
      cellStyle: () => ({ "text-align": "left" }),
    },
    {
      headerName: "Priority",
      field: "bl_fi_my_einvoice_notification_queue.priority",
      cellStyle: () => ({ "text-align": "left" }),
    },
  ];
  rowData = [];
  constructor(
    private viewColFacade: ViewColumnFacade,
    private readonly componentStore: ComponentStore<LocalState>,
    private myEInvoiceToIRBHdrLinesService: MyEInvoiceToIRBHdrLinesService,
    protected readonly store: Store<InternalSalesReturnStates>,
    private einvoiceNotificationQueueService: EinvoiceNotificationQueueService,
  ) {
    super();
  }
  ngOnInit() {
    this.toggleColumn$ = this.viewColFacade.toggleColumn$;
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.subs.sink = this.store
      .select(InternalSalesReturnSelectors.selectInternalSalesReturns)
      .pipe(
        map(a => ({
          columnName: "hdr_generic_doc_hdr_guids",
          operator: "=",
          value: a.bl_fi_generic_doc_hdr.guid?.toString()
        })),
        map(criteria => {
          let pagination = new Pagination();
          pagination.conditionalCriteria = [criteria];
          return pagination;
        }),
        switchMap(pagination =>
          this.myEInvoiceToIRBHdrLinesService.getByCriteria(pagination, AppConfig.apiVisa)
        )
      )
      .subscribe(response => {
        this.toIrbGuid = response?.data[0]?.bl_fi_my_einvoice_to_irb_hdr?.guid || null;
      });
  }
  onGridReady(params) {
    const apiVisa = AppConfig.apiVisa;
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    const datasource = {
      getRows: grid => {
        this.subs.sink = this.einvoiceNotificationQueueService.getByCriteria(
          new Pagination(grid.request.startRow, grid.request.endRow,
            [
              { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
              { columnName: 'orderBy', operator: '=', value: 'updated_date' },
              { columnName: 'order', operator: '=', value: 'DESC' },
              { columnName: 'to_irb_hdr_guids', operator: '=', value: this.toIrbGuid },
            ]), apiVisa).subscribe(a => {
              grid.success({
                rowData: a.data,
                rowCount: a.totalRecords,
              });
            }, err => {
              grid.fail();
            });
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
    this.gridApi.refreshServerSideStore();
  }
  onSearch(e: string) { }
  postToProcess(){
    let selectedRows;
    selectedRows = this.gridApi.getSelectedRows();
    let dtoObject = {};
    let notificationQueueGuids = [];
    selectedRows.forEach(selectedRow => {
      notificationQueueGuids.push(selectedRow.bl_fi_my_einvoice_notification_queue.guid);
    });
    dtoObject['notificationQueueGuids'] = notificationQueueGuids;
    this.store.dispatch(InternalSalesReturnActions.einvoiceNtfQueueProcessInit({dto : dtoObject}))
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}