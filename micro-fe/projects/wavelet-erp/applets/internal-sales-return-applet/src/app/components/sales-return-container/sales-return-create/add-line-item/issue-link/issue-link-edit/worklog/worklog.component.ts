import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { salesReturnSearchModel } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/models/advanced-search-models/internal-sales-return.model';
import { SubSink } from 'subsink2';

@Component({
  selector: 'app-issue-link-edit-worklog',
  templateUrl: './worklog.component.html',
  styleUrls: ['./worklog.component.css']
})
export class IssueLinkEditWorklogComponent implements OnInit, OnDestroy {

  @Input() localState: any;
  @Output() addLog = new EventEmitter();

  protected subs = new SubSink();

  searchModel = salesReturnSearchModel;
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
    { date: "2021-08-02", name: "Qureshi", timeSpent: "40m", description: "Verify in system before replying to customer" }
  ]

  constructor() { }

  ngOnInit() { }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
  }

  onNext() {
    this.addLog.emit();
  }

  onRowClicked(e) {
    // do nothing
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
