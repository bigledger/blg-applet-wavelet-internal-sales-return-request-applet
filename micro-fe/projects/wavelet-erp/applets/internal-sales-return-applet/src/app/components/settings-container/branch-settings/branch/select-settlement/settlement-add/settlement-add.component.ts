import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { SubSink } from 'subsink2';
import { MatTabGroup } from '@angular/material/tabs';
import { AppLoginContainerModelUpdate, app_login_principal_RowClass, app_mst_link_subject_to_grp_RowClass, LinkSubjectToTeamContainerModel, LinkSubjectToTeamService, Pagination, PagingResponseModel, SettlementMethodService, SubQueryService, TenantUserProfileService, FinancialItemContainerModel, SettlementMethodContainerModel, BranchSettlementMethodContainerModel, BranchSettlementMethodService, bl_fi_mst_branch_settlement_method_RowClass, bl_fi_mst_item_hdr_RowClass } from 'blg-akaun-ts-lib';
import { forkJoin, iif, Observable, of, zip } from 'rxjs';
import { filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { PaginationComponent } from 'projects/shared-utilities/utilities/pagination/pagination.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { gridOptionsServerSide, pageFiltering, pageSorting, serverSideClear } from 'projects/shared-utilities/listing.utils';
import { PermissionFacade } from 'projects/shared-utilities/modules/permission/facades/permission.facade';
//import { BranchSettingsSelectors } from '../../../../../../state-controllers/branch-settings-controller/selectors';
import { BranchSettingsSelectors } from '../../../../../../state-controllers/branch-settings-controller/selectors';
import { BranchSettingsStates } from '../../../../../../state-controllers/branch-settings-controller/states';
import { BranchSettingsActions } from '../../../../../../state-controllers/branch-settings-controller/actions';

interface LocalState {
  deactivateReturn: boolean;
  selectedIndex;
}

interface User {
  viewValue: string,
  obj: app_login_principal_RowClass
}

@Component({
  selector: 'app-settlement-add',
  templateUrl: './settlement-add.component.html',
  styleUrls: ['./settlement-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class SettlementAddComponent extends ViewColumnComponent {

  @ViewChild(PaginationComponent, {static: false})
  private paginationComponent: PaginationComponent;
  @ViewChild(MatTabGroup, {static: true}) matTab: MatTabGroup;

  protected readonly index = 2;
  private localState: LocalState;

  // initialise local states
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.localState.deactivateReturn);
  readonly selectedIndex$ = this.componentStore.select(state => (state.localState.selectedIndex));

  // previous index
  prevIndex: number;
  private prevLocalState: any;

  // api visa
  apiVisa = AppConfig.apiVisa;

  // subSink is to ensure all subscribe calls are unsubscribed to once the component is destroyed
  private subSink = new SubSink;



  public form: FormGroup;
  formDisabled: boolean = true;

  branchGuid: string;


  // search model
  searchValue: any;

  // initialise ag grid
  gridApi;
  gridOptions = gridOptionsServerSide;
  columnsDefs;
  rowSelection = 'multiple';

  // users that are already added
  addedEntities = new Map<string, bl_fi_mst_branch_settlement_method_RowClass>();
  // currently selected users
  selectedEntities = new Map<string, bl_fi_mst_item_hdr_RowClass>();
  branch;
  constructor(
    private branchSettlementMethodService: BranchSettlementMethodService,
    private settlementMethodService: SettlementMethodService,
    private subqueryService: SubQueryService,
    private fb: FormBuilder,
    private viewColFacade: PermissionFacade,
    private readonly store: Store<BranchSettingsStates>,
    private readonly componentStore: ComponentStore<{localState: LocalState}>
  ) {
    super();
  }

  /**
   * Lifecycle method: Called when the component is first initialised.
   */
   ngOnInit() {
    this.subSink.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState({localState: a});
    });
    this.subSink.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subSink.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);

    this.form = this.fb.group({
      //currRank: [''],
      //rank: ['', Validators.compose([Validators.required])]
    })


    // define column definitions
    this.columnsDefs = [
      {
        headerName: '',
        field: 'bl_fi_mst_item_hdr.guid',
        valueFormatter: params => '',
        checkboxSelection: true,
        cellStyle: params => {
          return this.addedEntities.has(params.value) ?
          {'pointer-events': 'none', textAlign: 'left'} : {textAlign: 'left'}
        },
        floatingFilter: false,
        sortable: false,
        minWidth: 0,
      }, 
      {
        headerName: 'Code',
        field: 'bl_fi_mst_item_hdr.code',
        cellStyle: {textAlign: 'left'}
      },
      {
        headerName: 'Name',
        field: 'bl_fi_mst_item_hdr.name',
        cellStyle: {textAlign: 'left'}
      },
      
    ];
    const branchGuid$ = this.store.select(BranchSettingsSelectors.selectGuid);
  /*   this.store.select(BranchSettingsSelectors.selectBranch).subscribe(b=>{
      this.branch = b.bl_fi_mst_branch;
    }); */
   // console.log("this.branch",this.branch)
    this.subSink.sink = zip( branchGuid$).subscribe(
      ([branchGuid]) => {

        this.branchGuid = branchGuid;
        
        // get all current methods
        this.subSink.sink = this.getMethods().subscribe(x => {
          // add members
          x.forEach(a => {
            this.addedEntities.set(a.bl_fi_mst_branch_settlement_method.fi_item_hdr_guid.toString(), a.bl_fi_mst_branch_settlement_method)
          })
        });
      } 
    )
  }

  getMethods(): Observable<BranchSettlementMethodContainerModel[]> {
    const criteria = [
      {columnName: 'calcTotalRecords', operator: '=', value: 'true'},
      {columnName: 'branch_guid', operator: '=', value: this.branchGuid}
    ];
    const pagination = new Pagination(null, null, criteria);

    return this.branchSettlementMethodService.getByCriteria(pagination, this.apiVisa)
    .pipe(
      map(x => x.data)
    )
  }
  /**
   * Function called when AG grid is initialised.
   *
   * @param params : grid parameters
   */
   onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    const datasource = this.getDatasource();
    this.gridApi.setServerSideDatasource(datasource);

    const allColIds = params.columnApi.getAllColumns().map(x => x.colId);
    params.columnApi.autoSizeColumns(allColIds);

    
  }

  /**
   * Sets the datasource on the AG grid to response data returned from the
   * getByCriteria API.
   *
   * @param conditionalCriteria : any custom criteria to search for in the API
   * @returns datasource for AG grid
   */
  getDatasource(conditionalCriteria?) {
    console.log('getDatasource')
    let offset = 0;
    let limit = this.paginationComponent.rowPerPage;

    let criteria = [
      {columnName: 'calcTotalRecords', operator: '=', value: 'true'},
      {columnName: 'comp_guid', operator: '=', value: this.branch?.comp_guid.toString()}
    ];

    if (conditionalCriteria) {
      criteria = criteria.concat(conditionalCriteria);
    }

    return {

      getRows: grid => {

        const sortModel = grid.request.sortModel;
        const filterModel = grid.request.filterModel;
        const sortOn = pageSorting(sortModel);
        const filter = pageFiltering(filterModel);

        // only change offset and limit if no filterModel or sortModel is present
        if (Object.keys(filterModel).length == 0 && sortModel.length == 0) {
          offset = grid.request.startRow;
          limit = grid.request.endRow - offset;
        }

        const pagination = new Pagination(offset, limit, criteria);

        this.subSink.sink = this.settlementMethodService.getByCriteria(pagination, this.apiVisa)
        .subscribe(a => {
            // put data into the grid
            const data = sortOn(a.data).filter(entity => filter.by(entity));
            const totalRecords = filter.isFiltering ? a.totalRecords : data.length;
            // force pagination to go to first page if filter is applied
            if (this.paginationComponent.currentPage > this.paginationComponent.totalPage.value) { this.paginationComponent.firstPage() }

            grid.successCallback(data, totalRecords);
           // this.setSelectedNodes();
          }, err => {
            console.log('Err',err);
            grid.failCallback();
          })
      }
    }
  }

 

  /**
   * This function is called whe the user clicks on the SEND INVITE button.
   * This will dispatch an NgRx action to update details.
   *
   */
   onSubmit() {
     const memberGuids = [...this.selectedEntities.keys()];
     // clear selected
     this.selectedEntities.clear();

     // info
     if(this.branchGuid){
      this.store.dispatch(BranchSettingsActions.addSettlementMethodInit({branchGuid: this.branchGuid, method: memberGuids}));
      
    }
     //this.formDisabled = true;
     this.onReturn(); 
  }

  /**
   * This function is to be called every time the grid refreshes.
   * Set nodes that are already in the added to the team or previously currently
   * selected to selected.
   *
   */
  setSelectedNodes() {
    this.gridApi.forEachNode(node => {
      const guid = node.data.app_login_subject_guid;
      const inTeam = this.addedEntities.has(guid);
      const isCurrentlySelected = this.selectedEntities.has(guid);
      if (inTeam || isCurrentlySelected) {
        node.setSelected(true);
      } else {
        node.setSelected(false);
      }
    })
  }

  /**
   * This function is called when a row is either selected or deselected.
   * Updated the currentlySelected array.
   */
  onRowSelected(event) {
    console.log('event',event);
    const selectedGuid = event.node.data.bl_fi_mst_item_hdr.guid;
    const isSelectionEvent = event.node.isSelected();
    const inTeam = this.addedEntities.has(selectedGuid);
    const isCurrentlySelected = this.selectedEntities.has(selectedGuid);

    if (!isSelectionEvent && isCurrentlySelected && !inTeam) {
      // delete from selected entities if node is not already in team,
      // it is a deselection event and the node is in the currently selected entities
      this.selectedEntities.delete(selectedGuid)
    } else if (isSelectionEvent && !inTeam && !isCurrentlySelected) {
      // add node to the currently selected entities if it is a selection event,
      // the node is not currently already in the team and the node is
      // not in the currently selected maps already
      this.selectedEntities.set(selectedGuid, event.node.data)
    }

    if (this.selectedEntities.size > 0) {
      this.formDisabled = false;
    } else {
      this.formDisabled = true;
    }
  }

  

  /**
   * Reset the search bar and search value.
   */
   reset() {
    this.searchValue = '';
    const datasource = this.getDatasource();
    this.gridApi.setServerSideDatasource(datasource);
  };

  /**
   * This function calls the subquery service to get the relevant guids
   * that match the details of the search query and sets the datasource
   * of the AG Grid accordingly.
   *
   * @param query : the search query
   * @param table : the relevant table to search for the search query
   */
   searchQuery(query: string, table: string) {
    // using the subquery service to get the relevant guids
    const query$ = this.subqueryService
      .post({ 'subquery': query, 'table': table }, this.apiVisa)
      .pipe(
        switchMap(resp => of(resp))
      );``

    // if there is response, find the responding vendor guids and set datasource
    this.subSink.sink = query$.pipe(
      filter(a => a.data.length > 0)
    ).subscribe(resp => {
          const additionalCriteria = [
            // combine all the guids together separated by commas
            { columnName: 'principalGuids', operator: '=', value: resp.data.join(',') }
          ]

          const datasource = this.getDatasource(additionalCriteria);
          this.gridApi.setServerSideDatasource(datasource);
        })

    // if there is no response, clear the table as this means nothing
    // in the database matches
    this.subSink.sink = query$.pipe(
      filter(a => a.data.length === 0)
    ).subscribe(() => serverSideClear(this.gridApi));
  }

  /**
   * This function is called every time the user searches something in the
   * search bar.
   *
   */
   onSearch() {
    if (this.searchValue != '') {
      const queryStr = `SELECT distinct(hdr.guid) as requiredGuid
      FROM app_login_principal as hdr
      WHERE (hdr.principal_id ILIKE '%${this.searchValue}%')
      AND hdr.status != 'DELETED'`
      const table = 'app_login_principal'
      this.searchQuery(queryStr, table);
    } else {
      const datasource = this.getDatasource();
      this.gridApi.setServerSideDatasource(datasource);
    }
  }

  /**
   * Return to the previous drawer/view column.
   */
   onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateReturn: false,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  /**
   * Lifecycle method: Called when this component is destroyed.
   */
  ngOnDestroy() {
    if (this.matTab) {
      this.viewColFacade.updateInstance(this.index, {
        ...this.localState,
        selectedIndex: this.matTab.selectedIndex
      });
    }
    this.subSink.unsubscribe();
  }

}