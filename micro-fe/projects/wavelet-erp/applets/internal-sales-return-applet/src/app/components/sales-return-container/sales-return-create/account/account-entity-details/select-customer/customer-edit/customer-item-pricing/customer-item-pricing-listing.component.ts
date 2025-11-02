import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  bl_fi_mst_entity_ext_RowClass, bl_fi_mst_entity_line_RowClass,
  FinancialItemService,
  ItemEntityPricingContainerModel,
  ItemEntityPricingService,
  LabelService, Pagination
} from 'blg-akaun-ts-lib';
import { combineLatest, forkJoin, iif, Observable, of, zip } from 'rxjs';
import { SubSink } from 'subsink2';
import { ComponentStore } from '@ngrx/component-store';
import { ChangeDetectionStrategy } from '@angular/core';
import { AppConfig } from 'projects/shared-utilities/visa';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/selectors';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';

interface LocalState {
  deactivateList: boolean;
  rowIndexList: number;
}
@Component({
  selector: 'app-customer-item-pricing',
  templateUrl: './customer-item-pricing-listing.component.html',
  styleUrls: ['./customer-item-pricing-listing.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class CustomerItemPricingComponent implements OnInit, OnDestroy {

  @Input() customerExt$: Observable<any>;
  deactivateAdd$;
  @Input() localState: any;

  @Output() lineItem = new EventEmitter<bl_fi_mst_entity_line_RowClass>();

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true,
    cellStyle: { textAlign: 'left' },
  };

  gridApi;
  pagination = new Pagination();
  SQLGuids: string[] = null;
  entityGuid;
  @Input() customerEnt$: Observable<any>;

  protected readonly index = 4;
  prevIndex: number;
  private prevLocalState: any;
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  columnsDefs;
  rowData: any[] = [];
  // apiVisa = AppConfig.ApiVisa;
  labelGuids: any = [];
  tempCat$: Observable<boolean>;
  tryError$: Observable<any[]>;
  tempCatRow$: Observable<any>;
  itemCategory$: Observable<any[]>;
  protected subs = new SubSink();
  updatedCat$: Observable<boolean>;
  apiVisa = AppConfig.apiVisa;
  selectedRowIndex: number;
  constructor(
    private itemPricing: ItemEntityPricingService,
    private fiservice: FinancialItemService,
    private readonly store: Store<CustomerStates>,
    private viewColFacade: ViewColumnFacade,
    private readonly componentStore: ComponentStore<LocalState>
  ) {
    this.columnsDefs = [
      { headerName: 'Item Code', field: 'item_code', sort: 'desc', suppressSizeToFit: true },
      {
        headerName: 'Item Name', field: 'item_name', filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Customer Item Code', field: 'bl_fi_mst_item_entity_pricing_link.entity_item_code', filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Customer Item Name', field: 'bl_fi_mst_item_entity_pricing_link.entity_item_name', filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Currency', field: 'currency', filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Purchase Price', field: 'bl_fi_mst_item_entity_pricing_link.purchase_unit_price', filter: 'agTextColumnFilter', cellStyle: () => ({ 'text-align': 'left' }), valueFormatter: this.currencyFormatter
      },
      {
        headerName: 'Sales Price', field: 'bl_fi_mst_item_entity_pricing_link.sales_unit_price', filter: 'agTextColumnFilter', cellStyle: () => ({ 'text-align': 'left' }), valueFormatter: this.currencyFormatter
      },
    ];
  }

  ngOnInit() {
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.subs.sink = this.localState$.subscribe(a => {
      if (a.rowIndexList === null) {
        this.gridApi.deselectAll();
      }
    });
    this.subs.sink = this.customerExt$.subscribe(data => {
      if (data != null) {
        this.entityGuid = data.bl_fi_mst_entity_hdr.guid;
        this.retrieveData([this.setCriteria('calcTotalRecords', 'true')]);
      }
    })
    this.customerEnt$ = this.store.select(CustomerSelectors.selectContainer);
    // this.subs.sink = this.customerEnt$.subscribe(
    //   data => {
    //     console.log("data: ",data)
    //     // this.form.patchValue({
    //     //   customerName: data.bl_fi_mst_entity_hdr.name,
    //     //   customerCode: data.bl_fi_mst_entity_hdr.customer_code,
    //     //   // currency: data.bl_fi_mst_entity_ext.find(x => x.param_code === "CURRENCY")?.value_json.currency,
    //     // })
    //   }
    // )
  }

  currencyFormatter(params) {
    if (params.value) {
      let val = parseFloat(params.value.toString());
      val.toFixed(5);
      return val.toFixed(2);
    }
    else {
      return params.value;
    }
  }

  // tslint:disable-next-line: member-ordering
  searchValue;
  quickSearch() {
    this.gridApi.setQuickFilter(this.searchValue);
  }

  onRowClicked(entity) {
    const genDoc = { ...entity.data };
    delete genDoc['item_code'];
    delete genDoc['item_name'];
    delete genDoc['currency'];
    this.selectedRowIndex = entity.rowIndex;
    // this.store.dispatch(EntityActions.onRowClick({ rowData: entity }));
    this.store.dispatch(CustomerActions.selectCustomerEditExt({ ext: genDoc }));

    if (!this.localState.deactivateList) {
      this.viewColFacade.updateInstance(this.index, { ...this.localState, deactivateList: true, rowIndexList: this.selectedRowIndex });
      this.viewColFacade.onNextAndReset(this.index, 37);
    }
  }

  retrieveData(criteria) {
    if (criteria) {
      const datasource = {
        getRows: this.getRowsFactory(criteria)

      }
      this.gridApi.setServerSideDatasource(datasource);
    }
  }

  getRowsFactory(criteria) {
    // let offset = 0;
    // let limit = this.paginationComponent.rowPerPage;
    return grid => {
      this.pagination.offset = this.SQLGuids ? 0 : grid.request.startRow;
      this.pagination.limit = grid.request.endRow - grid.request.startRow;
      this.pagination.conditionalCriteria = [
        { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
        { columnName: 'order', operator: '=', value: 'ASC' },
        {
          columnName: 'entity_hdr_guid', operator: '=',
          value: this.entityGuid ? this.entityGuid.toString() : ''
        }
      ];
      // this.store.dispatch(InternalPackingOrderActions.loadPackingOrdersInit({request: grid.request}));
      this.subs.sink = this.itemPricing.getByCriteria(this.pagination, AppConfig.apiVisa)
        .pipe(
          mergeMap(b => {
            const source: Observable<ItemEntityPricingContainerModel>[] = [];
            b.data.forEach(doc => source.push(
              zip(
                this.fiservice.getByGuid(doc.bl_fi_mst_item_entity_pricing_link.item_hdr_guid.toString(), AppConfig.apiVisa).pipe(
                  catchError((err) => of(err))
                )).pipe(
                  map(([b_a]) => {
                    console.log("b_d: ", b_a);
                    doc = Object.assign({
                      item_code: b_a.error ? b_a.error.code : b_a.data.bl_fi_mst_item_hdr.code,
                      item_name: b_a.error ? b_a.error.code : b_a.data.bl_fi_mst_item_hdr.name,
                      currency: b_a.error ? b_a.error.code : b_a.data.bl_fi_mst_item_hdr.ccy_code,
                    }, doc);
                    console.log("currency: ", doc);
                    return doc;
                  })
                )
            ));
            return iif(() => b.data.length > 0,
              forkJoin(source).pipe(map((b_inner) => {
                b.data = b_inner;
                return b
              })),
              of(b)
            );
          })
        )
        .subscribe(resolved => {
          // this.store.dispatch(InternalPackingOrderActions.loadPackingOrderSuccess({totalRecords: resolved.totalRecords}));
          // this.gridApi.setRowData(resolved.data);
          grid.successCallback(resolved.data, resolved.totalRecords);
          this.gridApi.forEachNode(node => {
            if (node.rowIndex == this.localState.rowIndexList) {
              node.setSelected(true);
            }
          });
          this.entityGuid = null;
        }, err => {
          // this.store.dispatch(InternalPackingOrderActions.loadPackingOrderFailed({error: err.message}));
          // grid.failCallback();
        });
    }
  };

  setCriteria(columnName, value) {
    return { columnName, operator: '=', value }
  }

  createNewItemExt(
    param_code: string,
    param_name: string,
    param_type: string,
    param_value: any,
  ) {
    const obj = new bl_fi_mst_entity_ext_RowClass();
    obj.param_name = param_name;
    obj.param_code = param_code;
    obj.status = 'ACTIVE';
    obj.param_type = param_type;
    if (param_type.toUpperCase() === 'STRING') {
      obj.value_string = param_value;
    } else if (param_type.toUpperCase() === 'DATE') {
      obj.value_datetime = param_value;
    } else if (param_type.toUpperCase() === 'NUMERIC') {
      obj.value_numeric = param_value;
    } else if (param_type.toUpperCase() === 'JSON') {
      obj.value_json = param_value;
    } else {
      obj.value_file = param_value;
    }
    return obj;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}


