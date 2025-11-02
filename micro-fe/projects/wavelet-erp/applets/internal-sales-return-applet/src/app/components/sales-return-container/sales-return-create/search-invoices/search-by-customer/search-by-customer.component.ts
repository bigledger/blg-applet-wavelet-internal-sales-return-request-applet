import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { ComponentStore } from "@ngrx/component-store";
import { Store } from "@ngrx/store";
import { GridOptions } from "ag-grid-enterprise";
import {
  CustomerService,
  EntityContainerModel,
  bl_fi_mst_entity_line_RowClass,
} from "blg-akaun-ts-lib";
import { ToastrService } from "ngx-toastr";
import { SearchQueryModel } from "projects/shared-utilities/models/query.model";
import { AppConfig } from "projects/shared-utilities/visa";
import { Observable, of, Subject, from } from 'rxjs';
import { SubSink } from "subsink2";
import { ViewColumnFacade } from "../../../../../facades/view-column.facade";
import { entitySearchModel } from "../../../../../models/advanced-search-models/entity.model";
import { CustomerActions } from "../../../../../state-controllers/customer-controller/actions";
import { CustomerSelectors } from "../../../../../state-controllers/customer-controller/selectors";
import { CustomerStates } from "../../../../../state-controllers/customer-controller/states";
import { InternalSalesReturnActions } from "../../../../../state-controllers/internal-sales-return-controller/store/actions";
import { InternalSalesReturnStates } from "../../../../../state-controllers/internal-sales-return-controller/store/states";
import { ListingInputModel } from "projects/shared-utilities/models/listing-input.model";
import { ListingService } from "projects/shared-utilities/services/listing-service";
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';
import { PaginationV2Component } from "projects/shared-utilities/utilities/pagination-v2/pagination-v2.component";
import { map, mergeMap, toArray, switchMap } from "rxjs/operators";

interface LocalState {
  deactivateReturn: boolean;
  deactivateList: boolean;
  deactivateAdd: boolean;
  rowIndexListing: number;
}

@Component({
  selector: "app-search-by-customer",
  templateUrl: "./search-by-customer.component.html",
  styleUrls: ["./search-by-customer.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class SearchByCustomerComponent implements OnInit {
  protected subs = new SubSink();

  protected compName = "Select Customer Listing";
  protected readonly index = 1;
  protected localState: LocalState;
  protected prevLocalState: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateAdd$ = this.componentStore.select(
    (state) => state.deactivateAdd
  );
  readonly deactivateList$ = this.componentStore.select(
    (state) => state.deactivateList
  );
  readonly deactivateReturn$ = this.componentStore.select(
    (state) => state.deactivateReturn
  );

  prevIndex: number;
  searchModel = entitySearchModel;
  toggleMode: boolean = false;
  selectedRowIndex: number;
  rowData = [];
  totalRecords = 0;
  limit = 10;
  searchQuery: SearchQueryModel;
  apiVisa = AppConfig.apiVisa;

  columnsDefs = [
    {
      headerName: 'Code', field: 'bl_fi_mst_entity_hdr.customer_code', type: 'textColumn',
      cellRenderer: 'agGroupCellRenderer'
    },
    { headerName: 'Name', field: 'bl_fi_mst_entity_hdr.name', type: 'textColumn' },
    { headerName: 'Contact Number', field: 'bl_fi_mst_entity_hdr.phone', type: 'textColumn' },
    {
      headerName: "Email",
      field: "bl_fi_mst_entity_hdr.email",
      type: 'textColumn'
    },
    { headerName: 'Description', field: 'bl_fi_mst_entity_hdr.descr', type: 'textColumn' },
    { headerName: 'Ref 1', field: 'bl_fi_mst_entity_hdr.ref_1', type: 'textColumn' },
    { headerName: 'Ref 2', field: 'bl_fi_mst_entity_hdr.ref_2', type: 'textColumn' },
    { headerName: 'Type', field: 'bl_fi_mst_entity_hdr.txn_type', type: 'textColumn' },
  ];

  gridApi;
  gridColumnApi;
  gridOptions: GridOptions = {
    statusBar: {
      statusPanels: [
          { statusPanel: 'agTotalAndFilteredRowCountComponent', key: 'totalAndFilter', align: 'left' },
          { statusPanel: 'agSelectedRowCountComponent', align: 'left' },
          { statusPanel: 'agAggregationComponent', align: 'right' }
      ]
    },
    defaultColDef: {
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      //minWidth: 100,
      //flex: 1,
      width: 100,
      sortable: true,
      resizable: true,
      enableRowGroup: false,
      enablePivot: false
    },
    columnTypes: UtilitiesModule.columnTypes,
    pagination: true,
    animateRows: true,
    sideBar: true,
    rowSelection: 'single',
    suppressRowClickSelection: false,
    multiSortKey: 'ctrl',
    onSortChanged: this.onSortChanged,
    onFilterChanged: this.onFilterChanged,
  };

  @ViewChild(PaginationV2Component, { static: false })
  private paginationComponent: PaginationV2Component;

  constructor(
    private viewColFacade: ViewColumnFacade,
    protected readonly componentStore: ComponentStore<LocalState>,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private store: Store<InternalSalesReturnStates>,
    protected listingService: ListingService
  ) {}

  ngOnInit() {
    this.subs.sink = this.localState$.subscribe((a) => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(
      (resolve) => (this.prevIndex = resolve)
    );
    this.subs.sink = this.viewColFacade
      .prevLocalState$()
      .subscribe((resolve) => (this.prevLocalState = resolve));
  }

  toggle(event: MatSlideToggleChange) {
    if (event.checked) {
      this.toggleMode = true;
      this.store.dispatch(
        CustomerActions.selectToggleMode({ SelectedToggleMode: true })
      );
    } else {
      this.toggleMode = false;
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    if (this.rowData.length > 0) {
      this.setDataRowCache();
    }
    else
    {
      this.getTotalData();
      this.createData();
    }
    this.gridApi.sizeColumnsToFit();
    UtilitiesModule.autoSizeAllColumns(params);
  }

  createData() {
    console.log("on create data....");
    const formData = this.getInputModel();
    this.subs.sink = this.listingService.get("entity/customers", formData, this.apiVisa).pipe(
      mergeMap(a => from(a.data).pipe(
        map(b => {
          Object.assign(b,
            {
              'bl_fi_mst_entity_hdr': b,
            }
          )
          return b;
        }),
        toArray(),
        map(c => {
          a.data = c;
          return a;
        })
      ))
    ).subscribe(resolved => {
      // console.log("DEBUG:::::::resolved",resolved )
      this.rowData = [...this.rowData, ...resolved.data];
      this.gridApi.setRowData(this.rowData);
      this.gridApi.paginationGoToLastPage();
      this.paginationComponent.totalRecords.next(this.totalRecords);
      UtilitiesModule.autoSizeAllColumns(this.gridOptions);
    }, err => {
      console.error(err);
    });
  };
  getInputModel() {
    const inputModel = {} as ListingInputModel;
    inputModel.search = (this.searchQuery?.keyword);
    inputModel.searchColumns = ['name','phone','email','id_no','customer_code'];
    inputModel.status = ['ACTIVE'];
    inputModel.orderBy = 'updated_date';
    inputModel.order = 'desc';
    inputModel.limit = this.limit;
    inputModel.offset = this.rowData.length;
    inputModel.calcTotalRecords = false;
    inputModel.showCreatedBy = false;
    inputModel.showUpdatedBy = false;
    inputModel.filterLogical = 'AND';
    inputModel.filterConditions = [];
    inputModel.childs = [{
      "tableName": "bl_fi_mst_entity_line",
      "joinColumn": "entity_hdr_guid",
      "filterLogical": "OR",
      "filterConditions": []
    }];
    if (this.searchQuery?.queryString) {
      const code = UtilitiesModule.checkNull(this.searchQuery.queryString['code'],'');
      if (code) {
        inputModel.filterConditions.push({
          "filterColumn": "customer_code",
          "filterValues": [code],
          "filterOperator": "="
        })
      }
      const name = UtilitiesModule.checkNull(this.searchQuery.queryString['name'],'');
      if (name) {
        inputModel.filterConditions.push({
          "filterColumn": "name",
          "filterValues": [name],
          "filterOperator": "="
        })
      }
      const phoneNo = UtilitiesModule.checkNull(this.searchQuery.queryString['phoneNo'],'');
      if (phoneNo) {
        inputModel.filterConditions.push({
          "filterColumn": "phone",
          "filterValues": [phoneNo],
          "filterOperator": "="
        })
      }
      const type = UtilitiesModule.checkNull(this.searchQuery.queryString['type'],'');
      if (type) {
        inputModel.filterConditions.push({
          "filterColumn": "txn_type",
          "filterValues": [type],
          "filterOperator": "="
        })
      }
      if (this.searchQuery.queryString['modifiedDateCheckbox']) {
        const dateFrom = UtilitiesModule.checkNull(this.searchQuery.queryString['modifiedDate']['from'],'2022-01-01T00:00:00.000Z');
        const dateTo = UtilitiesModule.checkNull(this.searchQuery.queryString['modifiedDate']['to'],'2099-12-31T00:00:00.000Z');
        inputModel.filterDate = {
          "dateFrom": dateFrom,
          "dateTo": dateTo,
          "column": "updated_date"
        }
      }
    }
    return inputModel;
  }

  getTotalData() {
    console.log("on create data....");
    const formData = this.getInputModel();
    formData.childs = [];
    formData.calcTotalRecords = true;
    formData.calcTotalRecordsOnly = true;
    this.subs.sink = this.listingService.get("entity/customers", formData, this.apiVisa).pipe(
    ).subscribe(resolved => {
      this.totalRecords = resolved.totalRecords;
      this.paginationComponent.totalRecords.next(this.totalRecords);
    }, err => {
      console.error(err);
    });
  };

  clear() {
    this.gridApi.setRowData(null);
    this.totalRecords = 0;
    this.rowData = [];
    this.paginationComponent.totalRecords.next(this.totalRecords);
  }

  onSearch(e: SearchQueryModel) {
    console.log("search", e);
    if (!e.isEmpty) {
      if (e.keyword && e.keyword.length > 0 && e.keyword.length < 3)  {
        this.toastr.error(
          'Search keyword must more than 2 characters.',
          'Keyword',
          {
            tapToDismiss: true,
            progressBar: true,
            timeOut: 1300
          }
        );
        return;
      }this.searchQuery = e;
      this.clear();
      this.getTotalData();
      this.createData();
    }
  }

  setDataRowCache() {
    console.log('set data row cache');
    this.gridApi.setRowData(this.rowData);
    this.paginationComponent.totalRecords.next(this.totalRecords);
  }

  onMorePage() {
    console.log('on more page click');
    if (this.rowData.length < this.totalRecords) {
      this.createData();
    }
  }

  onReturn() {
    this.viewColFacade.updateInstance<LocalState>(this.prevIndex, {
      ...this.prevLocalState,
      deactivateReturn: false,
      deactivateAdd: false,
      deactivateList: false,
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  onRowClicked(entity) {
    this.store.dispatch(
      InternalSalesReturnActions.selectCustomerForSalesReturn({
        customerGuid: entity.bl_fi_mst_entity_hdr.guid.toString(),
      })
    );
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateAdd: true,
      deactivateList: false,
      selectedSearchIndex: 0
    });
    this.viewColFacade.onNextAndReset(this.index, 42);
  }

  onFirstDataRendered(params) {
    UtilitiesModule.autoSizeAllColumns(params);
  }

  onSortChanged(e) {
    e.api.refreshCells();
  }

  onFilterChanged(e) {
    e.api.refreshCells();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
