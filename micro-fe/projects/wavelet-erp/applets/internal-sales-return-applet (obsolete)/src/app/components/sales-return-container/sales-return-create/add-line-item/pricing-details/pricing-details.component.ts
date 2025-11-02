import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { bl_fi_generic_doc_ext_RowClass } from 'blg-akaun-ts-lib';
import * as moment from 'moment';

@Component({
  selector: 'app-line-item-pricing-details',
  templateUrl: './pricing-details.component.html',
  styleUrls: ['./pricing-details.component.scss']
})
export class LineItemPricingDetailsComponent implements OnInit {

  // @Input() localState: any;
  // @Input() rowData: bl_fi_generic_doc_ext_RowClass[] = [];

  // @Output() next = new EventEmitter();
  // @Output() extItem = new EventEmitter<bl_fi_generic_doc_ext_RowClass>();

  rowData = [];
  gridApi;

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

   // columnsDefs = [
  //   { headerName: 'Pricing Schema Code', field: 'property_json.fileName', cellStyle: () => ({ 'text-align': 'left' }) },
  //   { headerName: 'Pricing Schema Name', field: 'property_json.fileName', cellStyle: () => ({ 'text-align': 'left' }) },
  //   { headerName: 'Unit Price', field: 'property_json.fileName', type: 'numericColumn'},
  //   { headerName: 'Modified Date', field: 'created_date', type: 'rightAligned', 
  //     valueFormatter: (params) => moment(params.value).format('YYYY-MM-DD') },
  // ];

  columnsDefs = [
    { headerName: 'Pricing Schema Code', field: 'schema_code', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Pricing Schema Name', field: 'schema_name', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Unit Price', field: 'unit_price', type: 'numericColumn', editable: true },
    { headerName: 'Modified Date', field: 'mod_date', type: 'rightAligned', 
      valueFormatter: (params) => moment(params.value).format('YYYY-MM-DD') },
  ];

  // rowData = [
  //   { schema_code: "PRICE_001", schema_name: "Retail Price", unit_price: 2599.00, mod_date: "2021" }
  // ];

  uom = new FormControl()

  constructor() { }

  ngOnInit() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
  }

  onNext() {
    // this.next.emit();
  }

  onRowClicked(e: bl_fi_generic_doc_ext_RowClass) {
    // this.extItem.emit(e);
  }

}