import { Component, OnInit } from '@angular/core';
import { salesReturnSearchModel } from '../../../../../../../models/advanced-search-models/internal-sales-return.model';

@Component({
  selector: 'app-issue-link-edit-subtasks',
  templateUrl: './issue-link-edit-subtasks.component.html',
  styleUrls: ['./issue-link-edit-subtasks.component.scss']
})
export class IssueLinkEditSubtasksComponent implements OnInit {

  gridApi;
  searchModel = salesReturnSearchModel;

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
    { headerName: 'Issue Type', field: 'issueType', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Issue Number', field: 'issueNumber', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Summary', field: 'summary', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Description', field: 'description', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Assignee', field: 'assignee', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Priority', field: 'priority', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Due Date', field: 'dueDate', type: 'rightAligned'},
    { headerName: 'Status', field: 'status', cellStyle: () => ({ 'text-align': 'left' })},
  ];

  rowData = [
    { issueType: "Task", issueNumber: "A-13099", summary: "Document", description: "test",
      assignee: "Qureshi", priority: "P3-Normal", dueDate: "2021-07-07", status: "To Do" }
  ]

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

}