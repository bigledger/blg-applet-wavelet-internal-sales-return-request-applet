import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { bl_fi_generic_doc_line_RowClass, GenericDocContainerModel } from 'blg-akaun-ts-lib';

@Component({
  selector: 'app-generic-create-line-items',
  templateUrl: './generic-create-line-items.component.html',
  styleUrls: ['./generic-create-line-items.component.css']
})
export class GenericCreateLineItemsComponent implements OnInit {

  @Input() salesOder: GenericDocContainerModel;
  @Input() localState: any;

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
    {headerName: 'Item Code', field: 'item_code', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Item Name', field: 'item_property_json.batchNo', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Packing Date', field: 'item_property_json.packingDate'},
    {headerName: 'Packing Status', field: 'item_property_json.packingDate', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Delivery Date', field: 'item_property_json.fromCableLength'},
    {headerName: 'Batch No', field: 'item_property_json.drumSize'},
    {headerName: 'Remarks', field: 'item_property_json.remarks', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'UOM', field: 'item_property_json.uom', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Qty', field: 'item_property_json.quantity'},
    {headerName: 'Txn Amount', field: 'item_property_json.quantity'},
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

  onRowClicked(event: bl_fi_generic_doc_line_RowClass) {
    this.lineItem.emit(event);
  }

}
