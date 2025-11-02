import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { FinancialItemService, LocationService, Pagination, SubQueryService, StockAvailabilityService } from 'blg-akaun-ts-lib';
import { pageFiltering, pageSorting } from 'projects/shared-utilities/listing.utils';
import { SearchQueryModel } from 'projects/shared-utilities/models/query.model';
import { PaginationComponent } from 'projects/shared-utilities/utilities/pagination/pagination.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { InternalSalesReturnActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/internal-sales-return-controller/store/actions';
import { InternalSalesReturnStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/internal-sales-return-controller/store/states';
import { map, mergeMap, toArray, switchMap } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { fiItemSearchModel } from '../../../../../../models/advanced-search-models/fi-item.model';
import { ClientSidePermissionStates } from 'projects/shared-utilities/modules/permission/client-side-permissions-controller/states';
import { ClientSidePermissionsSelectors } from 'projects/shared-utilities/modules/permission/client-side-permissions-controller/selectors';
import { ColumnViewModelStates } from "projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/sales-return-view-model-controller/store/states";
import { Column4ViewModelActions } from "projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/sales-return-view-model-controller/store/actions";
import { forkJoin, from, iif, of } from 'rxjs';
import { DraftStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/draft-controller/store/states';
import { HDRSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/draft-controller/store/selectors';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { isNullOrEmpty } from 'projects/shared-utilities/utilities/misc/misc.utils';
@Component({
  selector: 'app-line-search-item-listing',
  templateUrl: './line-search-item-listing.component.html',
  styleUrls: ['./line-search-item-listing.component.scss']
})
export class LineSearchItemListingComponent implements OnInit, OnDestroy {

  @Input() localState: any;
  @Output() addLineItem = new EventEmitter();

  clientSidePermissions$ = this.permissionStore.select(
    ClientSidePermissionsSelectors.selectAll
  );

  protected subs = new SubSink();

  gridApi;
  searchModel = fiItemSearchModel
  pagination = new Pagination();
  SQLGuids: string[] = null;
  EXCLUDE_ACCOUNT_CODE_ITEM_TYPE_AT_ITEM_SEARCH:boolean = false;
  clientSidePermissionSettings: any;
  guidStore;

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true,
  };

  columnsDefs = [
    { headerName: 'Item Code', field: 'item_code', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    { headerName: 'Item Name', field: 'item_name', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    { headerName: 'UOM', field: 'uom', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    { headerName: 'System Stock Balance', field: 'stock_bal', type: 'numericColumn', floatingFilter: true },
  ];

  @ViewChild(PaginationComponent) paginationComp: PaginationComponent;
  DISABLE_ITEM_LISTING = false;
  isDataVisible = false;
  constructor(
    protected fiService: FinancialItemService,
    private subQueryService: SubQueryService,
    private store: Store<InternalSalesReturnStates>,
    protected readonly permissionStore: Store<ClientSidePermissionStates>,
    public readonly viewModelStore: Store<ColumnViewModelStates>,
    protected readonly draftStore: Store<DraftStates>,
    private stockAvailabilityService: StockAvailabilityService,
    protected readonly sessionStore: Store<SessionStates>,
    ) {
  }

  ngOnInit() {
    this.subs.sink = this.clientSidePermissions$.subscribe({
      next: (resolve) => {
        this.clientSidePermissionSettings = resolve;
        resolve.forEach((permission) => {
          if (permission.perm_code === "EXCLUDE_ACCOUNT_CODE_ITEM_TYPE_AT_ITEM_SEARCH") {
            this.EXCLUDE_ACCOUNT_CODE_ITEM_TYPE_AT_ITEM_SEARCH = true;
          }
        });
      },
    });

    this.subs.sink = this.draftStore.select(HDRSelectors.selectLocation).subscribe({
      next: (guidStore) => {
        this.guidStore = guidStore;
      },
    });

    this.subs.sink = this.sessionStore.select(SessionSelectors.selectMasterSettings).subscribe(settings => {
      this.DISABLE_ITEM_LISTING = settings?.DISABLE_ITEM_LISTING;
      this.isDataVisible = !this.DISABLE_ITEM_LISTING;
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
      getRows: grid => {
        const filter = pageFiltering(grid.request.filterModel);
        const sortOn = pageSorting(grid.request.sortModel);
        this.pagination.offset = this.SQLGuids ? 0 : grid.request.startRow;
        this.pagination.limit = grid.request.endRow - grid.request.startRow;
        this.pagination.conditionalCriteria = [
          { columnName: 'txn_class', operator: '=', value: 'PNS' },
          { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
          { columnName: 'orderBy', operator: '=', value: 'date_updated' },
          { columnName: 'order', operator: '=', value: 'DESC' },
          {
            columnName: 'guids', operator: '=',
            value: this.SQLGuids ? this.SQLGuids.slice(grid.request.startRow, grid.request.endRow).toString() : ''
          }
        ];
        if (this.EXCLUDE_ACCOUNT_CODE_ITEM_TYPE_AT_ITEM_SEARCH) {
          this.pagination.conditionalCriteria.push({
            columnName: "exclude_txn_types", operator: '=', value: 'GL_CODE'
          });
        }

        if (!this.isDataVisible) {
          grid.success({
            rowData: [], // No data to show
            rowCount: 0
          });
          return;
        }

        this.subs.sink = this.fiService.getByCriteria(this.pagination, apiVisa).pipe(
          switchMap(a => {
            const b = <any>a;
            const source: any[] = [];
            const invItemHdrGuids = b.data?.filter(c => !isNullOrEmpty(c.bl_fi_mst_item_hdr.inv_item_hdr_guid)).map(c => c.bl_fi_mst_item_hdr.inv_item_hdr_guid);

            const stockAvailabilityInputModel = {
              inventory_item_guids: invItemHdrGuids,
              location_guids: [this.guidStore]
            } as any;

            return this.stockAvailabilityService.getStockAvailability(stockAvailabilityInputModel, AppConfig.apiVisa).pipe(
              map(stockResp => {
                const stockAvailabilityMap = new Map(
                  stockResp.data.map(stock => [stock.inv_item_guid, stock.qty_balance])
                );

                const updatedItems = b.data.map(c => {
                  let hdr = c.bl_fi_mst_item_hdr;
                  let value = null;
                  if (hdr.price_json && hdr.price_json.item_base_uom_pricing) {
                    value = hdr.price_json.item_base_uom_pricing[0].price_amount;
                  }
                  return {
                    "item_guid": hdr.guid,
                    "item_code": hdr.code,
                    "item_name": hdr.name,
                    "uom": hdr.uom,
                    "unit_price": value,
                    "item_type": null,
                    "item_txn_type": hdr.txn_type,
                    "item_sub_type": hdr.sub_item_type,
                    "uomGuid": hdr.guid,
                    "einvoice_taxable_type_code": hdr.einvoice_taxable_type_code,
                    "einvoice_taxable_type_desc": hdr.einvoice_taxable_type_desc,
                    "einvoice_uom": hdr.einvoice_uom,
                    "stock_bal": !isNullOrEmpty(hdr.inv_item_hdr_guid) ? stockAvailabilityMap.get(hdr.inv_item_hdr_guid) : "",
                    c
                  };
                });

                b.data = updatedItems;
                return b;
              })
            );
          })
        ).subscribe(resolved => {
          const data = sortOn(resolved.data).filter(entity => filter.by(entity));
          const totalRecords = filter.isFiltering ? (this.SQLGuids ? this.SQLGuids.length : resolved.totalRecords) : data.length;
          grid.success({
            rowData: data,
            rowCount: resolved.totalRecords,
          });
          this.gridApi.forEachNode(a => {
            if (a.data.item_guid === this.localState.selectedItem) {
              a.setSelected(true);
            }
          });
        }, err => {
          console.log(err);
          grid.fail();
        });
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
  }

  onSearch(e: SearchQueryModel) {
    if (!e.isEmpty) {
      const sql = {
        subquery: e.queryString,
        table: e.table
      };
      this.subs.sink = this.subQueryService.post(sql, AppConfig.apiVisa).subscribe({
        next: resolve => {
          this.isDataVisible = true;
          this.SQLGuids = resolve.data;
          this.paginationComp.firstPage();
          this.gridApi.refreshServerSideStore();
        }
      }
      );
    } else {
      this.isDataVisible = false;
      this.SQLGuids = null;
      this.paginationComp.firstPage();
      this.gridApi.refreshServerSideStore();
    }
  }

  pageFiltering(filterModel) {
    const noFilters = Object.keys(filterModel).length <= 0;
    if (noFilters) {
      return {
        by: (viewModel) => true,
        isFiltering: noFilters
      };
    }
    return {
      by: (viewModel: any) => Object
        .keys(filterModel)
        .map((col) => viewModel[col]?.toString().toLowerCase().includes(filterModel[col].filter.toLowerCase()))
        .reduce((p, c) => p && c),
      isFiltering: noFilters
    };
  }

  onRowClicked(item) {
    this.store.dispatch(InternalSalesReturnActions.selectPricingSchemeLink({ item }));
    let column = this.gridApi.getFocusedCell().column.getColId();
    if (item && column != 'unit_price') {
      this.store.dispatch(InternalSalesReturnActions.selectChildAttributeLink({ link: [] }));
      if(item.c.bl_fi_mst_item_hdr.txn_type==='GROUPED_ITEM'){
        this.store.dispatch(InternalSalesReturnActions.selectChildItem({ child: item.c.bl_fi_mst_item_lines }));
        this.store.dispatch(InternalSalesReturnActions.selectChildItemPricingLink({ child: item.c.bl_fi_mst_item_lines }));
      }
      this.viewModelStore.dispatch(
        Column4ViewModelActions.setPricingSchemeAccessKey({
          pricingSchemeAccessKey: null,
        })
      );
      this.viewModelStore.dispatch(
        Column4ViewModelActions.setFIItemHdrGuid({
          fiItemHdrGuid: item.item_guid,
        })
      );
      this.viewModelStore.dispatch(
        Column4ViewModelActions.setFIItem({ fiItem: item.c })
      );

      this.addLineItem.emit(item);

    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
