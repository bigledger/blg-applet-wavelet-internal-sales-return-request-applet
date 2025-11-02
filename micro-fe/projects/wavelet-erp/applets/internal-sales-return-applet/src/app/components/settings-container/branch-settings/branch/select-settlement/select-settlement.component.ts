import { Component, ViewChild } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { ApiResponseModel, BranchSettlementMethodService, CashbookService, FinancialItemService, Pagination, SubQueryService } from 'blg-akaun-ts-lib';
import { ToastrService } from 'ngx-toastr';
import { TeamMemberSearchModel } from 'projects/shared-utilities/models/advanced-search-models/team-member-search.model';
import { PermissionFacade } from 'projects/shared-utilities/modules/permission/facades/permission.facade';
import { PaginationComponent } from 'projects/shared-utilities/utilities/pagination/pagination.component';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { from, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, toArray } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { SettlementMethodModel } from '../../../../../models/settlement-settings.model';
import { BranchSettingsActions } from '../../../../../state-controllers/branch-settings-controller/actions';
import { BranchSettingsStates } from '../../../../../state-controllers/branch-settings-controller/states';

interface LocalState {
  deactivateReturn: boolean;
  selectedIndex: number;
  deactivateAdd: boolean;
  deactivateList: boolean;
}

@Component({
  selector: 'app-select-settlement',
  templateUrl: './select-settlement.component.html',
  styleUrls: ['./select-settlement.component.scss']
})

export class SelectSettlementComponent extends ViewColumnComponent {
  @ViewChild(PaginationComponent, {static: false})
  private paginationComponent: PaginationComponent;
  protected readonly index = 1;
  private localState: LocalState;

  // initialise local states
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  deactivateAdd$;
  readonly deactivateList$ = this.componentStore.select(state => state.localState.deactivateList);

  // api visa
  apiVisa = AppConfig.apiVisa;

  searchModel = TeamMemberSearchModel;

  // initial ag grid state
  gridApi;
  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    floatingFilterComponentParams: {suppressFilterButton: true},
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true,
  }

  columnsDefs = [
    {
      headerName: 'Code',
      field: 'code',
      cellStyle: {textAlign: 'left'}
    },
    {
      headerName: 'Name',
      field: 'name',
      cellStyle: {textAlign: 'left'}
    },
    {
      headerName: 'Cashbook',
      field: 'cashbook',
      cellStyle: {textAlign: 'left'}
    },

  ];

  
  rowModelType = 'serverSide';
  serverSideStoreType = 'partial';

  // subSink is to ensure all subscribe calls are unsubscribed to once the component is destroyed
  private subSink = new SubSink;
  searchValue: any;
  teamGuid: string;
  rowData = [];
  totalRecords = 0;
  sqlGuids: string[] = null;
  limit = 50;
  constructor(
    private toastr: ToastrService,
    private subqueryService: SubQueryService,
    private branchSettlementMethodService: BranchSettlementMethodService,
    private cashbookService: CashbookService,
    private fiItemService: FinancialItemService,
    private readonly store: Store<BranchSettingsStates>,
    private viewColFacade: PermissionFacade,
    private componentStore: ComponentStore<{localState: LocalState}>
  ) {
    super();
  }

  /**
   * Lifecycle method: Called when component is first initialised.
   */
   ngOnInit() {
    // initial configurations for local state
    this.subSink.sink = this.localState$.subscribe( a => {
      this.localState = a;
      this.componentStore.setState( {localState: a} );
    });

    
    const localStateAdd$ = this.componentStore.select(state => state.localState.deactivateAdd);

    /* this.subSink.sink = this.store.select(BranchSettingsSelectors.selectGuid).subscribe(x => {
      this.teamGuid = x;
    
      this.deactivateAdd$ = combineLatest([currentUserInTeam$, localStateAdd$])
      .pipe(
        map(([x, y]) => !x || y)
      )
      if (this.gridApi) {
        const datasource = this.getDatasource();
        this.gridApi.setServerSideDatasource(datasource);
      }
    })

    this.subSink.sink = this.store.select(BranchSettingsSelectors.selectUpdateMemberListing).subscribe(x => {
      if (x && this.gridApi) {
        if (this.gridApi.getDisplayedRowCount() > 0) {
          this.gridApi.refreshServerSideStore();
        } else {
          this.gridApi.refreshServerSideStore(
            {purge: true}
          )
        }
        this.store.dispatch(BranchSettingsActions.setUpdateMemberListing({update: false}));
      }
    }) */
  }

  /**
   * This function is called when the user clicks on the Add button in the UI.
   * Will trigger the add component to be shown on the screen.
   *
   */
   onNext() {
    // deactivate return, add and list in this component
    this.viewColFacade.updateInstance(this.index,
      {
        ...this.localState,
        deactivateReturn: true,
        deactivateAdd: true,
        deactivateList: true
      });
    // trigger the create permissions template view column component to to be shown
    this.viewColFacade.onNext(2);
  }

    /**
   * Decides whether the data is being filtered based on the filterModel
   * provided by the AG grid request and returns what contains an object
   * that contains a function which takes in a view model and decides if
   * it contains the filter search string and a boolean whether the data is
   * currently being filtered or not.
   *
   * @param filterModel : the filter model provided by AG grid
   * @returns {by: a function, isFiltering: true if not currently filtered, false otherwise}
   */
     pageFiltering(filterModel){
      var noFilters = Object.keys(filterModel).length <= 0;
      if (noFilters) return {
        by : (viewModel) => true,
        isFiltering : noFilters
      }
      return {
        by: (viewModel) =>  Object
          .keys(filterModel)
          .map(col => {
            const fields = col.split(".")
            const val = fields.reduce(((acc, property) => acc ? acc[property] : null), viewModel)

            return filterModel.filterType == "number" ?
              +val === +filterModel[col].filter :
              val.toLowerCase().includes(filterModel[col].filter.toLowerCase())})
          .reduce((p, c)=> p && c),
        isFiltering: noFilters
      }
    }

    /**
     * Sorts data according to the sort model provided by AG grid and returns
     * this new data.
     *
     * @param sortModel : the sort model provided by AG grid
     * @returns the sorted data
     */
    pageSorting(sortModel){
      return (data) => {
        // return data if there is no sorting required
        if (sortModel.length <= 0) return data;
        // make a copy of data
        let newData = data.map(o => o);
        sortModel.forEach(model => {
          const col = model.colId;
          const fields = col.split(".")
          const getVal = (entity) => fields.reduce((acc, property) => acc ? acc[property] : null, entity)

          // sort the data
          newData = model.sort == 'asc' ?
            // p and c are of type VendorContainerModel
            newData.sort((p,c) => 0 - (getVal(p) > getVal(c) ? -1 : 1)) :
            newData.sort((p,c) => 0 - (getVal(p) > getVal(c) ? 1 : -1))}
        )

        return newData;
      }
    }

  /**
   * This function is called when AG grid is first initialised and initally
   * sets the datasource of the grid.
   *
   * @param params : grid parameters
   */
   onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.getDatasource();
  }

    /**
   * Returns the datasource for the AG grid.
   *
   * @param criteria : any custom criteria to search for in the API
   * @returns the datasource
   */
  getDatasource() {
        const criteria = [
          { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
          {
            columnName: "branch_guid",
            operator: "=",
            value: this.teamGuid
          },
      ];
      console.log('criteria',criteria)
      const sortCriteria = [
        { columnName: 'orderBy', value: 'updated_date' },
        { columnName: 'order', value: 'DESC' }
      ];
        const paging = new Pagination(this.rowData.length, this.limit, criteria, sortCriteria);

        this.subSink.sink = this.branchSettlementMethodService.getByCriteria(paging, this.apiVisa)
        .pipe(
          mergeMap(a=>from(a.data).pipe(
            mergeMap(a_a => this.fiItemService.getByGuid(a_a.bl_fi_mst_branch_settlement_method.fi_item_hdr_guid.toString(), AppConfig.apiVisa).pipe(
              mergeMap(a_b => this.cashbookService.getByGuid(a_b.data.bl_fi_mst_item_exts.find(x=>x.param_code=='BL_FI_MST_CASHBOOK_HDR_GUID').value_string.toString(), AppConfig.apiVisa).pipe(
                map(a_a_a => {
                  const method: SettlementMethodModel = new SettlementMethodModel();
                  method.cashbook = a_a_a.data.bl_fi_mst_cashbook_hdr.name.toString();
                  method.fi_item_hdr_guid = a_a.bl_fi_mst_branch_settlement_method.fi_item_hdr_guid.toString();
                  method.guid = a_a.bl_fi_mst_branch_settlement_method.guid.toString();
                  method.code = a_b.data.bl_fi_mst_item_hdr.code.toString();
                  method.name = a_b.data.bl_fi_mst_item_hdr.name.toString();

                  return method;
                }
                )
              ))
              ,catchError(err => {console.log("err",err.error?.code);
                  const method: SettlementMethodModel = new SettlementMethodModel();
                  method.cashbook = "";
                  method.fi_item_hdr_guid = a_a.bl_fi_mst_branch_settlement_method.fi_item_hdr_guid.toString();
                  method.guid = a_a.bl_fi_mst_branch_settlement_method.guid.toString();
                  method.code = err.error?.code;
                  method.name = err.error?.code;
                  return of(method);})
            )),
            toArray(),
            map(a_c => ({...a, data: a_c}))
          ))
        ).subscribe(resolved => {
          this.totalRecords = resolved.totalRecords;
          this.rowData = [...this.rowData, ...resolved.data];
          this.gridApi.setRowData(this.rowData);
          this.paginationComponent.showMorePage = this.rowData.length < this.totalRecords;
          this.store.dispatch(BranchSettingsActions.loadSettlementMethodSuccess());
        }, err => {
          this.store.dispatch(BranchSettingsActions.loadSettlementMethodFailure({error: err.message}));
        })
      
    
  }

   onRowClicked(entity) {
    console.log('click settle',entity)
    // dispatch ngrx action to save selected member
    //this.store.dispatch(BranchSettingsActions.selectMember({member: entity}));

    // deactivate add, return and list in this local state
    if (!this.localState.deactivateList) {
      this.viewColFacade.updateInstance(this.index,
        {
          ...this.localState,
          deactivateReturn: true,
          deactivateAdd: true,
          deactivateList: true
        });
      // trigger the edit permissions template view column
      this.viewColFacade.onNext(3);
    }
  }

  /**
   * Set datasource on the AG grid to empty.
   */
   clear() {
    const dataSource = {
      getRows: grid => {
        grid.successCallback([], 0)
      }
    };

    this.gridApi.setServerSideDatasource(dataSource);
  }

  searchQuery(query: string, table: string) {
    var query$ = this.subqueryService
      .post({ 'subquery': query, 'table':  table}, AppConfig.apiVisa)
      .pipe(
        switchMap(resp => of(resp))
      );
    this.subSink.sink = query$.pipe(
      filter((resp: ApiResponseModel<any>) => resp.data.length > 0)
    ).subscribe(resp => {
      this.sqlGuids = resp.data;
      if(this.sqlGuids.length!==0 || this.sqlGuids.length<=45){
        console.log("this.sqlGuids",this.sqlGuids)
        this.getDatasource();
      }else{
        this.toastr.error("Result Set Too Large. Please Refine Search", "Error", {
          tapToDismiss: true,
          progressBar: true,
          timeOut: 2000,
        });
      }
    });
    this.subSink.sink = query$.pipe(
      filter((resp: ApiResponseModel<any>) => resp.data.length == 0)
    ).subscribe(_ => this.clear());
  }

  


  quickSearch() {
    this.gridApi.setQuickFilter(this.searchValue);
  }

   ngOnDestroy() {
    this.subSink.unsubscribe();
  }

}