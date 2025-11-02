import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ComponentStore } from '@ngrx/component-store';
import { CompanyContainerModel, CompanyService, Pagination } from 'blg-akaun-ts-lib';
import { Observable } from 'rxjs';
import { ViewColumnFacade } from '../../../facades/view-column.facade';
import { internalSalesOrderSearchModel } from '../../../models/advanced-search-models/internal-sales-order.model';
import { CompanyActions } from '../../../state-controllers/company-controller/store/actions';
import { CompanyStates } from '../../../state-controllers/company-controller/store/states';
import { CompanySelectors } from '../../../state-controllers/company-controller/store/selectors';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';

interface LocalState {
  deactivateAdd: boolean;
  deactivateList: boolean;
}

@Component({
  selector: 'app-company-listing',
  templateUrl: './company-listing.component.html',
  styleUrls: ['./company-listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})

export class CompanyListingComponent extends ViewColumnComponent {

  protected compName = 'Company Listing';
  protected readonly index = 0;
  private localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateAdd$ = this.componentStore.select(state => state.deactivateAdd);
  readonly deactivateList$ = this.componentStore.select(state => state.deactivateList);

  toggleColumn$: Observable<boolean>;
  searchModel = internalSalesOrderSearchModel;

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: {suppressFilterButton: true},
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true
  };

  gridApi;

  columnsDefs = [
    {headerName: 'Company Code', field: 'bl_fi_mst_comp.code', comparator: (valueA, valueB) =>
    valueA.toLowerCase().localeCompare(valueB.toLowerCase()), width: 110, suppressSizeToFit: true,
    cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Company Name ', field: 'bl_fi_mst_comp.name', comparator: (valueA, valueB) =>
    valueA.toLowerCase().localeCompare(valueB.toLowerCase()), width: 110, suppressSizeToFit: true,
    cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Co. Registration Number', field: 'bl_fi_mst_comp.comp_registration_num', suppressSizeToFit: false,
    cellStyle: () => ({'text-align': 'right'})},
    {headerName: 'Description', field: 'bl_fi_mst_comp.descr', suppressSizeToFit: false, cellStyle: () => ({'text-align': 'left'})},
    {
      headerName: 'Status', field: 'bl_fi_mst_comp.status', width: 90, minWidth: 90, maxWidth: 100, suppressSizeToFit: true
    },
    {headerName: 'Creation Date', field: 'bl_fi_mst_comp.created_date', suppressSizeToFit: true},
    {headerName: 'Modified Date', field: 'bl_fi_mst_comp.modified_date', sort: 'desc', suppressSizeToFit: true},
  ];

  rowData = [];

  private subs = new SubSink();

  constructor( private readonly store: Store<CompanyStates>, private viewColFacade: ViewColumnFacade,
    private compService: CompanyService, private readonly componentStore: ComponentStore<LocalState>) {
    super();
  }

  ngOnInit() {
    this.toggleColumn$ = this.viewColFacade.toggleColumn$;
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
  }

  onNext() {
    this.viewColFacade.updateInstance<LocalState>(this.index,
      {
        ...this.localState,
        deactivateAdd: true,
        deactivateList: false
      });
    this.viewColFacade.onNextAndReset(this.index, 1);
  }

  onGridReady(params) {
    const apiVisa = AppConfig.apiVisa;
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    const datasource = {
      getRows: grid => {
        this.store.dispatch(CompanyActions.loadCompanyInit({request: grid.request}));
        this.subs.sink = this.compService.getByCriteria(
          new Pagination(grid.request.startRow, grid.request.endRow,
            [{columnName: 'calcTotalRecords', operator: '=', value: 'true'}]), apiVisa).subscribe( a => {
              grid.success({
                rowData: a.data,
                rowCount: a.totalRecords,
              });
          this.store.dispatch(CompanyActions.loadCompanySuccess({totalRecords: a.totalRecords}));
        }, err => {
          grid.fail();
          this.store.dispatch(CompanyActions.loadCompanyFailure({error: err.message}));
        });
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
    this.subs.sink = this.store.select(CompanySelectors.updateAgGrid).subscribe(resolved => {
      if (resolved) {
        this.gridApi.refreshServerSideStore();
        this.store.dispatch(CompanyActions.updateAgGridDone({done: false}));
      }
    })
  }

  onToggle(e: boolean) {
    this.viewColFacade.toggleColumn(e);
  }

  onRowClicked(entity: CompanyContainerModel) {
    this.store.dispatch(CompanyActions.selectGuid({guid: entity.bl_fi_mst_comp.guid}))
    if (!this.localState.deactivateList) {
      this.viewColFacade.updateInstance<LocalState>(this.index,
        {
          ...this.localState,
          deactivateAdd: false,
          deactivateList: true
        });
      this.viewColFacade.onNextAndReset(this.index, 2);
    }
  }

  onSearch(e: string) {
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
