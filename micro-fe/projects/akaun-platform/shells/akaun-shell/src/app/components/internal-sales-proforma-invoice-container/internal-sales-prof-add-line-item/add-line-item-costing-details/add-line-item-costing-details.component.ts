import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { bl_fi_generic_doc_ext_RowClass } from 'blg-akaun-ts-lib';
import * as moment from 'moment';
@Component({
  selector: 'app-add-line-item-costing-details',
  templateUrl: './add-line-item-costing-details.component.html',
  styleUrls: ['./add-line-item-costing-details.component.css']
})
export class AddLineItemCostingDetailsComponent implements OnInit {

  @Input() localState: any;
  @Input() rowData: bl_fi_generic_doc_ext_RowClass[] = [];

  @Output() next = new EventEmitter();
  @Output() extItem = new EventEmitter<bl_fi_generic_doc_ext_RowClass>();

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
    {headerName: 'Company Code', field: 'property_json.fileName', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Location Code', field: 'property_json.fileName', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Qty', field: 'property_json.fileName', type: 'numericColumn'},
    {headerName: 'Moving Average Unit Cost', field: 'property_json.fileName', type: 'numericColumn'},
    {headerName: 'FIFO Unit Cost', field: 'property_json.fileName', type: 'numericColumn'},
    {headerName: 'Manual Unit Cost', field: 'property_json.fileName', type: 'numericColumn'},
    {headerName: 'Last Purchase Unit Cost', field: 'property_json.fileName', type: 'numericColumn'},
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

  onRowClicked(e: bl_fi_generic_doc_ext_RowClass) {
    this.extItem.emit(e);
  }

}
