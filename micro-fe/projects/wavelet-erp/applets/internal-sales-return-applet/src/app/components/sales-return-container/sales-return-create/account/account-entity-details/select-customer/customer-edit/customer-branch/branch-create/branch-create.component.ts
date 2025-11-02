import { Component, EventEmitter, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { bl_fi_mst_comp_branch_location_entity_link_RowCLass, bl_fi_mst_entity_ext_RowClass, bl_fi_mst_entity_line_RowClass, BranchLocationLinkService, BranchService, CompanyService, CompBranchLocationEntityLinkContainerModel, LocationService, Pagination, PagingResponseModel, SettlementMethodContainerModel, SettlementMethodService, SubQueryService } from 'blg-akaun-ts-lib';
import { ViewColActions } from 'projects/shared-utilities/application-controller/store/actions';
import { AppStates } from 'projects/shared-utilities/application-controller/store/states';
import { pageFiltering, pageSorting } from 'projects/shared-utilities/listing.utils';
import { SearchQueryModel } from 'projects/shared-utilities/models/query.model';
import { PaginationComponent } from 'projects/shared-utilities/utilities/pagination/pagination.component';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/selectors';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';
import { forkJoin, iif, Observable, of, zip } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { customerBranchSearchModel } from 'projects/wavelet-erp/applets/internal-shopping-cart-applet/src/app/models/advanced-search-models/customer-branch.model';

export class LocationContainer {
  id;
  code;
  name;
  status;
  guid;
  mainLocationGuid;

}
@Component({
  selector: 'app-branch-create',
  templateUrl: './branch-create.component.html',
  styleUrls: ['./branch-create.component.css']
})
export class CreateBranchComponent extends ViewColumnComponent implements OnInit, OnDestroy {

  form: FormGroup;
  formProperty: FormGroup;
  deactivateReturn$;

  country = [
    { value: 'MALAYSIA', viewValue: 'Malaysia' },
    { value: 'SINGAPORE', viewValue: 'Singapore' },
    { value: 'THAILAND', viewValue: 'Thailand' }
  ];
  taxType: any;
  status = [
    { value: 'ACTIVE', viewValue: 'ACTIVE' },
    { value: 'INACTIVE', viewValue: 'INACTIVE' }
  ];
  protected readonly index = 4;
  prevIndex: number;
  private prevLocalState: any;
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  newSettlement: SettlementMethodContainerModel[];
  settlementList: SettlementMethodContainerModel[];
  settlementListguid;
  settlementArr: any;
  settlementGuid: any;
  settlementName: any;
  settlementArr1: any = [];
  apiVisa = AppConfig.apiVisa;
  paging = new Pagination();
  addSuccess = 'Add';
  isClicked = 'primary';
  protected subs = new SubSink();
  arraySize = [];
  arrayData = [];
  arrayPromise = [];
  searchModel = customerBranchSearchModel;

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    floatingFilterComponentParams: { suppressFilterButton: true },
    // minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true
  };

  gridApi;
  SQLGuids: string[] = null;
  pagination = new Pagination();
  entityGuid;
  rowDataLocations: any;
  linkedLocations: any[];
  searchLocations: any[];
  selectedLocationGuid: any;

  columnsDefs = [
    { headerName: 'Branch Code', field: 'bl_fi_mst_branch.code', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Branch Name', field: 'bl_fi_mst_branch.name', cellStyle: () => ({ 'text-align': 'left' }) },
    // {headerName: 'Location', field: 'location', cellStyle: () => ({'text-align': 'left'})},
    { headerName: 'Status', field: 'bl_fi_mst_branch.status', cellStyle: () => ({ 'text-align': 'left' }) },
    // {headerName: 'Stock Balance Qty', field: 'stockBalQty'},
  ];

  @ViewChild(PaginationComponent) paginationComp: PaginationComponent;


  constructor(
    private readonly store: Store<CustomerStates>,
    private fb: FormBuilder,
    private viewColFacade: ViewColumnFacade,
    private BranchService: BranchService,
    private CompService: CompanyService,
    private readonly appStore: Store<AppStates>,
    private snackBar: MatSnackBar,
    private branchLocationLinkService: BranchLocationLinkService,
    private locationService: LocationService,
    private subQueryService: SubQueryService,
  ) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.subs.sink = this.store.select(CustomerSelectors.selectContainer).subscribe((resolve) => {
      this.entityGuid = resolve.bl_fi_mst_entity_hdr.guid;
    })
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.retrieveData([this.setCriteria('calcTotalRecords', 'true')]);
  }


  onRowClicked(entity: any) {
    console.log("entity line item: ", entity)
  }

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  onSave() {
    let selectedNodes = this.gridApi.getSelectedNodes();
    let selectedData = selectedNodes.map(node => node.data);
    let guidBranch = selectedData[0].bl_fi_mst_branch.guid;
    let guidComp = selectedData[0].bl_fi_mst_branch.comp_guid;
    let guidLoc = selectedData[0].bl_fi_mst_branch_ext.find(x => x.param_code === "MAIN_LOCATION")?.value_string;

    const newBranchLink = new bl_fi_mst_entity_line_RowClass();
    newBranchLink.ref_1 = guidBranch;
    newBranchLink.ref_2 = guidComp;
    newBranchLink.ref_3 = guidLoc;
    // newBranchLink.entity_hdr_guid = this.entityGuid;
    this.store.dispatch(CustomerActions.createBranchLine({
      ext: newBranchLink
    }))
    this.appStore.dispatch(ViewColActions.resetIndex({ index: 2 }));
    this.snackBar.open(`${selectedData[0].bl_fi_mst_branch.code} Added`, 'Close');
    this.addSuccess = 'Success';
    this.isClicked = 'buttonSuccess';
    setTimeout(() => {
      this.addSuccess = 'Add';
      this.isClicked = 'primary';
      this.form.reset();
    }, 1500)
  }

  retrieveData(criteria) {
    if (criteria) {
      const datasource = {
        getRows: this.getRowsFactory(criteria)
      }
      this.gridApi.setServerSideDatasource(datasource);
    }
  }

  getRowsFactory(criteria) {
    // let offset = 0;
    // let limit = this.paginationComponent.rowPerPage;
    return grid => {
      // this.store.dispatch(InternalPackingOrderActions.loadPackingOrdersInit({request: grid.request}));
      const filter = pageFiltering(grid.request.filterModel);
      const sortOn = pageSorting(grid.request.sortModel);
      console.log("sqlguids: ", this.SQLGuids);
      this.pagination.offset = this.SQLGuids ? 0 : grid.request.startRow;
      this.pagination.limit = grid.request.endRow - grid.request.startRow;
      this.pagination.conditionalCriteria = [
        { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
        { columnName: 'orderBy', operator: '=', value: 'code' },
        { columnName: 'order', operator: '=', value: 'ASC' },
        {
          columnName: 'hdr_guids', operator: '=',
          value: this.SQLGuids ? this.SQLGuids.slice(grid.request.startRow, grid.request.endRow).toString() : ''
        }
      ];
      this.subs.sink = this.BranchService.getByCriteria(
        this.pagination, AppConfig.apiVisa)
        .subscribe(resolved => {
          console.log("res: ", resolved);
          // this.store.dispatch(InternalPackingOrderActions.loadPackingOrderSuccess({totalRecords: resolved.totalRecords}));
          // this.gridApi.setRowData(resolved.data);
          // grid.successCallback(resolved.data, resolved.totalRecords);
          // const data = sortOn(resolved.data).filter(entity => filter.by(entity));
          // const totalRecords = filter.isFiltering ? (this.SQLGuids ? this.SQLGuids.length : resolved.totalRecords) : data.length;
          grid.success({
            rowData: resolved.data,
            rowCount: resolved.totalRecords
          });
          this.SQLGuids = null;
          // this.gridApi.forEachNode(node => {
          //   if (node.rowIndex == this.localState.rowIndexLineItem) {
          //     node.setSelected(true);
          //   }
          // });
        }, err => {
          console.log("err: ", err.toString())
          grid.failCallback();
        });
    }
  };

  setCriteria(columnName, value) {
    return { columnName, operator: '=', value }
  }

  onSearch(e: SearchQueryModel) {
    !e.isEmpty ? this.searchQuery(e.queryString, e.table) : this.retrieveData([this.setCriteria('calcTotalRecords', 'true')]);
  }

  searchQuery(query: string, table: string) {
    console.log("query: ", query);

    var query$ = this.subQueryService
      .post({ 'subquery': query, 'table': table }, AppConfig.apiVisa)
      .pipe(
        switchMap(res => of(res))
      );
    this.subs.sink = query$
      // .filter((res: ApiResponseModel<any>) => res.data.length > 0)
      .subscribe(res => {
        console.log("res.data: ", res.data);
        if (res.data.length > 0) {
          this.SQLGuids = res.data
          // for (let i = 0; i < res.data.length; i = i + 100) {
          //   this.arraySize.push([
          //     this.setCriteria("guids", [...res.data].splice(i, i + 99).toString()),
          //     this.setCriteria("calcTotalRecords", 'true')
          //   ])
          // }
          this.retrieveData(true);
        }
        else {
          console.log("masuk");
          this.clear()
        }
      });
    // query$
    //   // .filter((res: ApiResponseModel<any>) => res.data.length === 0)
    //   .subscribe(res => {
    //     this.clear()
    //   });
  }

  clear() {
    let dataSource = {
      getRows(params: any) {
        params.successCallback([], 0);
      }
    };
    this.gridApi.setServerSideDatasource(dataSource);
  }

  createNewCustomerExt(
    param_code: string,
    param_name: string,
    param_type: string,
    param_value: any,
  ) {
    const obj = new bl_fi_mst_entity_ext_RowClass();
    obj.param_name = param_name;
    obj.param_code = param_code;
    obj.status = 'ACTIVE';
    obj.param_type = param_type;
    if (param_type.toUpperCase() === 'STRING') {
      obj.value_string = param_value;
    } else if (param_type.toUpperCase() === 'DATE') {
      obj.value_datetime = param_value;
    } else if (param_type.toUpperCase() === 'NUMERIC') {
      obj.value_numeric = param_value;
    } else if (param_type.toUpperCase() === 'JSON') {
      obj.value_json = param_value;
    } else {
      obj.value_file = param_value;
    }
    return obj;
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
