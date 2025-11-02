import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColDefUtil } from 'ag-grid-community';
import { bl_fi_entity_credit_term_hdr_RowClass, bl_fi_mst_entity_ext_RowClass, CreditTermService } from 'blg-akaun-ts-lib';
import * as moment from 'moment';
import { PaginationComponent } from 'projects/shared-utilities/utilities/pagination/pagination.component';
import { Observable, Subscription } from 'rxjs';
import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';
import { CustomerView } from '../../../account-entity-details.component';

@Component({
  selector: 'app-credit-terms-main',
  templateUrl: './credit-terms-main.component.html',
  styleUrls: ['./credit-terms-main.component.css']
})
export class CreditTermsMainComponent implements OnInit {

  @Input() customerExt$: Observable<any>;
  deactivateAdd$;
  @Input() localState: any;
  cust: Subscription;
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
  constructor(
    private readonly store: Store<CustomerStates>,
    private viewColFacade: ViewColumnFacade,
    private termService: CreditTermService,
  ) {
    this.columnsDefs = [
      { headerName: 'Credit Term Code', field: 'value_json.code', suppressSizeToFit: true },
      { headerName: 'Credit Term Name', field: 'value_json.name', suppressSizeToFit: true },
      { headerName: 'Status', field: 'value_json.status', suppressSizeToFit: true },
      { headerName: 'Modification Date', field: 'value_json.updated_date', suppressSizeToFit: true, valueFormatter: params => moment(params.value).format('YYYY-MM-DD ') },
    ];
  }

  ngOnInit() {

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();

    this.cust = this.customerExt$.subscribe(

      data => {
        let termData = [];
        if (data) {
          data.forEach(ext => {
            if (ext) {
              termData.push(ext)
            }
          })
          if (termData && termData.length > 0) {
            termData = termData.filter((v, i, a) => a.findIndex(t => (t.value_json['guid'] === v.value_json['guid'])) === i);
          }
          this.rowData = termData;
          this.gridApi.setRowData(this.rowData);
        }
      }
    )
  }

  ngOnDestroy() {
    this.cust.unsubscribe();
  }

  searchValue: any;
  quickSearch() {
    this.gridApi.setQuickFilter(this.searchValue);
    this.paginationComponent.firstPage();
  }
  onRowClicked(entity: CustomerView) {
    this.store.dispatch(CustomerActions.selectCustomerEditExt({ ext: entity }));

    if (!this.localState.deactivateList) {
      this.viewColFacade.updateInstance(this.index, { ...this.localState, deactivateList: true });
      this.viewColFacade.onNextAndReset(this.index, 39);
    }
  }

  onNext() {
    this.viewColFacade.updateInstance(this.index, { ...this.localState, deactivateAdd: true });
    this.viewColFacade.onNextAndReset(this.index, 38);
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
