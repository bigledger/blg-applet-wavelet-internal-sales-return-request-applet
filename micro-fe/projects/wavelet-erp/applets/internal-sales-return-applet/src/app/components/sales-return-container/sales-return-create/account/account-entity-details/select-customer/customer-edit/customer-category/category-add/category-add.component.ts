import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import {
  ApiResponseModel, CountryContainerModel,
  FinancialItemContainerModel, LabelService, Pagination, SubQueryService
} from 'blg-akaun-ts-lib';
import { Observable, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
// import { itemCatSearchModel } from '../../../../../models/advanced-search-models/item-category.model';
// import { SearchQueryModel } from '../../../../../models/advanced-search-models/query.model';
// import { containerToViewModelCat } from '../../../../../models/item-category.mappers';
// import { ItemConstants } from '../../../../../models/item-constants';
// import { AppConfig } from '../../../../../models/visa';
// import { updateItemExt } from '../../../../../shared/item-ext';
// import { ItemActions } from '../../../../../state-controllers/item-controller/store/actions';
// import { ItemSelectors } from '../../../../../state-controllers/item-controller/store/selectors';
// import { ItemStates } from '../../../../../state-controllers/item-controller/store/states';
import { SubSink } from 'subsink2';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SearchQueryModel } from 'projects/shared-utilities/models/query.model';

import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/selectors';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';
import { customerSearchModel } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/models/advanced-search-models/customer.model';
import { containerToViewModelCat } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/models/constants/customer-category.mappers';

// import { entitySearchModel } from '../../../../../models/advanced-search-models/entity.model';
// import { EntityStates } from '../../../../../state-controllers/entity-controller/store/states';
// import { EntitySelectors } from '../../../../../state-controllers/entity-controller/store/selectors';
// import { EntityActions } from '../../../../../state-controllers/entity-controller/store/actions';
// import { containerToViewModelCat } from '../../../../../models/entity-category.mappers';


interface LocalState {
  deactivateAdd: boolean;
  deactivateList: boolean;
}
export class ItemSearchData {
  guids: Array<{ guid: string; name?: string; code?: string; status?: string; action?: string; }> = []
}
@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class AddCategoryComponent extends ViewColumnComponent implements OnInit, OnDestroy {

  data: any;
  states: any;
  statesShipping: any;
  countries: any;
  stateName: any;
  stateCountryCode: any;
  stateArr: any = [];
  newStateArr: any = [];
  countryName: any;
  countryAlphaCode: any;
  countryArr: any = [];
  newCountryArr: any = [];
  currentCountryCode: any;
  public addressInfo: FormGroup;
  labellistguid = '';
  bread = 'Category Add';
  breadCrumbs: any[];
  ui: any;
  public innerWidth: any;
  hideBreadCrumb = false;
  countryContainerModel = new CountryContainerModel();
  insertLineGuid: any;
  custGuid: any;
  entityBody = new FinancialItemContainerModel();
  // extMap: Map<string, any> = new Map<string, any>();
  changePage = false;
  shippingAddress = false;
  billingAddress = false;
  deactivateReturn$;

  protected readonly index = 13;
  prevIndex: number;
  private prevLocalState: any;
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);

  // apiVisa = AppConfig.ApiVisa;
  private localState: LocalState;

  readonly deactivateAdd$ = this.componentStore.select(state => state.localState.deactivateAdd);
  readonly deactivateList$ = this.componentStore.select(state => state.localState.deactivateList);

  paging = new Pagination();
  addSuccess = 'Add';
  isClicked = 'primary';
  getLabel$: Observable<any>;
  gridApi: any;
  toggleColumn$: Observable<boolean>;
  searchModel = customerSearchModel; columnsDefs; defaultColDef; serverSideStoreType;
  rowModelType;
  rowSelection;
  selectedItem: any;
  // users that are already added
  addedEntities = new Map<string, string>();
  // subSink is to ensure all subscribe calls are unsubscribed to once the component is destroyed
  private subSink = new SubSink;
  itemCategory$: Observable<any[]>;
  selectedEntities = new Map<string, string>();
  protected subs = new SubSink();
  constructor(
    private labelService: LabelService,
    private readonly store: Store<CustomerStates>,
    private subQueryService: SubQueryService,
    private viewColFacade: ViewColumnFacade,
    private readonly componentStore: ComponentStore<{ localState: LocalState }>,
  ) {
    super();
    this.rowSelection = 'multiple';
    const customComparator = (valueA, valueB) => {
      if (valueA != null && '' !== valueA && valueB != null && '' !== valueB) {
        return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
      }
    };
    this.columnsDefs = [
      {
        headerName: 'Category Code', field: 'code', suppressSizeToFit: true, filter: 'agTextColumnFilter',
        comparator: customComparator, checkboxSelection: true,
      },
      {
        headerName: 'Category Name', field: 'name', filter: 'agTextColumnFilter',
        comparator: customComparator,
      },
      {
        headerName: 'Level Value', field: 'level_value', filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Creation Date', field: 'date_created', filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Modified Date', field: 'date_updated', filter: 'agTextColumnFilter', sort: 'desc'
      },
      {
        headerName: 'Status', field: 'status', filter: 'agTextColumnFilter',
      }
    ].map(c => ({
      ...c,
      width: 30,
      filterParams: {
        debounceMs: 1000
      }
    }));
    this.defaultColDef = {
      // floatingFilterComponentParams: { suppressFilterButton: true },
      minWidth: 200,
      flex: 1,
      sortable: true,
      resizable: true,
      suppressCsvExport: true,
      cellStyle: { textAlign: 'left' },

      floatingFilter: true,
      filter: 'agTextColumnFilter',
      // suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      menuTabs: ['filterMenuTab'],
    };
    this.rowModelType = 'serverSide';
    this.serverSideStoreType = 'partial';
  }

  ngOnInit() {
    this.itemCategory$ = this.store.select(CustomerSelectors.selectItemCategory);
    this.toggleColumn$ = this.viewColFacade.toggleColumn$;
    this.subs.sink = this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.subs.sink = this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState({ localState: a });
    });

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
    const selectedGuid = [];
    const selectedRow = this.gridApi.getSelectedRows();
    console.log(selectedRow, 'this are selected rows');
    this.selectedItem = new ItemSearchData();
    selectedRow.forEach(element => {
      selectedGuid.push(element.guid);
      this.selectedItem.guids.push({
        'guid': element.guid,
        'name': element.name,
        'code': element.code,
        'status': element.status,
        'descr': element.descr,
      });
    });
    console.log(this.selectedItem, 'selectedItem');

    this.addSuccess = 'Success';
    this.isClicked = 'buttonSuccess';
    setTimeout(() => {
      this.addSuccess = 'Add';
      this.isClicked = 'primary';
    }, 500);
    // load from link table
    // const catGuids = updateItemExt(
    //   ItemConstants.LIST_CATEGORY_GUID,
    //   ItemConstants.LIST_CATEGORY_GUID,
    //   null,
    //   null,
    //   null,
    //   { guids: selectedRow }
    // );
    // console.log(catGuids, 'catGuids');
    console.log(selectedGuid, 'selectedGuid');
    // call get item category
    this.store.dispatch(CustomerActions.itemCategory({ category: this.selectedItem.guids, updated: true }));
    this.onReturn();
    // this.store.dispatch(ItemActions.createContainerDraftInint({ entity: catGuids }))
  }
  pageFiltering(filterModel) {
    console.log('filterModel', filterModel);
    const noFilters = Object.keys(filterModel).length <= 0;
    if (noFilters) {
      return {
        by: (viewModel) => true,
        isFiltering: noFilters
      };
    }
    return {
      by: (viewModel) => Object
        .keys(filterModel)
        .map(col => {
          if (!viewModel[col]) { return false; }
          return typeof viewModel[col] === 'number' ?
            +viewModel[col] === +filterModel[col].filter :
            viewModel[col].toLowerCase().includes(filterModel[col].filter.toLowerCase());
        })
        .reduce((p, c) => p && c),
      isFiltering: noFilters
    };
  }
  pageSorting(sortModel) {
    return (data) => {
      if (sortModel.length <= 0) { return data; }
      let newData = data.map(o => o);
      sortModel.forEach(model => {
        const col = model.colId;
        newData = model.sort === 'asc' ?
          newData.sort((p, c) => 0 - (p[col] > c[col] ? -1 : 1)) :
          newData.sort((p, c) => 0 - (p[col] > c[col] ? 1 : -1));
      }
      );
      return newData;
    };
  }
  getRowsFactory(criteria, apiVisa) {
    return grid => {
      const filter = this.pageFiltering(grid.request.filterModel);
      const sortOn = this.pageSorting(grid.request.sortModel);
      // this.store.dispatch(EntityActions.loadItemExtsInit({ request: grid.request }));
      this.subs.sink = this.labelService.getByCriteria(
        new Pagination(
          grid.request.startRow,
          grid.request.endRow,
          criteria,
          [
            { columnName: 'orderBy', value: 'date_updated' },
            { columnName: 'order', value: 'DESC' }
          ]),
        apiVisa)
        .subscribe(a => {
          const data = sortOn(a.data.map(containerToViewModelCat).filter(o => filter.by(o)));
          const totalRecords = filter.isFiltering ? a.totalRecords : data.length;
          // var mapData = this.mapDataToListing(a.data);
          console.log(data, 'labeldata');

          // data.forEach(a => {
          //   this.addedEntities.set(a.guid.toString(), a)
          // })
          grid.successCallback(data, totalRecords);
          // this.store.dispatch(EntityActions.loadItemExtSuccess({ totalRecords: totalRecords }));
          this.setSelectedNodes();
        }, err => {
          grid.failCallback();
          // this.store.dispatch(EntityActions.loadItemExtFailed({ error: err.message }));
        });
    };
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.retrieveData();
    this.gridApi.sizeColumnsToFit();
  }

  retrieveData(criteria?, apiVisa = AppConfig.apiVisa) {
    criteria = (criteria) ?
      criteria :
      [
        { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
        { columnName: 'txn_type', operator: '=', value: 'CUSTOMER_CATEGORY' }
      ];
    const datasource = {
      getRows: this.getRowsFactory(criteria, apiVisa)
    };
    this.gridApi.setServerSideDatasource(datasource);
    this.getPrevSelectedRows()

  }
  getLabelList() {
    // this.getLabel$ = this.store.select(EntitySelectors.selectLabelList);


    // label list guid for item categories
    // this.subs.sink = this.getLabel$.subscribe((entity) => {
    //   if (entity) {
    //     console.log('entitytrue');
    //     this.labellistguid = entity;
    //     this.retrieveData();
    //   } else {
    //     // this.store.dispatch(EntityActions.getLabel({ labelPaging: paging }));
    //   }
    // });


    const paging = new Pagination();
    paging.conditionalCriteria = [
      { columnName: 'param_code', operator: '=', value: 'ENTITY_CATEGORIES' }
    ];
    // this._labelListService.getByCriteria(paging, this.apiVisa)
    //   .subscribe((resp: ApiResponseModel<LabelListContainerModel>) => {
    //     console.log('getlabellist resp', resp.data);
    //     if (resp.data != null) {
    //       this.pricingLabellist = resp.data;
    //       this.pricingLabellist.forEach((labellist) => {
    //         this.labellistguid = labellist.bl_fi_mst_label_list_hdr.guid.toString();
    //         console.log('this.labellistguid', this.labellistguid);
    //       });
    //       this.labelList = resp.data;

    //     }, error => {
    //       console.log('ERROR getLabelList: ', error);
    //     }
    //     );


  }
  getPrevSelectedRows() {
    this.subs.sink = this.itemCategory$.subscribe((cdata: any) => {
      console.log('itemCatselected', cdata);
      // let itemCat = [];
      let data = cdata.guids;
      if (data) {
        data.forEach(element => {
          this.selectedEntities.set(element.guid.toString(), element);
        });
      }
    }
    );
    console.log('selectedEntities', this.selectedEntities);
  }
  /**
  * This function is to be called every time the grid refreshes.
  * Set nodes that are already in the added to the team or previously currently
  * selected to selected.
  *
  */
  setSelectedNodes() {
    console.log(this.gridApi, 'gridApi');
    console.log(this.addedEntities, 'thisaddedEntities');
    console.log(this.selectedEntities, 'thisselectedEntities');
    this.gridApi.forEachNode(node => {
      const guid = node.data.guid;
      const inTeam = this.addedEntities.has(guid);
      const isCurrentlySelected = this.selectedEntities.has(guid);
      if (inTeam || isCurrentlySelected) {
        node.setSelected(true);
      } else {
        node.setSelected(false);
      }
    });
  }
  onSearch(e: SearchQueryModel) {
    if (!e.isEmpty) {
      this.searchQuery(e.queryString + ' AND hdr.label_list_guid=\'' + this.labellistguid + '\'');
      console.log('searchQuery', e);
    } else {
      this.retrieveData();
    }
  }
  searchQuery(query: string) {
    const query$ = this.subQueryService
      .post({ 'subquery': query, 'table': 'bl_fi_mst_label_hdr' }, AppConfig.apiVisa)
      .pipe(
        switchMap(resp => of(resp))
      );
    query$.pipe(
      filter((resp: ApiResponseModel<any>) => resp.data.length > 0)
    )

      .subscribe(resp => this.retrieveData([
        { columnName: 'guids', operator: '=', value: resp.data },
        { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
        { columnName: 'txn_type', operator: '=', value: 'INVENTORY_ITEM_CATEGORY' }
      ]));
    query$.pipe(
      filter((resp: ApiResponseModel<any>) => resp.data.length === 0)
    )
      .subscribe(resp => this.clear());
  }
  clear() {
    const dataSource = {
      getRows(params: any) {
        params.successCallback([], 0);
      }
    };
    this.gridApi.setServerSideDatasource(dataSource);
  }
  onToggle(e: boolean) {
    this.viewColFacade.toggleColumn(e);
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
