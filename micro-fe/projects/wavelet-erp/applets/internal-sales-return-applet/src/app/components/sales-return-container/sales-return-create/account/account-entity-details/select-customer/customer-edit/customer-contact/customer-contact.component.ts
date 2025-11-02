import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { bl_fi_mst_entity_ext_RowClass, bl_fi_mst_entity_line_RowClass, EntityContainerModel } from 'blg-akaun-ts-lib';
import { Observable } from 'rxjs';
import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';
import { CustomerView } from '../../../account-entity-details.component';

// app-customer-payment-config
@Component({
  selector: 'app-customer-contact',
  templateUrl: './customer-contact.component.html',
  styleUrls: ['./customer-contact.component.css']
})
export class CustomerContactComponent implements OnInit {

  @Input() customerExt$: Observable<any>;
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
  rowData: any[] = [];
  constructor(
    private readonly store: Store<CustomerStates>,
    private viewColFacade: ViewColumnFacade,
  ) {
    this.columnsDefs = [
      { headerName: 'Contact Name', field: 'name', sort: 'desc', suppressSizeToFit: true },
      { headerName: 'Contact ID', field: 'id_no', suppressSizeToFit: true },
      { headerName: 'Designation/Position', field: 'contact_json.position', suppressSizeToFit: true },
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

    this.customerExt$.subscribe(
      data => {
        let contactData = [];

        if (data) {
          data.forEach(ext => {
            if (ext) {
              contactData.push(ext)
            }
          })
          this.rowData = contactData;
          this.gridApi.setRowData(this.rowData);
        }
      }
    )
  }

  // onRowClicked(event: bl_fi_mst_entity_line_RowClass) {
  //   this.lineItem.emit(event);
  // }

  onRowClicked(entity: CustomerView) {
    this.store.dispatch(CustomerActions.selectCustomerEditExt({ ext: entity }));
    if (!this.localState.deactivateList) {
      this.viewColFacade.updateInstance(this.index, { ...this.localState, deactivateList: true });
      this.viewColFacade.onNextAndReset(this.index, 34);
    }
  }

  onNext() {
    this.viewColFacade.startDraft();
    this.viewColFacade.updateInstance(this.index, { ...this.localState, deactivateAdd: true });
    this.viewColFacade.onNextAndReset(this.index, 33);
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
