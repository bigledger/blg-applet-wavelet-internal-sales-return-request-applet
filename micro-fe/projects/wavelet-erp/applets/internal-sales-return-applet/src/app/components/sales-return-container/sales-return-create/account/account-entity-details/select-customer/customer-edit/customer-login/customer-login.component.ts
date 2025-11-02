import { R } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApiResponseModel, AppLoginPrincipalService, bl_fi_mst_entity_ext_RowClass, bl_fi_mst_entity_line_RowClass, EntityContainerModel, EntityLoginSubjectLinkContainerModel, EntityLoginSubjectLinkService, Pagination } from 'blg-akaun-ts-lib';
import { pageFiltering, pageSorting } from 'projects/shared-utilities/listing.utils';
import { AppConfig } from 'projects/shared-utilities/visa';
import { forkJoin, iif, Observable, of, Subscription, zip } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/selectors';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';

// app-customer-login
@Component({
  selector: 'app-customer-login',
  templateUrl: './customer-login.component.html',
  styleUrls: ['./customer-login.component.css']
})
export class CustomerLoginComponent implements OnInit {

  @Input() customerExt$: Observable<any>;
  customerLogin$: Observable<any>;
  deactivateAdd$;
  @Input() localState: any;

  @Output() lineItem = new EventEmitter<bl_fi_mst_entity_line_RowClass>();

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

  protected readonly index = 2;
  columnsDefs;
  guidSubs: Subscription;
  rowData: any[] = [];
  apiVisa = AppConfig.apiVisa;
  customerGuid: string;
  protected subs = new SubSink()
  constructor(
    private _entityLoginSubjectLinkService: EntityLoginSubjectLinkService,
    private readonly store: Store<CustomerStates>,
    private viewColFacade: ViewColumnFacade,
    private loginPrincipalService: AppLoginPrincipalService
  ) {
    const customComparator = (valueA, valueB) => {
      if (valueA != null && '' !== valueA && valueB != null && '' !== valueB) {
        return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
      }
    };

    this.columnsDefs = [
      { headerName: 'User Email', field: 'principal_id', comparator: customComparator, suppressSizeToFit: true },
      { headerName: 'Rank', field: 'rank', suppressSizeToFit: true, sort: 'desc', comparator: customComparator, },
      { headerName: 'Status', field: 'status', comparator: customComparator, suppressSizeToFit: true },
      { headerName: 'Modified Date', field: 'updated_date', comparator: customComparator, suppressSizeToFit: true },
    ];
  }

  ngOnInit() {
    this.customerLogin$ = this.store.select(CustomerSelectors.selectContainer)
  }

  setGridData() {
    const datasource = {
      getRows: grid => {

        const filter = pageFiltering(grid.request.filterModel);
        const sortOn = pageSorting(grid.request.sortModel);
        const paging = new Pagination();
        paging.conditionalCriteria = [
          { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
          { columnName: "entity_hdr_guid", operator: "=", value: this.customerGuid.toString() },
        ];

        // paymentConfigPagination.offset = this.SQLGuids ? 0 : grid.request.startRow;
        paging.limit = grid.request.endRow - grid.request.startRow;

        this.subs.sink = this._entityLoginSubjectLinkService.getByCriteria(paging, this.apiVisa).pipe(
          mergeMap((response) => {
            const data: Observable<any>[] = [];
            response.data.forEach(r => {
              let principalPagination = new Pagination();
              principalPagination.conditionalCriteria = [
                { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
                { columnName: 'subject_guid', operator: '=', value: r.bl_fi_mst_entity_login_subject_link.subject_guid.toString() }
              ]

              data.push(
                this.loginPrincipalService.getByCriteria(principalPagination, this.apiVisa).pipe(
                  catchError((err) => of(err))
                ).pipe(
                  map((login) => {
                    let object = {
                      subject_guid: r.bl_fi_mst_entity_login_subject_link.subject_guid.toString(),
                      principal_id: login.data[0].app_login_principal.principal_id.toString(),
                      rank: r.bl_fi_mst_entity_login_subject_link.rank?.toString(),
                      status: r.bl_fi_mst_entity_login_subject_link.status?.toString()
                    }
                    return object;
                  })
                )
              )
            }
            );
            return iif(() => response.data.length > 0,
              forkJoin(data).pipe(map((data) => {
                response.data = data
                return response;
              })),
              of(response)
            );
          })
        ).subscribe(resolved => {
          const data = sortOn(resolved.data.filter(o => filter.by(o)));
          const totalRecords = filter.isFiltering ? resolved.totalRecords : data.length;
          grid.success({
            rowData: data,
            rowCount: totalRecords
          });
        }, err => {
          grid.fail();
        });
      }
    }
    this.gridApi.setServerSideDatasource(datasource);
    this.subs.sink = this.store.select(CustomerSelectors.selectAgGrid).subscribe(a => {
      if (a) {
        this.gridApi.refreshServerSideStore({ purge: true });
        this.store.dispatch(CustomerActions.updateAgGridDone({ status: false }));
      }
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();

    this.subs.sink = this.store.select(CustomerSelectors.selectGuid).subscribe((guid) => {
      this.customerGuid = guid;
      this.setGridData()
    })
  }

  onRowClicked(entity: any) {

    this.store.dispatch(CustomerActions.selectCustomerEditExt({ ext: entity }));
    if (!this.localState.deactivateList) {
      this.viewColFacade.updateInstance(this.index, { ...this.localState, deactivateList: true });
      this.viewColFacade.onNextAndReset(this.index, 26);
    }
  }
  searchValue;
  quickSearch() {
    this.gridApi.setQuickFilter(this.searchValue);
  }

  onNext() {
    this.viewColFacade.updateInstance(this.index, { ...this.localState, deactivateAdd: true });
    this.viewColFacade.onNextAndReset(this.index, 25);
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
