import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ApiResponseModel, InternalJobsheetService, Pagination, SubQueryService } from 'blg-akaun-ts-lib';
import { pageFiltering, pageSorting } from 'projects/shared-utilities/listing.utils';
import { SearchQueryModel } from 'projects/shared-utilities/models/query.model';
import { PaginationComponent } from 'projects/shared-utilities/utilities/pagination/pagination.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { jobsheetLineItemSearchModel } from '../../../../../../models/advanced-search-models/line-item.model';
import { forkJoin, iif, Observable, of, Subject } from 'rxjs';
import { filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { SubSink } from 'subsink2';

@Component({
  selector: 'app-line-jobsheet-item-listing',
  templateUrl: './line-jobsheet-item-listing.component.html',
  styleUrls: ['./line-jobsheet-item-listing.component.scss']
})
export class LineJobsheetItemListingComponent implements OnInit, OnDestroy {

  @Input() localState: any;
  @Output() addLineItem = new EventEmitter();

  protected subs = new SubSink();

  gridApi;
  searchModel = jobsheetLineItemSearchModel;
  SQLGuids: string[] = null;
  pagination = new Pagination();
  snapshot: any;
  totalCount: number;
  totalRecords$: Subject<number> = new Subject<number>();
  emptyGrid: boolean;
  criteriaList: { columnName: string; operator: string; value: string; }[];

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true
  };

  columnsDefs = [
    { headerName: 'Jobsheet No.', field: 'doc_number', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    { headerName: 'Item Code', field: 'item_code', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    { headerName: 'Item Name', field: 'item_name', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    { headerName: 'Qty', field: 'order_qty', type: 'numericColumn', floatingFilter: true },
    // { headerName: 'Delivered Qty', field: 'del_qty', type: 'numericColumn', floatingFilter: true },
    // { headerName: 'Open Qty', field: 'open_qty', type: 'numericColumn', floatingFilter: true },
    { headerName: 'UOM', field: 'uom', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    // {
    //   headerName: 'Unit Price', field: 'unit_price', editable: true, type: 'numericColumn',
    //   valueSetter: (params) => {
    //     params.data.unit_price = params.newValue;
    //     return true;
    //   }
    // },
    // { headerName: 'Status', field: 'status', cellStyle: () => ({ 'text-align': 'left' }) }
  ];

  @ViewChild(PaginationComponent) paginationComp: PaginationComponent;


  constructor(
    private jsService: InternalJobsheetService,
    private subQueryService: SubQueryService) {
  }

  ngOnInit() {
  }

  searchQuery(query: string) {

    const query$ = this.subQueryService
      .post({ 'subquery': query, 'table': 'bl_fi_generic_doc_line' }, AppConfig.apiVisa)
      .pipe(
        switchMap(resp => of(resp))
      );
    this.subs.sink = query$.pipe(
      tap(a =>
        console.log(a, 'this is a')
      ), filter((resp: ApiResponseModel<any>) => resp.data.length > 0)
    ).subscribe(resp => {
      const criteria = [
        // combine all the guids together separated by commas
        { columnName: 'guids', operator: '=', value: resp.data.join(',') }
      ];
      this.criteriaList = criteria;
      this.setGridData(criteria);
      this.setTotalRecordCount(resp.data.length);
      this.emptyGrid = false;
    });
    this.subs.sink = query$.pipe(
      filter((resp: ApiResponseModel<any>) => resp.data.length === 0))
      .subscribe(resp => {
        this.criteriaList = [];
        this.emptyGrid = true;
        this.setTotalRecordCount(0);
        this.clear();
      });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.setGridData();
  }

  clear() {
    const dataSource = {
      getRows(params: any) {
        params.successCallback([], 0);
      }
    };
    this.gridApi.setServerSideDatasource(dataSource);
  }

  setGridData(criteria?: any) {
    this.snapshot = null;
    const apiVisa = AppConfig.apiVisa;

    const datasource = {
      getRows: grid => {
        const sortModel = grid.request.sortModel;
        const sortCriteria = [];
        if (sortModel.length > 0) {
          sortModel.forEach(element => {
            const columnName = element.colId.split(".")[1]
            sortCriteria.push({ columnName: 'orderBy', value: columnName })
          });
          sortCriteria.push({ columnName: 'order', value: sortModel[0].sort.toUpperCase() })
        }

        const limit = grid.request.endRow - grid.request.startRow;
        const pagination = new Pagination(0, limit, criteria, sortCriteria, this.snapshot);

        this.subs.sink = this.jsService.getGenericDocumentHdrLineByCriteria(
          pagination,
          apiVisa).subscribe(
            (res) => {
              if (res.data.length > 0) {
                this.snapshot = res.data[res.data.length - 1].bl_fi_generic_doc_hdr.guid.toString();
              }

              let newArrData = new Array;
              newArrData = [...res.data].map((doc) => {
                let newObj = null;
                newObj = {
                  hdr_guid: doc.bl_fi_generic_doc_hdr.guid,
                  server_doc_type_hdr: doc.bl_fi_generic_doc_hdr.server_doc_type,
                  line_guid: doc.bl_fi_generic_doc_line.guid,
                  server_doc_type_line: doc.bl_fi_generic_doc_line.server_doc_type,
                  doc_number: doc.bl_fi_generic_doc_hdr.server_doc_1,
                  item_guid: doc.bl_fi_generic_doc_line.item_guid,
                  item_code: doc.bl_fi_generic_doc_line.item_code,
                  item_name: doc.bl_fi_generic_doc_line.item_name,
                  item_type: 'jobsheet',
                  order_qty: doc.bl_fi_generic_doc_line.quantity_base,
                  open_qty: Number(doc.bl_fi_generic_doc_line.quantity_base),
                  unit_price_std: doc.bl_fi_generic_doc_line.unit_price_std,
                  unit_price_txn: doc.bl_fi_generic_doc_line.unit_price_txn,
                  uom: doc.bl_fi_generic_doc_line.uom,
                  status: null,
                  tax_gst_code: doc.bl_fi_generic_doc_line.tax_gst_code,
                  tax_gst_rate: doc.bl_fi_generic_doc_line.tax_gst_rate,
                  amount_tax_gst: doc.bl_fi_generic_doc_line.amount_tax_gst,
                  tax_wht_code: doc.bl_fi_generic_doc_line.tax_wht_code,
                  tax_wht_rate: doc.bl_fi_generic_doc_line.tax_wht_rate,
                  amount_tax_wht: doc.bl_fi_generic_doc_line.amount_tax_wht,
                  item_txn_type: doc.bl_fi_generic_doc_line.item_txn_type,
                  item_sub_type: doc.bl_fi_generic_doc_line.item_sub_type,
                }
                return newObj
              })

              if (this.paginationComp.currentPage > this.paginationComp.totalPage.value) {
                this.paginationComp.firstPage()
              }

              // Calculate totalRecords if end reached.
              const start = grid.request.startRow;
              const end = grid.request.endRow;
              const totalRecords = newArrData.length < (end - start) ? start + newArrData.length : null;

              if (!this.totalCount && totalRecords) {
                this.totalCount = totalRecords;
                this.setTotalRecordCount(totalRecords);
              }

              grid.successCallback(newArrData, totalRecords);

              this.gridApi.forEachNode(a => {
                if (a.data.item_guid === this.localState.selectedItem) {
                  a.setSelected(true);
                }
              });
            }, err => {
              console.log(err);
              grid.failCallback();

            })
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
  }

  setTotalRecordCount(totalCount: number) {
    this.totalRecords$.next(totalCount);
  }

  onSearch(e: SearchQueryModel) {
    if (!e.isEmpty) {
      this.searchQuery(e.queryString);
      console.log('searchQuery', e);

    } else {
      this.criteriaList = [];
      this.emptyGrid = false;
      this.setGridData();
      this.setTotalRecordCount(this.totalCount);
    }
  }

  // setGridData(criteria?: any) {
  //   const apiVisa = AppConfig.apiVisa;
  //   const datasource = {
  //     getRows: grid => {
  //       this.pagination.conditionalCriteria = [
  //         { columnName: 'line_txn_type', operator: '=', value: 'PNS' },
  //         { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
  //         { columnName: 'orderBy', operator: '=', value: 'updated_date' },
  //         { columnName: 'order', operator: '=', value: 'DESC' },
  //         {
  //           columnName: 'line_guids', operator: '=',
  //           value: this.SQLGuids ? this.SQLGuids.slice(grid.request.startRow, grid.request.endRow).toString() : ''
  //         }
  //       ];
  //       const filter = pageFiltering(grid.request.filterModel);
  //       const sortOn = pageSorting(grid.request.sortModel);
  //       this.subs.sink = this.jsService.getLinesByCriteria(this.pagination, apiVisa).pipe(
  //         mergeMap(b => {
  //           const source: Observable<any>[] = [];
  //           b.data.forEach(doc => source.push(
  //             this.jsService.getByGuid(doc.bl_fi_generic_doc_hdr.guid.toString(), apiVisa).pipe(
  //               map((b_a) => {
  //                 let aggContra = 0; // aggregate Contra
  //                 b_a.data.bl_fi_generic_doc_link.forEach(link => {
  //                   if (link.guid_doc_1_hdr === doc.bl_fi_generic_doc_hdr.guid &&
  //                     link.guid_doc_1_line === doc.bl_fi_generic_doc_line[0].guid && link.txn_type === 'IJS_ISGRN') {
  //                     let contra = Number(link.quantity_signum) * Number(link.quantity_contra);
  //                     aggContra += contra;
  //                   }
  //                 });
  //                 const data = {
  //                   hdr_guid: doc.bl_fi_generic_doc_hdr.guid,
  //                   server_doc_type_hdr: doc.bl_fi_generic_doc_hdr.server_doc_type,
  //                   line_guid: doc.bl_fi_generic_doc_line[0].guid,
  //                   server_doc_type_line: doc.bl_fi_generic_doc_line[0].server_doc_type,
  //                   doc_number: doc.bl_fi_generic_doc_hdr.server_doc_1,
  //                   item_guid: doc.bl_fi_generic_doc_line[0].item_guid,
  //                   item_code: doc.bl_fi_generic_doc_line[0].item_code,
  //                   item_name: doc.bl_fi_generic_doc_line[0].item_name,
  //                   item_type: 'jobsheet',
  //                   order_qty: doc.bl_fi_generic_doc_line[0].quantity_base,
  //                   open_qty: Number(doc.bl_fi_generic_doc_line[0].quantity_base),
  //                   unit_price: null,
  //                   uom: null,
  //                   status: null,
  //                   item_txn_type: doc.bl_fi_generic_doc_line[0].item_txn_type
  //                 }
  //                 return data;
  //               })
  //             )
  //           ));
  //           return iif(() => b.data.length > 0,
  //             forkJoin(source).pipe(map((b_inner) => {
  //               b.data = <any>b_inner;
  //               return b
  //             })),
  //             of(b)
  //           );
  //         })
  //       ).subscribe(resolved => {
  //         const data = sortOn(resolved.data).filter(entity => filter.by(entity));
  //         const totalRecords = filter.isFiltering ? (this.SQLGuids ? this.SQLGuids.length : resolved.totalRecords) : data.length;
  //         grid.success({
  //           rowData: data,
  //           rowCount: totalRecords
  //         });
  //         this.gridApi.forEachNode(a => {
  //           if (a.data.item_guid === this.localState.selectedItem) {
  //             a.setSelected(true);
  //           }
  //         });
  //       }, err => {
  //         console.log(err);
  //         grid.fail();
  //       });
  //     }
  //   };
  //   this.gridApi.setServerSideDatasource(datasource);
  // }

  // onSearch(e: SearchQueryModel) {
  //   if (!e.isEmpty) {
  //     const sql = {
  //       subquery: e.queryString,
  //       table: e.table
  //     };
  //     this.subs.sink = this.subQueryService.post(sql, AppConfig.apiVisa).subscribe({
  //       next: resolve => {
  //         this.SQLGuids = resolve.data;
  //         this.paginationComp.firstPage();
  //         this.gridApi.refreshServerSideStore();
  //       }
  //     });
  //   } else {
  //     this.SQLGuids = null;
  //     this.paginationComp.firstPage();
  //     this.gridApi.refreshServerSideStore();
  //   }
  // }

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
