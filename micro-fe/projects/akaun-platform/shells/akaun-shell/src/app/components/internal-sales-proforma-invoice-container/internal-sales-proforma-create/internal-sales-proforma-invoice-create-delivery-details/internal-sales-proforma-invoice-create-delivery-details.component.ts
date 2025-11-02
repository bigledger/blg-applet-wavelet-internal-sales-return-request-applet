import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { bl_fi_generic_doc_line_RowClass, bl_fi_generic_doc_hdr_RowClass } from 'blg-akaun-ts-lib';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-internal-sales-proforma-invoice-create-delivery-details',
  templateUrl: './internal-sales-proforma-invoice-create-delivery-details.component.html',
  styleUrls: ['./internal-sales-proforma-invoice-create-delivery-details.component.css']
})
export class InternalSalesProformaInvoiceCreateDeliveryDetailsComponent implements OnInit {

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
  };

  gridApi;

  columnsDefs = [
    {headerName: 'Trip No', field: 'item_code', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Driver Name', field: 'item_name', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Vehicle No', field: 'item_property_json.uom', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Job Start Date', field: 'quantity_base', cellStyle: () => ({'text-align': 'left'}) },
    {headerName: 'Job End Date', field: 'quantity_base', cellStyle: () => ({'text-align': 'left'}) },
    {headerName: 'Delivery Status', field: 'quantity_base', cellStyle: () => ({'text-align': 'left'}) },
    {headerName: 'Recipient Name', field: 'quantity_base', cellStyle: () => ({'text-align': 'left'}) },
    {headerName: 'Qty', field: 'quantity_base'},
  ];

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
