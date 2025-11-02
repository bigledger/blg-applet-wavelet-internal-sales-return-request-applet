import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  bl_fi_mst_entity_ext_RowClass, bl_fi_mst_entity_line_RowClass,
  LabelService, Pagination
} from 'blg-akaun-ts-lib';
import { combineLatest, Observable } from 'rxjs';
import { SubSink } from 'subsink2';
import { ComponentStore } from '@ngrx/component-store';
import { ChangeDetectionStrategy } from '@angular/core';
import { AppConfig } from 'projects/shared-utilities/visa';
import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/selectors';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';


@Component({
  selector: 'app-customer-category',
  templateUrl: './customer-category.component.html',
  styleUrls: ['./customer-category.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class CustomerCategoryComponent implements OnInit, OnDestroy {

  // @Input() itemCategory$: Observable<any>;
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
    cellStyle: { textAlign: 'left' },
  };

  gridApi;

  protected readonly index = 2;
  columnsDefs;
  rowData: any[] = [];
  // apiVisa = AppConfig.ApiVisa;
  labelGuids: any = [];
  tempCat$: Observable<boolean>;
  tryError$: Observable<any[]>;
  tempCatRow$: Observable<any>;
  itemCategory$: Observable<any[]>;
  protected subs = new SubSink();
  updatedCat$: Observable<boolean>;
  apiVisa = AppConfig.apiVisa;
  constructor(
    private labelService: LabelService,
    private readonly store: Store<CustomerStates>,
    private viewColFacade: ViewColumnFacade,
  ) {
    this.columnsDefs = [
      { headerName: 'Category Code', field: 'code', sort: 'desc', suppressSizeToFit: true },
      { headerName: 'Category Name', field: 'name', suppressSizeToFit: true },
      { headerName: 'Level Value', field: 'level_value', suppressSizeToFit: true },
      { headerName: 'Status', field: 'status', suppressSizeToFit: true },
    ];
  }

  ngOnInit() {
    // this.updatedCat$ = this.store.select(CustomerSelectors.selectUpdatedCat);
  }
  // only call when new category added from another component
  // if not category added load data from tempCatRow state

  //  have state tempCat to check to call or not to call get category function
  //

  onGridReady(params) {

    const firstCall = false;
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.tempCatRow$ = this.store.select(CustomerSelectors.selectRowCat);
    this.tempCat$ = this.store.select(CustomerSelectors.selectTempCat);

    this.itemCategory$ = this.store.select(CustomerSelectors.selectItemCategory);
    this.subs.sink = this.itemCategory$.subscribe((catData: any) => {
      if (catData) {
        this.rowData = catData.guids;
        this.gridApi.setRowData(this.rowData);
      }

    });
  }

  checkCatRow() {
    this.subs.sink = combineLatest([this.itemCategory$, this.tempCat$, this.tempCatRow$])
      .subscribe(([itemData, catBoolean, rowData]) => {
        if (itemData) {
          this.labelGuids = itemData;
          // 4 times if(true getitemcategory) call only once
          if (catBoolean) {
            this.labelGuids = itemData;
            // firstCall = true
            this.getItemCategory();
            // this.store.dispatch(ItemActions.tempCat({ cat: false }));
          } else {
            // firstCall = false;
            if (rowData) {
              this.rowData = rowData;
            }
          }
        }
      });

  }
  getItemCategory() {
    const paging = new Pagination();
    paging.conditionalCriteria.push({
      columnName: 'guids',
      operator: '=',
      value: this.labelGuids.toString(),
    });
    this.labelService.getByCriteriaPromise(paging, this.apiVisa)
      .then(async (respLabel) => {
        if (respLabel.data.length !== 0) {
          const tempRow = [];
          this.rowData = respLabel.data;
          this.gridApi.setRowData(respLabel.data);
          // tslint:disable-next-line: forin
          for (const key in respLabel.data) {
            tempRow.push({
              code: respLabel.data[key].bl_fi_mst_label_hdr.code,
              name: respLabel.data[key].bl_fi_mst_label_hdr.name,
              guid: respLabel.data[key].bl_fi_mst_label_hdr.guid,
              level_value: respLabel.data[key].bl_fi_mst_label_hdr.level_value,
              status: respLabel.data[key].bl_fi_mst_label_hdr.status,
              descr: respLabel.data[key].bl_fi_mst_label_hdr.descr,
            });
          }
          // this.rowData = tempRow;
          // this.store.dispatch(ItemActions.tempCat({ cat: false }));
          // this.store.dispatch(ItemActions.tempCatRow({ respLabel: tempRow }));
          // this.store.dispatch(CustomerActions.itemCategory({ category: tempRow, updated: false }));
        }
      });
  }


  // tslint:disable-next-line: member-ordering
  searchValue;
  quickSearch() {

    this.gridApi.setQuickFilter(this.searchValue);
  }
  onRowClicked(entity) {
    // this.store.dispatch(EntityActions.onRowClick({ rowData: entity }));
    this.store.dispatch(CustomerActions.selectCustomerEditExt({ ext: entity }));

    if (!this.localState.deactivateList) {
      this.viewColFacade.updateInstance(this.index, { ...this.localState, deactivateList: true });
      this.viewColFacade.onNextAndReset(this.index, 24);
    }
  }

  onNext() {

    // this.viewColFacade.startDraft();
    this.viewColFacade.updateInstance(this.index, { ...this.localState, deactivateAdd: true });
    this.viewColFacade.onNextAndReset(this.index, 23);
  }
  createNewItemExt(
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


