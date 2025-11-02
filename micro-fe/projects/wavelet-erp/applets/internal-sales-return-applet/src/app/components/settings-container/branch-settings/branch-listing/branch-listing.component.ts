import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { ApiResponseModel, BranchService, BranchSettlementMethodService, Pagination, SubQueryService } from 'blg-akaun-ts-lib';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from 'projects/shared-utilities/utilities/pagination/pagination.component';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { Observable, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { BranchSettingsFacade } from '../../../../facades/branch-settings.facade';
import { BranchSettingsActions } from '../../../../state-controllers/branch-settings-controller/actions';
import { BranchSettingsStates } from '../../../../state-controllers/branch-settings-controller/states';
import { InternalSalesReturnActions } from '../../../../state-controllers/internal-sales-return-controller/store/actions';
import { InternalSalesReturnStates } from '../../../../state-controllers/internal-sales-return-controller/store/states';

interface LocalState {
  deactivateAdd: boolean;
  deactivateList: boolean;
}

@Component({
  selector: 'app-branch-listing',
  templateUrl: './branch-listing.component.html',
  styleUrls: ['./branch-listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class BranchListingComponent extends ViewColumnComponent {

  @ViewChild(PaginationComponent, {static: false})
  private paginationComponent: PaginationComponent;

  protected readonly index = 0;
  private localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateAdd$ = this.componentStore.select(state => state.localState.deactivateAdd);
  readonly deactivateList$ = this.componentStore.select(state => state.localState.deactivateList);

  toggleColumn$: Observable<boolean>;

  apiVisa = AppConfig.apiVisa;

  gridApi;
  sideBar = 'columns';
  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    floatingFilterComponentParams: {suppressFilterButton: true},
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true
  };
  columnsDefs;
  rowData = [];
  rowModelType = 'serverSide';
  serverSideStoreType = 'partial';
  searchValue: any;


  private subSink = new SubSink;

  currentUserGuid: string;
  totalRecords = 0;
  sqlGuids: string[] = null;
  limit = 50;
  constructor(
    private toastr: ToastrService,
    private subqueryService: SubQueryService,
    private branchService: BranchService,
    private branchSettlementMethodService: BranchSettlementMethodService,
    private readonly store: Store<BranchSettingsStates>,
    private readonly isrStore: Store<InternalSalesReturnStates>,
    private viewColFacade: BranchSettingsFacade,
    private readonly componentStore: ComponentStore<{localState: LocalState}>
  ) {
    super();
  }

   ngOnInit(): void {
    this.toggleColumn$ = this.viewColFacade.toggleColumn$;
    this.subSink.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState({localState: a});
    });

    this.columnsDefs = [
      {
        headerName: 'Branch Name',
        field: 'bl_fi_mst_branch.name',
        cellStyle: {textAlign: 'left'}
      },
      {
        headerName: 'Branch Code',
        field: 'bl_fi_mst_branch.code',
        cellStyle: {textAlign: 'left'}
      }
    ];
  }

  
   onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.getDatasource();
  }

 
  getDatasource() {
    const criteria = [
        { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
        {
          columnName: "hdr_guids",
          operator: "=",
          value: this.sqlGuids ? this.sqlGuids.slice(this.rowData.length, this.rowData.length + this.limit).toString() : "",
        },
    ];

    const sortCriteria = [
      { columnName: 'orderBy', value: 'date_updated' },
      { columnName: 'order', value: 'DESC' }
    ];
    const paging = new Pagination(this.rowData.length, this.limit, criteria, sortCriteria);

    this.subSink.sink = this.branchService.getByCriteria(paging, AppConfig.apiVisa).pipe(
      /* mergeMap(b => {
        const source: Observable<BranchContainerModel>[] = [];
        b.data.forEach(branch => {
         
          const methods$ = this.branchSettlementMethodService.getByCriteria(new Pagination(0, 10, [
            {columnName: 'branch_guid', operator: '=', value: branch.bl_fi_mst_branch.guid.toString()}
          ]), AppConfig.apiVisa).pipe(catchError((err) => of(err)));

          const result$ = zip(methods$)
          .pipe(
              map(([b_a]) => {
               
                branch.bl_fi_mst_branch = Object.assign(branch.bl_fi_mst_branch, {
                  no_of_stl_mthd:b_a.data.length,
                  stl_mthds: b_a?b_a.data:"",
                });

                return branch;
              })
            )
          source.push(result$);
        }) 
        return iif(() => b.data.length > 0,
          forkJoin(source).pipe(map((b_inner) => {
            b.data = b_inner;
            return b
          })),
          of(b)
        );
      }) */
    ).subscribe(resolved => {
      //console.log(resolved);
      this.totalRecords = this.sqlGuids ? this.sqlGuids.length : resolved.totalRecords;
      this.rowData = [...this.rowData, ...resolved.data];
      this.gridApi.setRowData(this.rowData);
      this.paginationComponent.showMorePage = this.rowData.length < this.totalRecords;
    }, err => {
      console.error(err);
      
    });
  };

  
  onMorePage() {
    //.log('on more page click');
    this.paginationComponent.showMorePage = false;
    if (this.rowData.length < this.totalRecords) {
      this.getDatasource();
    }
  }


  
   onRowClicked(branch) {
    console.log(branch)
    // dispatch ngrx actions
    this.store.dispatch(BranchSettingsActions.selectBranch({branch: branch}));
    this.store.dispatch(BranchSettingsActions.selectBranchSettlementMethodListInit({branchGuid: branch.bl_fi_mst_branch.guid}))
    this.isrStore.dispatch(InternalSalesReturnActions.resetSettingItemFilter());
    this.isrStore.dispatch(InternalSalesReturnActions.selectSettingItemFilter({branch: branch.bl_fi_mst_branch.guid}));
    this.store.dispatch(BranchSettingsActions.selectDefaultPrintableFormatInit({branchGuid: branch.bl_fi_mst_branch.guid,serverDocType:"INTERNAL_SALES_RETURN"}))

    // deactivate add and list in this local state
    if (!this.localState.deactivateList) {
      this.viewColFacade.updateInstance(this.index,
        {
          ...this.localState,
          deactivateAdd: true,
          deactivateList: true
        });
      // trigger the next view column
      this.viewColFacade.onNext(1);
    }
  }

   clear() {
    this.gridApi.setRowData(null);
    this.totalRecords = 0;
    this.rowData = [];
    this.sqlGuids = null;
    this.paginationComponent.firstPage();
    this.paginationComponent.showMorePage = false;
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
        //console.log("this.sqlGuids",this.sqlGuids)
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

   onSearch() {
    this.clear();
    if (!this.searchValue.isEmpty) {
      const queryStr = `SELECT distinct(hdr.guid) as requiredGuid
      FROM bl_fi_mst_branch as hdr
      WHERE (hdr.code ILIKE '%${this.searchValue}%'
      OR hdr.name ILIKE '%${this.searchValue}%')
      AND hdr.status != 'DELETED'`
      const table = 'bl_fi_mst_branch'
      this.searchQuery(queryStr, table);
    } else {
      this.getDatasource();
    }
  }

 
  reset() {
    this.searchValue = '';
    const datasource = this.getDatasource();
    this.gridApi.setServerSideDatasource(datasource);
  }

  
   ngOnDestroy() {
    this.subSink.unsubscribe();
  }

}