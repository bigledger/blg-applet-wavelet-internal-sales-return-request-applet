import { Component, OnInit } from '@angular/core';
import { salesReturnSearchModel } from '../../../../../../../models/advanced-search-models/internal-sales-return.model';

@Component({
  selector: 'app-issue-link-edit-comment',
  templateUrl: './issue-link-edit-comment.component.html',
  styleUrls: ['./issue-link-edit-comment.component.scss']
})
export class IssueLinkEditCommentComponent implements OnInit {

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
    { headerName: 'User', field: 'user', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Comments', field: 'comments', cellStyle: () => ({ 'text-align': 'left' }) }
  ];

  rowData = [
    { date: "2021-02-02", user: "Qureshi", comments: "Ryūjin no ken wo kūrae" }
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

}