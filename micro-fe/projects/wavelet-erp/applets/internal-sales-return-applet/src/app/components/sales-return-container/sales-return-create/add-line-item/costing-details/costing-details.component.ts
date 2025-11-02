import { Component, OnDestroy, OnInit } from '@angular/core';
import { bl_fi_generic_doc_ext_RowClass } from 'blg-akaun-ts-lib';
@Component({
  selector: 'app-line-item-costing-details',
  templateUrl: './costing-details.component.html',
  styleUrls: ['./costing-details.component.css']
})
export class LineItemCostingDetailsComponent implements OnInit, OnDestroy {

  gridApi;

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true
  };

  // columnsDefs = [
  //   { headerName: 'Company Code', field: 'property_json.fileName', cellStyle: () => ({ 'text-align': 'left' }) },
  //   { headerName: 'Location Code', field: 'property_json.fileName', cellStyle: () => ({ 'text-align': 'left' }) },
  //   { headerName: 'Qty', field: 'property_json.fileName', type: 'numericColumn' },
  //   { headerName: 'Moving Average Unit Cost', field: 'property_json.fileName', type: 'numericColumn' },
  //   { headerName: 'FIFO Unit Cost', field: 'property_json.fileName', type: 'numericColumn' },
  //   { headerName: 'Manual Unit Cost', field: 'property_json.fileName', type: 'numericColumn' },
  //   { headerName: 'Last Purchase Unit Cost', field: 'property_json.fileName', type: 'numericColumn' },
  // ];

  columnsDefs = [
    { headerName: 'Company Code', field: 'companyCode', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Location Code', field: 'locationCode', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Qty', field: 'qty', type: 'numericColumn' },
    { headerName: 'Moving Average Unit Cost', field: 'moving_unit_cost', type: 'numericColumn' },
    { headerName: 'FIFO Unit Cost', field: 'fifo_unit_cost', type: 'numericColumn' },
    { headerName: 'Manual Unit Cost', field: 'man_unit_cost', type: 'numericColumn' },
    { headerName: 'Last Purchase Unit Cost', field: 'purch_unit_cost', type: 'numericColumn' },
  ];

  rowData = [];

  constructor() { }

  ngOnInit() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.close
  }

  onNext() {
    // this.next.emit();
  }

  onRowClicked(e: bl_fi_generic_doc_ext_RowClass) {
    // this.extItem.emit(e);
  }

  ngOnDestroy() {

  }

}
