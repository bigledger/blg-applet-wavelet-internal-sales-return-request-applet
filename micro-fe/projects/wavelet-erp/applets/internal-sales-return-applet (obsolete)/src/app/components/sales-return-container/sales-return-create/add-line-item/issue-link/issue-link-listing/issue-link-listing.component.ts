import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { SubSink } from 'subsink2';
import { salesReturnSearchModel } from '../../../../../../models/advanced-search-models/internal-sales-return.model';
import { Store } from '@ngrx/store';
import { SalesReturnStates } from '../../../../../../state-controllers/sales-return-controller/store/states';
import { SalesReturnActions } from '../../../../../../state-controllers/sales-return-controller/store/actions'

@Component({
  selector: 'app-line-item-issue-link-listing',
  templateUrl: './issue-link-listing.component.html',
  styleUrls: ['./issue-link-listing.component.scss']
})
export class LineItemIssueLinkListingComponent implements OnInit, OnDestroy {

  @Output() editIssueLink = new EventEmitter(); 

  protected subs = new SubSink();

  searchModel = salesReturnSearchModel;
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
    { headerName: 'Project', field: 'project', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Issue Number', field: 'issueNumber', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Issue Summary', field: 'issueSummary', type: 'numericColumn' },
    { headerName: 'Issue Description', field: 'issueDescription', type: 'numericColumn' },
    { headerName: 'Assignee', field: 'assignee', type: 'numericColumn' },
    { headerName: 'Created Date  ', field: 'createdDate', type: 'rightAligned' },
    { headerName: 'Resolved Date', field: 'resolvedDate', type: 'rightAligned' },
    { headerName: 'Status', field: 'status', type: 'numericColumn' },
  ];

  testData = [
    { project: "Test", issueNumber: "123", issueSummary: "This is test", issueDescription: "Test description",
      assignee: "Qureshi", createdDate: "2021-03-02", resolvedDate: "2021-01-01", status: "Active" }
  ]

  constructor(
    private readonly store: Store<SalesReturnStates>) {
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
        this.store.dispatch(SalesReturnActions.loadSalesReturnInit({request: grid.request}));
        // this.subs.sink = this.tenantService.getByCriteria(
          // new Pagination(grid.request.startRow, grid.request.endRow, criteria), AppConfig.apiVisa).subscribe( a => {
              grid.success({
                rowData: this.testData,
                rowCount: 1
              });
          this.store.dispatch(SalesReturnActions.loadSalesReturnSuccess({totalRecords: 1}));
        // }, err => {
        //   grid.fail();
        //   this.store.dispatch(GuestTenantActions.loadGuestTenantFailure({error: err.message}));
        // });
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
    // this.subs.sink = this.store.select(PurchaseOrderSelectors.selectAgGrid).subscribe(resolved => {
    //   if (resolved) {
    //     this.gridApi.refreshServerSideStore({ purge: true });
    //     this.store.dispatch(SalesInvoiceActions.resetAgGrid());
    //   }
    // });
  }

  onRowClicked(entity) {
    this.editIssueLink.emit();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}