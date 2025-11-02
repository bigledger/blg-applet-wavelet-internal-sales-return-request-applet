import { Component, OnInit } from '@angular/core';
import { salesReturnSearchModel } from '../../../../../../../models/advanced-search-models/internal-sales-return.model';

@Component({
  selector: 'app-issue-link-edit-linked-issues',
  templateUrl: './issue-link-edit-linked-issues.component.html',
  styleUrls: ['./issue-link-edit-linked-issues.component.scss']
})
export class IssueLinkEditLinkedIssuesComponent implements OnInit {

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
    { headerName: 'Project', field: 'project', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Issue Type', field: 'issueType', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Issue Number', field: 'issueNumber', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Summary', field: 'summary', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Description', field: 'description', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Assignee', field: 'assignee', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Due Date', field: 'dueDate', type: 'rightAligned' },
    { headerName: 'Status', field: 'status', cellStyle: () => ({ 'text-align': 'left' }) },
  ];

  rowData = [
    { project: "Project Q", issueType: "Bugs", issueNumber: "A-13028", summary: "Website bug",
      description: "bugs bugs bugs", assignee: "Qureshi", dueDate: "2021-02-15", status: "To Do" }
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