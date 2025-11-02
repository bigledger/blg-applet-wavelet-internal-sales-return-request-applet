import { Component, EventEmitter, OnInit, OnDestroy, Input, Output, ViewChild } from '@angular/core';
import { SubSink } from 'subsink2';
import { forkJoin, iif, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Pagination, SubQueryService, InternalOutboundDeliveryOrderService } from 'blg-akaun-ts-lib';
import { AppConfig } from 'projects/shared-utilities/visa';
import { supplierDeliveryOrderLineItemSearchModel } from '../../../../../../models/advanced-search-models/line-item.model';
import { PaginationComponent } from 'projects/shared-utilities/utilities/pagination/pagination.component';
import { SearchQueryModel } from 'projects/shared-utilities/models/query.model';
import { pageFiltering, pageSorting } from 'projects/shared-utilities/listing.utils';

@Component({
  selector: 'app-line-supplier-delivery-order-item-listing',
  templateUrl: './line-supplier-delivery-order-item-listing.component.html',
  styleUrls: ['./line-supplier-delivery-order-item-listing.component.css']
})
export class LineSupplierDeliveryOrderItemListingComponent implements OnInit, OnDestroy {

  @Input() localState: any;

  @Output() addLineItem = new EventEmitter();

  protected subs = new SubSink();

  searchModel = supplierDeliveryOrderLineItemSearchModel;
  gridApi;
  SQLGuids: string[] = null;
  pagination = new Pagination();

  @ViewChild(PaginationComponent) paginationComp: PaginationComponent;

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true
  };

  columnsDefs = [
    { headerName: 'Delivery Order No.', field: 'doc_number', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Item Code', field: 'item_code', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Item Name', field: 'item_name', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Delivery Order Qty', field: 'order_qty', type: 'numericColumn' },
    { headerName: 'Delivered Qty', field: 'del_qty', type: 'numericColumn' },
    { headerName: 'Open Qty', field: 'open_qty', type: 'numericColumn' },
    { headerName: 'UOM', field: 'uom', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Unit Price', field: 'unit_price', editable: true,  type: 'numericColumn',
      valueSetter: function (params) { 
        params.data.unit_price = params.newValue;
        return true;
      } 
    },
    { headerName: 'Status', field: 'status', cellStyle: () => ({ 'text-align': 'left' }) }
  ];


  constructor(
    private odoService: InternalOutboundDeliveryOrderService,
    private subQueryService: SubQueryService) {
  }

  ngOnInit() {
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
        this.pagination.offset = this.SQLGuids ? 0 : grid.request.startRow;
        this.pagination.limit = grid.request.endRow - grid.request.startRow;
        this.pagination.conditionalCriteria = [
          { columnName: 'line_txn_type', operator: '=', value: 'PNS' },
          { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
          { columnName: 'orderBy', operator: '=', value: 'updated_date' },
          { columnName: 'order', operator: '=', value: 'DESC' },
          {
            columnName: 'guids', operator: '=',
            value: this.SQLGuids ? this.SQLGuids.slice(grid.request.startRow, grid.request.endRow).toString() : ''
          }
        ];
        const filter = pageFiltering(grid.request.filterModel);
        const sortOn = pageSorting(grid.request.sortModel);
        this.subs.sink = this.odoService.getLinesByCriteria(this.pagination, apiVisa).pipe(
          mergeMap(b => {
            const source: Observable<any>[] = [];
            b.data.forEach(doc => source.push(
              this.odoService.getByGuid(doc.bl_fi_generic_doc_hdr.guid.toString(), apiVisa).pipe(
                map((b_a) => {
                  let aggContra = 0; // aggregate Contra
                  b_a.data.bl_fi_generic_doc_link.forEach(link => {
                    if (link.guid_doc_1_hdr === doc.bl_fi_generic_doc_hdr.guid &&
                      link.guid_doc_1_line === doc.bl_fi_generic_doc_line[0].guid && link.txn_type === 'IODO_ISI') {
                        let contra = Number(link.quantity_signum) * Number(link.quantity_contra);
                        aggContra += contra;
                    }
                  });
                  const data = {
                    hdr_guid: doc.bl_fi_generic_doc_hdr.guid,
                    server_doc_type_hdr: doc.bl_fi_generic_doc_hdr.server_doc_type,
                    line_guid: doc.bl_fi_generic_doc_line[0].guid,
                    server_doc_type_line: doc.bl_fi_generic_doc_line[0].server_doc_type,
                    doc_number: doc.bl_fi_generic_doc_hdr.server_doc_1,
                    item_guid: doc.bl_fi_generic_doc_line[0].item_guid,
                    item_code: doc.bl_fi_generic_doc_line[0].item_code,
                    item_name: doc.bl_fi_generic_doc_line[0].item_name,
                    item_type: 'deliveryOrder',
                    order_qty: doc.bl_fi_generic_doc_line[0].quantity_base,
                    open_qty: Number(doc.bl_fi_generic_doc_line[0].quantity_base) + aggContra,
                    unit_price: null,
                    uom: null,
                    status: null,
                    item_txn_type: doc.bl_fi_generic_doc_line[0].item_txn_type
                  } 
                  return data;
                })
              )
            ));
            return iif(() => b.data.length > 0,
              forkJoin(source).pipe(map((b_inner) => {
                b.data = <any>b_inner;
                return b;
              })),
              of(b)
            );
          })
        ).subscribe(resolved => {
          const data = sortOn(resolved.data).filter(entity => filter.by(entity));
          const totalRecords = filter.isFiltering ? (this.SQLGuids ? this.SQLGuids.length : resolved.totalRecords) : data.length;
          grid.success({
            rowData: data,
            rowCount: totalRecords
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
          this.SQLGuids = resolve.data;
          this.paginationComp.firstPage();
          this.gridApi.refreshServerSideStore();
        }
      });
    } else {
      this.SQLGuids = null;
      this.paginationComp.firstPage();
      this.gridApi.refreshServerSideStore();
    }
  }

  onRowClicked(lineItem) {
    console.log(lineItem);
    let column = this.gridApi.getFocusedCell().column.getColId();
    if (lineItem && column != 'unit_price') {
      this.addLineItem.emit(lineItem);
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
