import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { bl_fi_generic_doc_line_RowClass, bl_fi_generic_doc_hdr_RowClass } from 'blg-akaun-ts-lib';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-internal-sales-proforma-invoice-create-contra',
  templateUrl: './internal-sales-proforma-invoice-create-contra.component.html',
  styleUrls: ['./internal-sales-proforma-invoice-create-contra.component.css']
})
export class InternalSalesProformaInvoiceCreateContraComponent implements OnInit {

  @Input() localState: any;
  @Input() rowData: bl_fi_generic_doc_line_RowClass[] = [];
  @Input() draft$: Observable<bl_fi_generic_doc_hdr_RowClass>;

  @Output() next = new EventEmitter();
  @Output() lineItem = new EventEmitter<bl_fi_generic_doc_line_RowClass>();

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
    {headerName: 'Doc No', field: 'item_code', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Branch', field: 'item_name', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Server Doc Type', field: 'item_property_json.uom', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Status', field: 'quantity_base', cellStyle: () => ({'text-align': 'left'}) },
    {headerName: 'Date', field: 'quantity_base', cellStyle: () => ({'text-align': 'left'}) },
  ];

  depositUsed = new FormControl()
  usedCreditMemo = new FormControl()

  constructor() { }

  ngOnInit() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
  }

  onNext() {
    this.next.emit();
  }

  onRowClicked(e: bl_fi_generic_doc_line_RowClass) {
    this.lineItem.emit(e);
  }

}
