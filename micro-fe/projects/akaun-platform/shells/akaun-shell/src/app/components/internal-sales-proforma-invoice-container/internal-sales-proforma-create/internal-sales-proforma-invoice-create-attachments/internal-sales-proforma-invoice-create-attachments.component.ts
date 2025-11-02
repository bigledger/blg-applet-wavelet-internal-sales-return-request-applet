import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { bl_fi_generic_doc_ext_RowClass } from 'blg-akaun-ts-lib';
import * as moment from 'moment';

@Component({
  selector: 'app-internal-sales-proforma-invoice-create-attachments',
  templateUrl: './internal-sales-proforma-invoice-create-attachments.component.html',
  styleUrls: ['./internal-sales-proforma-invoice-create-attachments.component.css']
})
export class InternalSalesProformaInvoiceCreateAttachmentsComponent implements OnInit {

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
    // {headerName: 'Title', field: 'item_code', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'File Name', field: 'property_json.fileName', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Size', field: 'property_json.size', type: 'rightAligned'},
    {headerName: 'Uploaded Date', field: 'created_date', type: 'rightAligned', 
    valueFormatter: (params) => moment(params.value).format('YYYY-MM-DD') },
    {headerName: 'Uploaded By', field: 'created_by_subject_guid', cellStyle: () => ({'text-align': 'left'}) },
  ];

  depositUsed = new FormControl();
  usedCreditMemo = new FormControl();

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
