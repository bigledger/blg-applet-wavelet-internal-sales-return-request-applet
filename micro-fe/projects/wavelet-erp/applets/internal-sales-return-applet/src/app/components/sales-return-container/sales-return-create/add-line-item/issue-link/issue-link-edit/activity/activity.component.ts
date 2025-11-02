import { Component, OnDestroy, OnInit } from '@angular/core';
import { salesReturnSearchModel } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/models/advanced-search-models/internal-sales-return.model';

@Component({
  selector: 'app-issue-link-edit-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class IssueLinkEditActivityComponent implements OnInit, OnDestroy {

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
    { headerName: 'Activities', field: 'activities', cellStyle: () => ({ 'text-align': 'left' }) },
  ];

  rowData = [
    { date: "2/8/2021", user: "Qureshi", activities: "Qureshi created the issue A-10245" }
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

  ngOnDestroy() {

  }

}
