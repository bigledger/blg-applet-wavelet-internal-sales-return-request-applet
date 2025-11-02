import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SubSink } from 'subsink2';
import { salesReturnSearchModel } from '../../../../../../models/advanced-search-models/internal-sales-return.model';

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
    floatingFilterComponentParams: {suppressFilterButton: true},
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

  searchModel = salesReturnSearchModel;

  constructor() {}

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