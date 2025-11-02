import { AfterViewChecked, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { bl_fi_generic_doc_line_RowClass, bl_fi_generic_doc_hdr_RowClass } from 'blg-akaun-ts-lib';
import * as moment from 'moment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-internal-sales-proforma-invoice-create-settlement',
  templateUrl: './internal-sales-proforma-invoice-create-settlement.component.html',
  styleUrls: ['./internal-sales-proforma-invoice-create-settlement.component.css']
})
export class InternalSalesProformaInvoiceCreateSettlementComponent implements OnInit, AfterViewChecked {

  @Input() localState: any;
  @Input() rowData: bl_fi_generic_doc_line_RowClass[] = [];
  @Input() draft$: Observable<bl_fi_generic_doc_hdr_RowClass>;
  @Input() pns: bl_fi_generic_doc_line_RowClass[] = [];

  @Output() next = new EventEmitter();
  @Output() lineItem = new EventEmitter<bl_fi_generic_doc_line_RowClass>();

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: {suppressFilterButton: true},
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true
  };

  gridApi;

  columnsDefs = [
    // {headerName: 'Doc #', field: 'server_doc_1', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Date', field: 'date_txn', type: 'rightAligned',
    valueFormatter: (params) => moment(params.value).format('YYYY-MM-DD')},
    {headerName: 'Amount', field: 'amount_net', type: 'numericColumn',
    valueFormatter: (params) => typeof(params.value) === 'number' ? params.value.toFixed(2) : params.value},
    {headerName: 'Details', field: 'item_name', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Remarks', field: 'item_remarks', cellStyle: () => ({'text-align': 'left'})},
    // {headerName: 'Status', field: 'status', cellStyle: () => ({'text-align': 'left'})},
    // {headerName: 'Cancellation Remarks', field: '', cellStyle: () => ({'text-align': 'left'})},
  ];

  total = '0.00';
  outstanding = '0.00';

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewChecked() {
    this.total = this.rowData.length ? this.rowData.map(r =>
      parseFloat(r.amount_txn?.toString())).reduce((acc, c) =>
      (acc + c)).toFixed(2) : '0.00';
    if (this.total === 'NaN') {
      this.total = '0.00';
    }
    const debt = this.pns.length ? this.pns.map(r =>
      parseFloat(r.amount_txn?.toString())).reduce((acc, c) =>
      (acc + c)).toFixed(2) : '0.00';
    this.outstanding = (parseFloat(debt) - parseFloat(this.total)).toFixed(2);
    if (this.outstanding === 'NaN') {
      this.outstanding = '0.00';
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
  }

  onNext() {
    this.next.emit();
  }

  onRowClicked(event: bl_fi_generic_doc_line_RowClass) {
    this.lineItem.emit(event);
  }

}
