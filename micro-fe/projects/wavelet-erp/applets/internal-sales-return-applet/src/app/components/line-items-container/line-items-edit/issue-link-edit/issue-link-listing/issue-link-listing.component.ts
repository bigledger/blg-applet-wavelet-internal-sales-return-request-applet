import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { SubSink } from 'subsink2';
import { lineItemSearchModel } from '../../../../../models/advanced-search-models/line-item.model';
// import { lineItemSearchModel } from '../../../../../models/advanced-search-models/line-item.models';
import { InternalSalesReturnActions } from '../../../../../state-controllers/internal-sales-return-controller/store/actions';
import { InternalSalesReturnStates } from '../../../../../state-controllers/internal-sales-return-controller/store/states';

interface LocalState {
  deactivateReturn: boolean;
  deactivateList: boolean;
}

@Component({
  selector: 'app-edit-line-item-issue-link-listing',
  templateUrl: './issue-link-listing.component.html',
  styleUrls: ['./issue-link-listing.component.scss']
})
export class EditLineItemIssueLinkListingComponent implements OnInit, OnDestroy {

  @Output() editIssueLink = new EventEmitter();

  protected subs = new SubSink();

  gridApi;
  searchModel = lineItemSearchModel;

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
    { headerName: 'Project', field: 'project', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Issue Number', field: 'issueNumber', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Issue Summary', field: 'issueSummary', type: 'numericColumn' },
    { headerName: 'Issue Description', field: 'issueDescription', type: 'numericColumn' },
    { headerName: 'Assignee', field: 'assignee', type: 'numericColumn' },
    { headerName: 'Created Date  ', field: 'createdDate', type: 'numericColumn' },
    { headerName: 'Resolved Date', field: 'resolvedDate', type: 'numericColumn' },
    { headerName: 'Status', field: 'status', type: 'numericColumn' },
  ];

  testData = [
    {
      project: "Test", issueNumber: "123", issueSummary: "This is test", issueDescription: "Test description",
      assignee: "Qureshi", createdDate: "02-03-2021", resolvedDate: "01-01-2021", status: "Active"
    }
  ]

  constructor(
    private readonly store: Store<InternalSalesReturnStates>) {
  }

  ngOnInit() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.setGridData();
  }

  setGridData(criteria?: any) {
    criteria = (criteria) ? criteria : [{
      columnName: 'calcTotalRecords', operator: '=', value: 'true'
    }]
    const datasource = {
      getRows: grid => {
        // this.store.dispatch(InternalSalesReturnActions.loadInternalSalesReturnInit({ request: grid.request }));
        grid.success({
          rowData: this.testData,
          rowCount: 1
        });
        // this.store.dispatch(InternalSalesReturnActions.loadInternalSalesReturnSuccess({ totalRecords: 1 }));
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
  }

  onRowClicked(entity) {
    this.editIssueLink.emit();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}