import { Component, OnDestroy, OnInit } from '@angular/core';
import { salesReturnSearchModel } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/models/advanced-search-models/internal-sales-return.model';

@Component({
  selector: 'app-issue-link-edit-subtasks',
  templateUrl: './subtasks.component.html',
  styleUrls: ['./subtasks.component.css']
})
export class IssueLinkEditSubtasksComponent implements OnInit, OnDestroy {

  // @Input() localState: any;
  // @Input() rowData: any[] = [];

  // @Output() issue = new EventEmitter();

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true
  };

  gridApi;

  columnsDefs = [
    { headerName: 'Issue Type', field: 'issueType', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Issue Number', field: 'issueNumber', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Summary', field: 'summary', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Description', field: 'description', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Assignee', field: 'assignee', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Priority', field: 'priority', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Due Date', field: 'dueDate', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Status', field: 'status', cellStyle: () => ({ 'text-align': 'left' }) },
  ];

  rowData = [
    {
      issueType: "Task", issueNumber: "A-13099", summary: "Document", description: "test",
      assignee: "Qureshi", priority: "P3-Normal", dueDate: "07-07-2021", status: "To Do"
    }
  ]

  searchModel = salesReturnSearchModel;

  constructor() { }

  ngOnInit() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
  }

  onNext() {

  }

  onRowClicked(e) {
    // this.issue.emit(e);
  }

  ngOnDestroy() {

  }

}