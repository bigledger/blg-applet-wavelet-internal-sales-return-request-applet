import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { bl_fi_generic_doc_ext_RowClass } from 'blg-akaun-ts-lib';
import * as moment from 'moment';
@Component({
  selector: 'app-add-line-item-pricing-details',
  templateUrl: './add-line-item-pricing-details.component.html',
  styleUrls: ['./add-line-item-pricing-details.component.css']
})
export class AddLineItemPricingDetailsComponent implements OnInit {

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
    suppressCsvExport: true,
    onCellClicked: (params) => this.onRowClicked(params.data)
  };

  gridApi;

  columnsDefs = [
    {headerName: 'Pricing Schema Code', field: 'property_json.fileName', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Pricing Schema Name', field: 'property_json.fileName', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Unit Price', field: 'property_json.fileName', type: 'numericColumn'},
    {headerName: 'Modified Date', field: 'created_date', type: 'rightAligned', 
    valueFormatter: (params) => moment(params.value).format('YYYY-MM-DD') },
  ];

  uom = new FormControl()

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
