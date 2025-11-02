import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { bl_fi_mst_entity_ext_RowClass, bl_fi_mst_entity_line_RowClass, EntityContainerModel, Pagination, BranchService, CompBranchLocationEntityLinkService, CompBranchLocationEntityLinkContainerModel, LocationService, CompanyService, BranchContainerModel } from 'blg-akaun-ts-lib';
import { pageFiltering, pageSorting } from 'projects/shared-utilities/listing.utils';
import { AppConfig } from 'projects/shared-utilities/visa';
import { forkJoin, iif, Observable, of, zip } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';

@Component({
  selector: 'app-customer-branch',
  templateUrl: './customer-branch.component.html',
  styleUrls: ['./customer-branch.component.css']
})
export class CustomerBranchComponent implements OnInit {

  @Input() customerExt$: Observable<any>;
  deactivateAdd$;
  @Input() localState: any;

  @Output() lineItem = new EventEmitter<bl_fi_mst_entity_line_RowClass>();

  SQLGuids: string[] = null;
  pagination = new Pagination();
  protected subs = new SubSink();
  condition = 0;
  compName;
  branchName;
  locationName;

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true,
    cellStyle: { textAlign: "left" },
  };

  gridApi;
  arrguid = [];
  arrEntityguid = [];
  arrcompguid = [];
  arrlocationguid = [];
  branchData = [];

  protected readonly index = 2;
  columnsDefs;
  rowData: any[] = [];
  constructor(
    private readonly store: Store<CustomerStates>,
    private viewColFacade: ViewColumnFacade,
    private BranchService: BranchService,
    private compService: CompanyService,
    private lctnService: LocationService,
  ) {
    this.columnsDefs = [
      { headerName: 'Branch Name', field: 'bl_fi_mst_branch.name', sort: 'desc', suppressSizeToFit: true },
      { headerName: 'Company Name', field: 'comp_name', suppressSizeToFit: true },
      // { headerName: 'Status', field: 'bl_fi_mst_comp_branch_location_entity_link.status', suppressSizeToFit: true },
      { headerName: 'Location Name', field: 'location_name', suppressSizeToFit: true },
    ];
  }

  ngOnInit() {
  }

  searchValue;
  quickSearch() {
    this.gridApi.setQuickFilter(this.searchValue);
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();

    this.customerExt$.subscribe(data => {
      this.condition = 0;
      this.branchData = [];

      if (data) {
        data.forEach(ext => {
          if (ext) {
            if (ext.ref_1 != null && ext.status === "ACTIVE") {
              this.condition = 1;
              this.branchData.push(ext);
              this.arrguid.push(ext.ref_1);
              this.arrcompguid.push(ext.ref_2);
              this.arrlocationguid.push(ext.ref_3);
              this.arrEntityguid.push(ext.entity_hdr_guid);
            }
          }
        })

        if (this.condition === 0) {
          let dataSource = {
            getRows(params: any) {
              params.successCallback([], 0);
            }
          };
          this.gridApi.setServerSideDatasource(dataSource);
        }
        else {

          this.retrieveData([this.setCriteria('calcTotalRecords', 'true')]);
        }
        // this.rowData = branchData;
        // this.gridApi.setRowData(this.rowData);
      }
    })
  }

  // onRowClicked(event: bl_fi_mst_entity_line_RowClass) {
  //   this.lineItem.emit(event);
  // }

  onRowClicked(entity: any) {
    this.branchData.forEach((resolved) => {
      if (resolved.ref_1 === entity.data.bl_fi_mst_branch.guid) {
        this.store.dispatch(CustomerActions.selectCustomerEditExt({ ext: resolved }));
        if (!this.localState.deactivateList) {
          this.viewColFacade.updateInstance(this.index, { ...this.localState, deactivateList: true });
          this.viewColFacade.onNextAndReset(this.index, 36);
        }
      }
    })
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
      this.pagination.offset = 0;
      this.pagination.limit = 1000;
      this.pagination.conditionalCriteria = [
        { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
        // { columnName: 'orderBy', operator: '=', value: 'code' },
        { columnName: 'order', operator: '=', value: 'ASC' },
        {
          columnName: 'hdr_guids', operator: '=',
          value: this.arrguid.toString()
        },
        // {
        //   columnName: 'entity_hdr_guid', operator: '=',
        //   value: this.arrEntityguid.toString()
        // }
      ];
      this.subs.sink = this.BranchService.getByCriteria(
        this.pagination, AppConfig.apiVisa)
        .pipe(
          mergeMap(b => {
            const source: Observable<BranchContainerModel>[] = [];
            b.data.forEach(doc => source.push(
              zip(
                this.compService.getByGuid(doc.bl_fi_mst_branch.comp_guid.toString(), AppConfig.apiVisa).pipe(
                  catchError((err) => of(err))
                ),
                this.lctnService.getByGuid(doc.bl_fi_mst_branch_ext.find(x => x.param_code === "MAIN_LOCATION").value_string.toString(), AppConfig.apiVisa).pipe(
                  catchError((err) => of(err))
                )
              ).pipe(
                map(([b_a, b_b]) => {
                  doc = Object.assign({
                    comp_name: b_a.error ? b_a.error.code : b_a.data.bl_fi_mst_comp.name,
                    location_name: b_b.error ? b_b.error.code : b_b.data.bl_inv_mst_location.name
                  }, doc);
                  return doc;
                })
              )
            ));
            return iif(() => b.data.length > 0,
              forkJoin(source).pipe(map((b_inner) => {
                b.data = b_inner;
                return b
              })),
              of(b)
            );
          })
        )
        .subscribe(resolved => {
          // this.store.dispatch(InternalPackingOrderActions.loadPackingOrderSuccess({totalRecords: resolved.totalRecords}));
          // this.gridApi.setRowData(resolved.data.bl_fi_mst_branch);
          // grid.successCallback(resolved.data, resolved.totalRecords);
          // const data = sortOn(resolved.data).filter(entity => filter.by(entity));
          // const totalRecords = filter.isFiltering ? (this.SQLGuids ? this.SQLGuids.length : resolved.totalRecords) : data.length;
          grid.successCallback(resolved.data);
          // this.gridApi.forEachNode(node => {
          //   if (node.rowIndex == this.localState.rowIndexLineItem) {
          //     node.setSelected(true);
          //   }
          // });
        }, err => {
          // this.store.dispatch(InternalPackingOrderActions.loadPackingOrderFailed({error: err.message}));
          grid.failCallback();
        });

      this.arrguid = [];
      this.arrEntityguid = [];
      this.arrcompguid = [];
      this.arrlocationguid = [];
    }
  };

  setCriteria(columnName, value) {
    return { columnName, operator: '=', value }
  }

  onNext() {
    this.viewColFacade.startDraft();
    this.viewColFacade.updateInstance(this.index, { ...this.localState, deactivateAdd: true });
    this.viewColFacade.onNextAndReset(this.index, 35);
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

}
