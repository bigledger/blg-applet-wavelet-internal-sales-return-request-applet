import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ComponentStore } from '@ngrx/component-store';
import { bl_fi_generic_doc_line_RowClass, InternalSalesReturnService, Pagination, SubQueryService, GenericDocHdrLineService } from 'blg-akaun-ts-lib';
import { ViewColumnFacade } from '../../../facades/view-column.facade';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';
import { LineItemActions } from '../../../state-controllers/line-item-controller/store/actions';
import { SlideRendererComponent } from '../../utilities/slide-renderer/slide-renderer.component';
import { LineItemStates } from '../../../state-controllers/line-item-controller/store/states';
import { map, mergeMap } from 'rxjs/operators';
import { LineItemSelectors } from '../../../state-controllers/line-item-controller/store/selectors';
import { lineItemSearchModel } from '../../../models/advanced-search-models/line-item.model';
import { forkJoin, iif, Observable, of } from 'rxjs';
import { SearchQueryModel } from 'projects/shared-utilities/models/query.model';
import { PaginationComponent } from 'projects/shared-utilities/utilities/pagination/pagination.component';
import { pageFiltering } from 'projects/shared-utilities/listing.utils';
import * as moment from 'moment';
import { isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';

interface LocalState {
  deactivateList: boolean;
  selectedRow: any;
}

@Component({
  selector: 'app-line-items-listing',
  templateUrl: './line-items-listing.component.html',
  styleUrls: ['./line-items-listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class LineItemsListingComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Sales Return Line Items Listing';
  protected readonly index = 0;
  protected localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateList$ = this.componentStore.select(state => state.deactivateList);

  toggleColumn$: Observable<boolean>;
  searchModel = lineItemSearchModel;
  gridApi;
  SQLGuids: string[] = null;
  pagination = new Pagination();

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
    { headerName: 'Sales Return No', field: 'return_no', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    { headerName: 'Item Code', field: 'item_code', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    { headerName: 'Item Name', field: 'item_name', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    // { headerName: 'Delivery', field: 'delivery', cellRenderer: 'slideCellRenderer',
    //   onCellClicked: (params) => null },
    { headerName: 'Ordered Qty', field: 'quantity_base', type: 'numericColumn', floatingFilter: true },
    { headerName: 'Unit Price', field: 'item_property_json.unitPrice', type: 'numericColumn', floatingFilter: true },
    {
      headerName: 'SST/VAT/GST', field: 'amount_tax_gst', type: 'numericColumn',
      valueFormatter: (params) => params.value?.toFixed(2), floatingFilter: true
    },
    {
      headerName: 'Txn Amount', field: 'amount_txn', type: 'numericColumn',
      valueFormatter: (params) => params.value?.toFixed(2), floatingFilter: true
    },
    {
      headerName: 'Creation Date', field: 'created_date', type: 'rightAligned',
      valueFormatter: params => moment(params.value).format('YYYY-MM-DD')
    },
    { headerName: 'Requested Delivery Date', field: 'delivery_date', type: 'rightAligned' }
  ];

  frameworkComponents = {
    slideCellRenderer: SlideRendererComponent,
  };

  @ViewChild(PaginationComponent) paginationComp: PaginationComponent;

  constructor(
    private viewColFacade: ViewColumnFacade,
    private siService: InternalSalesReturnService,
    private GenericDocHdrLineService: GenericDocHdrLineService,
    private subQueryService: SubQueryService,
    private readonly componentStore: ComponentStore<LocalState>,
    private readonly store: Store<LineItemStates>) {
    super();
  }

  ngOnInit() {
    this.toggleColumn$ = this.viewColFacade.toggleColumn$;
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
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
        this.store.dispatch(LineItemActions.loadLineItemInit({ request: grid.request }));
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
        const sortOn = this.pageSorting(grid.request.sortModel);

        const docType: string = "internal-sales-return-requests";
        this.subs.sink = this.GenericDocHdrLineService.getGenericDocumentHdrLineByCriteria(docType, this.pagination, apiVisa).pipe(
          mergeMap(a => {
            const source: Observable<bl_fi_generic_doc_line_RowClass>[] = [];
            a.data.forEach(hdrLine => {
              const line = hdrLine.bl_fi_generic_doc_line[0];
              line['return_no'] = hdrLine.bl_fi_generic_doc_hdr.server_doc_1;
              const delivery_date = hdrLine.bl_fi_generic_doc_exts.find(x =>
                x.guid_doc_line === line.guid)?.value_datetime ?
                  moment(hdrLine.bl_fi_generic_doc_exts.find(x =>
                    x.guid_doc_line === line.guid)?.value_datetime)
                    .format('YYYY-MM-DD hh:mm:ss') : ''
                line['delivery_date'] =  delivery_date;
                source.push(of(line));
            });
            return iif(() => a.data.length > 0,
              forkJoin(source).pipe(map((a_inner) => {
                a.data = <any>a_inner;
                return a
              })),
              of(a)
            );
          })
        )
          // this.subs.sink = this.siService.getLinesByCriteria(this.pagination, apiVisa).pipe(
          //   mergeMap(a => {
          //     const source: Observable<bl_fi_generic_doc_line_RowClass>[] = []
          //     a.data.forEach(doc => {
          //       const line = doc.bl_fi_generic_doc_line[0];
          //       line['return_no'] = doc.bl_fi_generic_doc_hdr.server_doc_1;
          //       source.push(this.siService.getByGuid(line.generic_doc_hdr_guid.toString(), apiVisa).pipe(
          //         map(a => {
          //           const delivery_date = a.data.bl_fi_generic_doc_ext.find(x =>
          //             x.guid_doc_line === line.guid)?.value_datetime ?
          //               moment(a.data.bl_fi_generic_doc_ext.find(x =>
          //                 x.guid_doc_line === line.guid)?.value_datetime)
          //                 .format('YYYY-MM-DD hh:mm:ss') : ''
          //           line['delivery_date'] =  delivery_date;
          //           return line;
          //         })
          //       ));
          //     })
          //     return iif(() => a.data.length > 0,
          //       forkJoin(source).pipe(map((a_inner) => {
          //         a.data = <any>a_inner;
          //         return a
          //       })),
          //       of(a)
          //     );
          //   })
          // )
          .subscribe(resolved => {
            const data = sortOn(resolved.data).filter(entity => filter.by(entity));
            const totalRecords = filter.isFiltering ? (this.SQLGuids ? this.SQLGuids.length : resolved.totalRecords) : data.length;
            grid.success({
              rowData: data,
              rowCount: totalRecords
            });
            this.gridApi.forEachNode(a => {
              if (a.data.guid === this.localState.selectedRow) {
                a.setSelected(true);
              }
            });
          }, err => {
            this.store.dispatch(LineItemActions.loadLineItemFailed({ error: err.message }));
            grid.fail();
          });
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
    this.subs.sink = this.store.select(LineItemSelectors.selectAgGrid).subscribe(a => {
      if (a) {
        this.gridApi.refreshServerSideStore({ purge: true });
        this.store.dispatch(LineItemActions.resetAgGrid());
      }
    });
  }

  onToggle(e: boolean) {
    this.viewColFacade.toggleColumn(e);
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

  pageSorting(sortModel) {
    return (data) => {
      if (sortModel.length <= 0) { return data; }
      let newData = data.map(o => o);
      sortModel.forEach(model => {
        const col = model.colId;
        newData = model.sort === 'asc' ?
          newData.sort((p, c) => {
            if (col.includes('item_property_json')) {
              const column = col.replace('item_property_json.', '');
              return parseFloat(p.item_property_json[column]) > parseFloat(c.item_property_json[column]) ? 1 : -1
            } else {
              return typeof p[col] === 'string' ? (p[col].toLowerCase() > c[col].toLowerCase() ? 1 : -1) : (p[col] > c[col] ? 1 : -1)
            }
          }) :
          newData.sort((p, c) => {
            if (col.includes('item_property_json')) {
              const column = col.replace('item_property_json.', '');
              return parseFloat(p.item_property_json[column]) > parseFloat(c.item_property_json[column]) ? 1 : -1
            } else {
              return typeof p[col] === 'string' ? (p[col].toLowerCase() > c[col].toLowerCase() ? -1 : 1) : (p[col] > c[col] ? -1 : 1)
            }
          })
      });
      return newData;
    };
  }

  onRowClicked(entity: bl_fi_generic_doc_line_RowClass) {
    if (entity && !this.localState.deactivateList) {
      const lineItem = { ...entity }
      delete lineItem['return_no'];
      this.store.dispatch(LineItemActions.selectLineItem({ lineItem })); // initiate select order action as well
      this.viewColFacade.updateInstance<LocalState>(this.index, {
        ...this.localState,
        deactivateList: false,
        selectedRow: entity.guid
      });
      this.viewColFacade.onNextAndReset(this.index, 1);
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
