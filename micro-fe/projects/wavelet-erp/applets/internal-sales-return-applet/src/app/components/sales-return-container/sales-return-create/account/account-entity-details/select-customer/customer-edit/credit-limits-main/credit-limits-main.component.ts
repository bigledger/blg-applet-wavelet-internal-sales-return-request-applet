import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { bl_fi_mst_entity_ext_RowClass, bl_fi_mst_entity_line_RowClass, CreditLimitService } from 'blg-akaun-ts-lib';
import * as moment from 'moment';
import { PaginationComponent } from 'projects/shared-utilities/utilities/pagination/pagination.component';
import { Observable, Subscription } from 'rxjs';
import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';
import { CustomerView } from '../../../account-entity-details.component';

@Component({
  selector: 'app-credit-limits-main',
  templateUrl: './credit-limits-main.component.html',
  styleUrls: ['./credit-limits-main.component.css']
})
export class CreditLimitsMainComponent implements OnInit {

  @Input() customerExt$: Observable<any>;
  cust: Subscription;
  deactivateAdd$;
  @Input() localState: any;
  @ViewChild(PaginationComponent, { static: false })
  private paginationComponent: PaginationComponent;

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
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  columnsDefs;
  rowData: any[] = [];
  CustomerLimit$: Observable<any>;

  constructor(
    private readonly store: Store<CustomerStates>,
    private viewColFacade: ViewColumnFacade,
  ) {
    this.columnsDefs = [
      { headerName: 'Credit Limit Code', field: 'value_json.code', suppressSizeToFit: true },
      { headerName: 'Credit Limit Name', field: 'value_json.name', suppressSizeToFit: true },
      { headerName: 'Credit Limit Currency', field: 'value_json.currency', suppressSizeToFit: true },
      {
        headerName: 'Credit Limit Amount', field: 'value_json.amount', suppressSizeToFit: true, valueFormatter: params => {
          if (!params.value) return '0.00';
          return params.value.toFixed(2)
        },
      },
      { headerName: 'Status', field: 'value_json.status', suppressSizeToFit: true },
      { headerName: 'Modification Date', field: 'value_json.updated_date', suppressSizeToFit: true, valueFormatter: params => moment(params.value).format('YYYY-MM-DD') },
    ];
  }
  ngOnInit() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.cust = this.customerExt$.subscribe(
      data => {
        let limitData = [];
        if (data) {
          data.forEach(ext => {
            if (ext) {
              limitData.push(ext)
            }
          })
          if (limitData && limitData.length > 0) {
            limitData = limitData.filter((v, i, a) => a.findIndex(t => (t.value_json['guid'] === v.value_json['guid'])) === i);
          }
          this.rowData = limitData;
          this.gridApi.setRowData(this.rowData);
        }
      }
    )
  }

  ngOnDestroy() {
    this.cust.unsubscribe();
  }

  searchValue;
  quickSearch() {
    this.gridApi.setQuickFilter(this.searchValue);
    this.paginationComponent.firstPage();
  }
  onRowClicked(entity: CustomerView) {
    this.store.dispatch(CustomerActions.selectCustomerEditExt({ ext: entity }));

    if (!this.localState.deactivateList) {
      this.viewColFacade.updateInstance(this.index, { ...this.localState, deactivateList: true });
      this.viewColFacade.onNextAndReset(this.index, 41);
    }
  }

  onNext() {
    this.viewColFacade.updateInstance(this.index, { ...this.localState, deactivateAdd: true });
    this.viewColFacade.onNextAndReset(this.index, 40);
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
