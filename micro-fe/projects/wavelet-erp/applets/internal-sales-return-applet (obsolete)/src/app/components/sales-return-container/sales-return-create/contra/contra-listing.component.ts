import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { bl_fi_generic_doc_hdr_RowClass, ARAPService, Pagination, GenericDocARAPContainerModel } from 'blg-akaun-ts-lib';
import * as moment from 'moment';
import { pageFiltering, pageSorting } from 'projects/shared-utilities/listing.utils';
import { AppConfig } from 'projects/shared-utilities/visa';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink2';

@Component({
  selector: 'app-sales-return-contra-listing',
  templateUrl: './contra-listing.component.html',
  styleUrls: ['./contra-listing.component.scss']
})
export class ContraListingComponent implements OnInit, OnDestroy {

  @Input() localState: any;
  @Input() draft$: Observable<bl_fi_generic_doc_hdr_RowClass>;

  @Output() contraEdit = new EventEmitter();
  @Output() contraCreate = new EventEmitter<GenericDocARAPContainerModel>();

  private subs = new SubSink();

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: {suppressFilterButton: true},
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true,
    onCellClicked: (params) => this.onRowClicked(params.data)
  };

  gridApi;

  columnsDefs = [
    // {headerName: 'Doc No', field: 'bl_fi_generic_doc_arap_contra', cellStyle: () => ({'text-align': 'left'})},
    // {headerName: 'Branch', field: 'item_name', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Server Doc Type', field: 'bl_fi_generic_doc_arap_contra.server_doc_type_doc_2', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Status', field: 'bl_fi_generic_doc_arap_contra.status', cellStyle: () => ({'text-align': 'left'}) },
    {headerName: 'Date', field: 'bl_fi_generic_doc_arap_contra.date_txn', type: 'rightAligned',
    valueFormatter: params => moment(params.value).format('YYYY-MM-DD')},
    {headerName: 'Amount Contra', field: 'bl_fi_generic_doc_arap_contra.amount_contra', type: 'numericColumn' },
  ];

  // depositUsed = new FormControl();
  // usedCreditMemo = new FormControl();

  hdr: bl_fi_generic_doc_hdr_RowClass;

  constructor(
    private arapService: ARAPService
  ) { }

  ngOnInit() {
    this.subs.sink = this.draft$.subscribe({next: resolve => {
      this.hdr = resolve;
      this.gridApi?.refreshServerSideStore();
    }});
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    const datasource = {
      getRows: grid => {
        const sortModel = grid.request.sortModel;
        const filterModel = grid.request.filterModel;
        const sortOn = pageSorting(sortModel);
        const filter = pageFiltering(filterModel);
        this.subs.sink = this.arapService.getByCriteria(new Pagination(
          0, grid.request.endRow - grid.request.startRow,
          [
            {columnName: 'calcTotalRecords', operator: '=', value: 'true'},
            {columnName: 'guid_doc_1_hdr', operator: '=', value: this.hdr.guid.toString()},
          ]
        ), AppConfig.apiVisa).subscribe( resolved => {
          const data = sortOn(resolved.data).filter(entity => filter.by(entity));
          const totalRecords = filter.isFiltering ? resolved.totalRecords : data.length;
          grid.success({
            rowData: data,
            rowCount: totalRecords
          });
        }, err => {
          grid.fail();
        });
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
  }

  onNext() {
    this.contraCreate.emit();
  }

  onRowClicked(e: GenericDocARAPContainerModel) {
    this.contraEdit.emit(e);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
