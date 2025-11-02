import { Component, OnDestroy, OnInit } from '@angular/core';
import { internalSalesGRNSearchModel } from 'projects/wavelet-erp/applets/internal-sales-grn-applet/src/app/models/advanced-search-models/internal-sales-grn.model';

@Component({
  selector: 'app-issue-link-edit-linked-issues',
  templateUrl: './linked-issues.component.html',
  styleUrls: ['./linked-issues.component.css']
})
export class IssueLinkEditLinkedIssuesComponent implements OnInit, OnDestroy {

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
    { headerName: 'Project', field: 'project', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Issue Type', field: 'issueType', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Issue Number', field: 'issueNumber', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Summary', field: 'summary', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Description', field: 'description', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Assignee', field: 'assignee', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Due Date', field: 'dueDate', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Status', field: 'status', cellStyle: () => ({ 'text-align': 'left' }) },
  ];

  rowData = [
    {
      project: "Project Q", issueType: "Bugs", issueNumber: "A-13028", summary: "Website bug",
      description: "bugs bugs bugs", assignee: "Qureshi", dueDate: "15-02-2021", status: "To Do"
    }
  ]

  searchModel = internalSalesGRNSearchModel;

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
