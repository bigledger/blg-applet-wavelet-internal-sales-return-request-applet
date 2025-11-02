import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ComponentStore } from '@ngrx/component-store';
import { EntityContainerModel, Pagination, EmployeeService, SubQueryService } from 'blg-akaun-ts-lib';
import { ViewColumnFacade } from '../../../../../facades/view-column.facade';
import { AppConfig } from 'projects/shared-utilities/visa';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { SubSink } from 'subsink2';
import { SalesReturnStates } from '../../../../../state-controllers/sales-return-controller/store/states';
import { SalesReturnActions } from '../../../../../state-controllers/sales-return-controller/store/actions';
import { salesAgentSearchModel } from '../../../../../models/advanced-search-models/entity.model';
import { PaginationComponent } from 'projects/shared-utilities/utilities/pagination/pagination.component';
import { pageFiltering, pageSorting } from 'projects/shared-utilities/listing.utils';
import { SearchQueryModel } from 'projects/shared-utilities/models/query.model';

interface LocalState {
  deactivateReturn: boolean;
}

@Component({
  selector: 'app-sales-return-main-select-sales-agent',
  templateUrl: './select-sales-agent-listing.component.html',
  styleUrls: ['./select-sales-agent-listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class MainSelectSalesAgentListingComponent extends ViewColumnComponent {
  
  protected subs = new SubSink();
  
  protected compName = 'Main Select Sales Agent Listing';
  protected readonly index = 3;
  protected localState: LocalState;
  protected prevLocalState: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);

  searchModel = salesAgentSearchModel;
  prevIndex: number;
  SQLGuids: string[] = null;
  pagination = new Pagination();
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
    { headerName: 'Employee ID', field: 'bl_fi_mst_entity_hdr.employee_code', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Employee Name', field: 'bl_fi_mst_entity_hdr.name', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Employee Number', field: 'bl_fi_mst_entity_hdr.phone', cellStyle: () => ({ 'text-align': 'left'}) },
  ];

  @ViewChild(PaginationComponent) paginationComp: PaginationComponent;

  constructor(
    private viewColFacade: ViewColumnFacade,
    private readonly store: Store<SalesReturnStates>,
    private employeeService: EmployeeService,
    private subQueryService: SubQueryService,
    private readonly componentStore: ComponentStore<LocalState>) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.setGridData();
  }

  setGridData() {
    const apiVisa = AppConfig.apiVisa;
    const datasource = {
      getRows: grid => {
        const filter = pageFiltering(grid.request.filterModel);
        const sortOn = pageSorting(grid.request.sortModel);
        this.pagination.offset = this.SQLGuids ? 0 : grid.request.startRow;
        this.pagination.limit = grid.request.endRow - grid.request.startRow;
        this.pagination.conditionalCriteria = [
          { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
          { columnName: 'orderBy', operator: '=', value: 'updated_date' },
          { columnName: 'order', operator: '=', value: 'DESC' },
          { columnName: 'hdr_guids', operator: '=',
            value: this.SQLGuids ? this.SQLGuids.slice(grid.request.startRow, grid.request.endRow).toString() : ''
          }
        ];
        this.subs.sink = this.employeeService.getByCriteria(this.pagination, apiVisa).subscribe(resolved => {
          const data = sortOn(resolved.data).filter(entity => filter.by(entity));
          const totalRecords = filter.isFiltering ? (this.SQLGuids ? this.SQLGuids.length : resolved.totalRecords) : data.length;
          grid.success({
            rowData: data,
            rowCount: totalRecords
          });
        }, err => {
          grid.fail();
        });
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
  }

  onReturn() {
    this.viewColFacade.updateInstance<LocalState>(this.prevIndex, {
      ...this.prevLocalState,
      deactivateReturn: false,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  onRowClicked(entity: EntityContainerModel) {
    if (entity) {
      this.store.dispatch(SalesReturnActions.selectSalesAgent({ 
        guid: entity.bl_fi_mst_entity_hdr.guid.toString(),
        name: entity.bl_fi_mst_entity_hdr.name.toString()
      }))
    }
  }

  onSearch(e: SearchQueryModel) {
    if (!e.isEmpty) {
      const sql = {
        subquery: e.queryString,
        table: e.table
      };
      this.subs.sink = this.subQueryService.post(sql, AppConfig.apiVisa).subscribe({ next: resolve => {
        this.SQLGuids = resolve.data;
        this.paginationComp.firstPage();
        this.gridApi.refreshServerSideStore();
      }});
    } else {
      this.SQLGuids = null;
      this.paginationComp.firstPage();
      this.gridApi.refreshServerSideStore();
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}