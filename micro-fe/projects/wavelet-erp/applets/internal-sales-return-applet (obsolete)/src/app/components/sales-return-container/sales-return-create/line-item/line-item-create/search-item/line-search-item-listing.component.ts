import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Pagination, FinancialItemService, SubQueryService } from 'blg-akaun-ts-lib';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';
import { fiItemSearchModel } from '../../../../../../models/advanced-search-models/fi-item.model';
import { map, switchMap } from 'rxjs/operators';
import { SearchQueryModel } from 'projects/shared-utilities/models/query.model';
import { PaginationComponent } from 'projects/shared-utilities/utilities/pagination/pagination.component';
import { pageFiltering, pageSorting } from 'projects/shared-utilities/listing.utils';
import { DefaultPagingResponseModel } from '../../../../../../models/default-paging-response.model';
import { of } from 'rxjs';

@Component({
  selector: 'app-line-search-item-listing',
  templateUrl: './line-search-item-listing.component.html',
  styleUrls: ['./line-search-item-listing.component.scss']
})
export class LineSearchItemListingComponent implements OnInit, OnDestroy {

  @Input() localState: any;
  @Output() addSerialNumber = new EventEmitter();
  @Output() addLineItem = new EventEmitter();

  protected subs = new SubSink();

  gridApi;
  searchModel = fiItemSearchModel
  pagination = new Pagination();
  SQLGuids: string[] = null;
  public search = new FormControl();

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: {suppressFilterButton: true},
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
    { headerName: 'Unit Price', field: 'unit_price', editable: true,  type: 'numericColumn', floatingFilter: true,
      valueSetter: function (params) { 
        params.data.unit_price = parseFloat(params.newValue).toFixed(2);
        // params.data.txn_amount = params.data.unit_price * params.data.qty
        return true;
      } 
    },   
    // { headerName: 'Qty', field: 'qty', editable: true, type: 'numericColumn',
    //   valueSetter: params => { 
    //     params.data.qty = params.newValue;
    //     params.data.txn_amount = params.data.unit_price * params.data.qty
    //     return true;
    //   } 
    // }, 
    // { headerName: 'Txn Amount', field: 'txn_amount', type: 'numericColumn',
    //   valueFormatter: params => {
    //     if (!params.data.unit_price)
    //       params.data.txn_amount = 0;
    //     else  
    //       params.data.txn_amount = params.data.unit_price * params.data.qty;
    //     return params.data.txn_amount;
    //   },
    // }
    { headerName: 'System Stock Balance', field: 'stock_bal', type: 'numericColumn', floatingFilter: true },
  ];

  @ViewChild(PaginationComponent) paginationComp: PaginationComponent;

  constructor(
    protected fiService: FinancialItemService,
    private subQueryService: SubQueryService) {
  }

  ngOnInit() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.paginationGoToPage(3);
    this.gridApi.closeToolPanel();
    this.setGridData();
  } 

  setGridData() {
    const apiVisa = AppConfig.apiVisa;
    const datasource = {
      getRows: grid => {
        // this.store.dispatch(PurchaseOrderActions.loadPurchaseOrderInit({request: grid.request}));
        const filter = pageFiltering(grid.request.filterModel);
        const sortOn = pageSorting(grid.request.sortModel);
        this.pagination.offset = this.SQLGuids ? 0 : grid.request.startRow;
        this.pagination.limit = grid.request.endRow - grid.request.startRow;
        this.pagination.conditionalCriteria = [
          { columnName: 'txn_class', operator: '=', value: 'PNS' },
          { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
          { columnName: 'orderBy', operator: '=', value: 'date_updated' },
          { columnName: 'order', operator: '=', value: 'DESC' },
          { columnName: 'guids', operator: '=',
            value: this.SQLGuids ? this.SQLGuids.slice(grid.request.startRow, grid.request.endRow).toString() : ''
          }
        ];
        this.subs.sink = this.fiService.getByCriteria(this.pagination, apiVisa).pipe(
          map((a: any) => {
            const source: any[] = [];
            a.data.forEach(c => {
              let hdr = c.bl_fi_mst_item_hdr
              let value = null
              if (hdr.price_json && hdr.price_json.item_base_uom_pricing) {
                value = hdr.price_json.item_base_uom_pricing[0].price_amount
              }
              const item = {
                "item_guid": hdr.guid,
                "item_code": hdr.code,
                "item_name": hdr.name,
                "uom": hdr.uom,
                "unit_price": value,
                "item_type": null,
                "item_txn_type": hdr.txn_type
              }
              source.push(item);
            })
            a.data = source;
            return a;
          })
        ).subscribe(resolved => {
          const data = sortOn(resolved.data).filter(entity => filter.by(entity));
          const totalRecords = filter.isFiltering ? (this.SQLGuids ? this.SQLGuids.length : resolved.totalRecords) : data.length;
          // if (this.paginationComp.currentPage > this.paginationComp.totalPage.value)
          //   this.paginationComp.firstPage();
          // console.log(data);
          // console.log(totalRecords);
          grid.success({
            rowData: data,
            rowCount: totalRecords
          });
          this.gridApi.forEachNode(a => {
            if (a.data.item_guid === this.localState.selectedItem) {
              a.setSelected(true);
            }
          });
          // this.store.dispatch(PurchaseOrderActions.loadPurchaseOrderSuccess({ totalRecords: a.totalRecords }));
        }, err => {
          console.log(err);
          grid.fail();
          // this.store.dispatch(PurchaseOrderActions.loadGuestTenantFailure({error: err.message}));
        });
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
    // this.subs.sink = this.store.select(PurchaseOrderSelectors.selectAgGrid).subscribe(resolved => {
    //   if (resolved) {
    //     this.gridApi.refreshServerSideStore({ purge: true });
    //     this.store.dispatch(PurchaseOrderActions.resetAgGrid());
    //   }
    // });
  }

  onSearch(e: SearchQueryModel) {
    if (!e.isEmpty) {
      const sql = {
        subquery: e.queryString,
        table: e.table
      };
      this.subs.sink = this.subQueryService.post(sql, AppConfig.apiVisa).subscribe({ next: resolve => {
          this.SQLGuids = resolve.data;
          this.paginationComp.firstPage();
          this.gridApi.refreshServerSideStore();
        }}
      );
    } else {
      this.SQLGuids = null;
      this.paginationComp.firstPage();
      this.gridApi.refreshServerSideStore();
    }
  }

  searchBySerial() {
    const serial = this.search.value;
    let query = `
      SELECT fi.guid as requiredGuid
      FROM bl_inv_serial_number_hdr AS serial
      INNER JOIN bl_inv_mst_item_hdr AS inv ON serial.item_guid = inv.guid
      INNER JOIN bl_fi_mst_item_hdr AS fi ON inv.guid_fi_mst_item = fi.guid
      WHERE serial.sn_id = '${serial}'
    `;
    const requestBody = {
      subquery: query,
      table: 'bl_fi_mst_item_hdr'
    };
    this.subQueryService.post(
      requestBody,
      AppConfig.apiVisa
    ).pipe(
      switchMap(resp => {
        if (resp.data.length) {
          let page = new Pagination();
          page.conditionalCriteria = [
            { columnName: 'guids', operator: '=', value: resp.data[0] }
          ];
          return this.fiService.getByCriteria(page, AppConfig.apiVisa)
        } else {
          return of(DefaultPagingResponseModel);
        }
      })
    ).subscribe(
      { next: (resolve: any) => {
        if (resolve.data) {
          const item = resolve.data[0].bl_fi_mst_item_hdr;
          const lineItem = {
            item_code: item.code,
            item_guid: item.guid,
            item_name: item.name,
            item_txn_type: item.txn_type,
            item_type: null,
            // unit_price: "0.00",
            uom: item.uom
          };
          this.addSerialNumber.emit(serial);
          this.addLineItem.emit(lineItem);
        }
      }}
    );
  }

  // pageFiltering(filterModel) {
  //   const noFilters = Object.keys(filterModel).length <= 0;
  //   if (noFilters) {
  //     return {
  //       by: (viewModel) => true,
  //       isFiltering: noFilters
  //     };
  //   }
  //   return {
  //     by: (viewModel: any) => Object
  //       .keys(filterModel)
  //       .map((col) => viewModel[col]?.toString().toLowerCase().includes(filterModel[col].filter.toLowerCase()))
  //       .reduce((p, c) => p && c),
  //     isFiltering: noFilters
  //   };
  // }

  onRowClicked(lineItem) {
    let column = this.gridApi.getFocusedCell().column.getColId();
    if (lineItem && column != 'unit_price') {
      this.addLineItem.emit(lineItem);
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}