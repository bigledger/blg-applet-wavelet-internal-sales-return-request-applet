import { Component, OnInit } from '@angular/core';
import { salesReturnSearchModel } from '../../../../../../../models/advanced-search-models/internal-sales-return.model';

@Component({
  selector: 'app-issue-link-edit-activity',
  templateUrl: './issue-link-edit-activity.component.html',
  styleUrls: ['./issue-link-edit-activity.component.scss']
})
export class IssueLinkEditActivityComponent implements OnInit {

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
    { headerName: 'Activities', field: 'activities', cellStyle: () => ({ 'text-align': 'left' }) },
  ];

  rowData = [
    { date: "2021-08-02", user: "Qureshi", activities: "Qureshi created the issue A-10245" }
  ]

  searchModel = salesReturnSearchModel;

  constructor() { }

  ngOnInit() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
  }

  onRowClicked(e) {
    // this.issue.emit(e);
  }

}