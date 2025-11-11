import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApiResponseModel, bl_fi_generic_doc_hdr_RowClass, InternalSalesOrderService, Pagination, SubQueryService } from 'blg-akaun-ts-lib';
import moment from 'moment';
import { formatMoneyInList } from 'projects/shared-utilities/format.utils';
import { pageFiltering, pageSorting } from 'projects/shared-utilities/listing.utils';
import { SearchQueryModel } from 'projects/shared-utilities/models/query.model';
import { PaginationComponent } from 'projects/shared-utilities/utilities/pagination/pagination.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { salesLineItemSearchModel } from '../../../../../../models/advanced-search-models/line-item.model';
import { DraftStates } from '../../../../../../state-controllers/draft-controller/store/states';
import { forkJoin, iif, Observable, of, Subject } from 'rxjs';
import { filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { SubSink } from 'subsink2';

@Component({
  selector: 'app-ko-by-sales-order-item',
  templateUrl: './ko-by-sales-order-item.component.html',
  styleUrls: ['./ko-by-sales-order-item.component.css']
})
export class KoBySalesOrderItemComponent implements OnInit, OnDestroy {

  @Input() localState: any;
  @Input() hdr: bl_fi_generic_doc_hdr_RowClass;

  @Output() addLineItem = new EventEmitter();

  protected subs = new SubSink();

  gridApi;
  searchModel = salesLineItemSearchModel;
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
    { headerName: 'Sales Order No.', field: 'doc_number', cellStyle: () => ({ 'text-align': 'left' }), maxWidth: 100 },
    { headerName: 'Server Doc Type', field: 'server_doc_type_hdr', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Txn Date', field: 'date_txn', cellStyle: () => ({ 'text-align': 'left' }), maxWidth: 100,
      valueFormatter: params => params.value ? moment(params.value).format('YYYY-MM-DD') : null },
    { headerName: 'Item Code', field: 'item_code', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Item Name', field: 'item_name', cellStyle: () => ({ 'text-align': 'left' }) },
    // { headerName: 'Delivered Qty', field: 'del_qty', type: 'numericColumn' },
    { headerName: 'UOM', field: 'uom', cellStyle: () => ({ 'text-align': 'left' }), maxWidth: 100 },
    { headerName: 'Unit Price (Inc. of Tax)', field: 'unit_price_txn', type: 'numericColumn', maxWidth: 150,
      valueFormatter: (params) => params.value ? formatMoneyInList(params.value) : null },
    { headerName: 'Base Qty.', field: 'order_qty', type: 'numericColumn', maxWidth: 100 },
    { headerName: 'Bal. Qty.', field: 'open_qty', type: 'numericColumn', maxWidth: 100 },
    { headerName: 'Knockoff Qty.', type: 'numericColumn', maxWidth: 150,
      valueGetter: (params) => { return params.data.ko_qty; }
    }
  ];

  @ViewChild(PaginationComponent) paginationComp: PaginationComponent;

  constructor(
    private soService: InternalSalesOrderService,
    private subQueryService: SubQueryService,
    private readonly draftStore: Store<DraftStates>) {
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
        sortCriteria.push({ columnName: 'doc_entity_hdr_guid', value: this.hdr.doc_entity_hdr_guid? this.hdr.doc_entity_hdr_guid:'' })

        const limit = grid.request.endRow - grid.request.startRow;
        const pagination = new Pagination(0, limit, criteria, sortCriteria, this.snapshot);

        this.subs.sink = this.soService.getGenericDocumentHdrLineByCriteria(
          pagination,
          apiVisa).subscribe(
            (res) => {
              if (res.data.length > 0) {
                this.snapshot = res.data[res.data.length - 1].bl_fi_generic_doc_hdr.guid.toString();
              }

              let newArrData = new Array;
              newArrData = [...res.data].map((doc) => {

                let aggContra = 0; // aggregate Contra
                doc.bl_fi_generic_doc_links?.forEach(link => {
                  if(
                    // link.server_doc_type_doc_1_line === "INTERNAL_SALES_CREDIT_NOTE" &&
                    link.server_doc_type_doc_2_line === "INTERNAL_SALES_ORDER" &&
                    link.guid_doc_2_line === doc.bl_fi_generic_doc_line.guid &&
                    link.guid_doc_2_hdr === doc.bl_fi_generic_doc_hdr.guid
                  ) {
                    let contra = Number(link.quantity_signum) * Number(link.quantity_contra);
                    aggContra += contra;
                  }
                })

                let newObj = null;
                newObj = {
                  item_type: 'sales',
                  hdr_guid: doc.bl_fi_generic_doc_hdr.guid,
                  server_doc_type_hdr: doc.bl_fi_generic_doc_hdr.server_doc_type,
                  line_guid: doc.bl_fi_generic_doc_line.guid,
                  server_doc_type_line: doc.bl_fi_generic_doc_line.server_doc_type,
                  doc_number: doc.bl_fi_generic_doc_hdr.server_doc_1,

                  item_guid: doc.bl_fi_generic_doc_line.item_guid,
                  item_code: doc.bl_fi_generic_doc_line.item_code,
                  item_name: doc.bl_fi_generic_doc_line.item_name,
                  order_qty: doc.bl_fi_generic_doc_line.quantity_base,
                  open_qty: Number(doc.bl_fi_generic_doc_line.quantity_base) + aggContra,
                  unit_price_std: doc.bl_fi_generic_doc_line.unit_price_std,
                  unit_price_txn: doc.bl_fi_generic_doc_line.unit_price_txn,
                  tax_gst_code: doc.bl_fi_generic_doc_line.tax_gst_code,
                  tax_gst_rate: doc.bl_fi_generic_doc_line.tax_gst_rate,
                  amount_tax_gst: doc.bl_fi_generic_doc_line.amount_tax_gst,
                  tax_wht_code: doc.bl_fi_generic_doc_line.tax_wht_code,
                  tax_wht_rate: doc.bl_fi_generic_doc_line.tax_wht_rate,
                  amount_tax_wht: doc.bl_fi_generic_doc_line.amount_tax_wht,
                  amount_discount: doc.bl_fi_generic_doc_line.amount_discount,
                  amount_net: doc.bl_fi_generic_doc_line.amount_net,
                  amount_std: doc.bl_fi_generic_doc_line.amount_std,
                  amount_txn: doc.bl_fi_generic_doc_line.amount_txn,
                  item_remarks: doc.bl_fi_generic_doc_line.item_remarks,
                  item_txn_type: doc.bl_fi_generic_doc_line.item_txn_type,
                  item_sub_type: doc.bl_fi_generic_doc_line.item_sub_type,
                  guid_dimension: doc.bl_fi_generic_doc_line.guid_dimension,
                  guid_profit_center: doc.bl_fi_generic_doc_line.guid_profit_center,
                  guid_project: doc.bl_fi_generic_doc_line.guid_project,
                  guid_segment: doc.bl_fi_generic_doc_line.guid_segment,
                  item_property_json: doc.bl_fi_generic_doc_line.item_property_json,
                  line_property_json: doc.bl_fi_generic_doc_line.line_property_json,
                  txn_type: doc.bl_fi_generic_doc_line.txn_type,
                  uom: doc.bl_fi_generic_doc_line.uom,
                  uom_to_base_ratio: doc.bl_fi_generic_doc_line.uom_to_base_ratio,
                  qty_by_uom: doc.bl_fi_generic_doc_line.qty_by_uom,
                  unit_price_std_by_uom: doc.bl_fi_generic_doc_line.unit_price_std_by_uom,
                  unit_price_txn_by_uom: doc.bl_fi_generic_doc_line.unit_price_txn_by_uom,
                  unit_disc_by_uom: doc.bl_fi_generic_doc_line.unit_disc_by_uom,
                  status: null,
                  date_txn: doc.bl_fi_generic_doc_line.date_txn,
                  ko_qty: Number(doc.bl_fi_generic_doc_line.quantity_base) + aggContra

                  // serial_no: doc.bl_fi_generic_doc_line[0].serial_no,
                  // bin_no: doc.bl_fi_generic_doc_line[0].bin_no,
                  // batch_no: doc.bl_fi_generic_doc_line[0].batch_no,
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

  onRowClicked(item) {
    // this.store.dispatch(InternalSalesCreditNoteActions.selectPricingSchemeLink({ item }));
    // this.addLineItem.emit(item);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
