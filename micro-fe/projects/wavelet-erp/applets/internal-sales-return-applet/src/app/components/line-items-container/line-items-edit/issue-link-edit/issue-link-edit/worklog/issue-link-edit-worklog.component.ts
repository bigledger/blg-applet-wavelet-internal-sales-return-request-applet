import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { lineItemSearchModel } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/models/advanced-search-models/line-item.model';
// import { lineItemSearchModel } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/models/advanced-search-models/line-item.models';
import { SubSink } from 'subsink2';

@Component({
  selector: 'app-edit-issue-link-edit-worklog',
  templateUrl: './issue-link-edit-worklog.component.html',
  styleUrls: ['./issue-link-edit-worklog.component.scss']
})
export class EditLineItemIssueLinkEditWorklogComponent implements OnInit, OnDestroy {

  @Input() localState: any;
  @Output() addLog = new EventEmitter();

  protected subs = new SubSink();

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

  columnsDefs = [
    { headerName: 'Date', field: 'date', type: 'rightAligned' },
    { headerName: 'Name', field: 'name', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Time Spent', field: 'timeSpent', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Description', field: 'description', cellStyle: () => ({ 'text-align': 'left' }) },
  ];

  rowData = [
    { date: "2021-08-01", name: "Qureshi", timeSpent: "40m", description: "Verify in system before replying to customer" }
  ]

  searchModel = lineItemSearchModel;

  constructor() { }

  ngOnInit() {

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
  }

  onNext() {
    this.addLog.emit();
  }

  onRowClicked(e) {

  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}