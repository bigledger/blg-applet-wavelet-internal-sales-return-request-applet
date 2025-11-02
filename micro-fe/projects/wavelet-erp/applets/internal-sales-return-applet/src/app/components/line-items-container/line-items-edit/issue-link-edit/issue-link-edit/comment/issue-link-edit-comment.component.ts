import { Component, OnInit } from '@angular/core';
import { salesReturnSearchModel } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/models/advanced-search-models/internal-sales-return.model';

@Component({
  selector: 'app-edit-issue-link-edit-comment',
  templateUrl: './issue-link-edit-comment.component.html',
  styleUrls: ['./issue-link-edit-comment.component.scss']
})
export class EditLineItemIssueLinkEditCommentComponent implements OnInit {

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
    { headerName: 'Date', field: 'date', type: 'rightAligned' },
    { headerName: 'User', field: 'user', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Comments', field: 'comments', cellStyle: () => ({ 'text-align': 'left' }) }
  ];

  rowData = [
    { date: "02-02-2021", user: "Qureshi", comments: "Ryūjin no ken wo kūrae" }
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