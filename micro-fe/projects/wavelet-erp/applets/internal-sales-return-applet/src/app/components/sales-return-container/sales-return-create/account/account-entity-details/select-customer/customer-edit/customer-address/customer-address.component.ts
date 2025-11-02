import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { bl_fi_mst_entity_ext_RowClass, bl_fi_mst_entity_line_RowClass, EntityContainerModel } from 'blg-akaun-ts-lib';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';
import { CustomerView } from '../../../account-entity-details.component';

// app-customer-payment-config
@Component({
  selector: 'app-customer-address',
  templateUrl: './customer-address.component.html',
  styleUrls: ['./customer-address.component.css']
})
export class CustomerAddressComponent implements OnInit {

  // @Input() customerExt$: Observable<any>;
  @Input() customerAddress$: Observable<any>;
  deactivateAdd$;
  @Input() localState: any;

  @Output() lineItem = new EventEmitter<bl_fi_mst_entity_line_RowClass>();

  protected subs = new SubSink();

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
  searchValue;

  protected readonly index = 2;
  columnsDefs;
  rowData: any[] = [];
  constructor(
    private readonly store: Store<CustomerStates>,
    private viewColFacade: ViewColumnFacade,
  ) {
    this.columnsDefs = [
      { headerName: 'Address Name', field: 'name', sort: 'desc', suppressSizeToFit: true },
      {
        headerName: 'Address Type', suppressSizeToFit: true,
        valueGetter: function (params: any) {
          return params.data.addressType + (params.data.default_address_status ? " (default)" : "")
        }
      },
      { headerName: 'Address Line 1', field: 'address_line_1', suppressSizeToFit: true },
      { headerName: 'Address Line 2', field: 'address_line_2', suppressSizeToFit: true },
      { headerName: 'Country', field: 'country', suppressSizeToFit: true },
      { headerName: 'State', field: 'state', suppressSizeToFit: true },
      { headerName: 'Postcode', field: 'postal_code', suppressSizeToFit: true },
    ];
  }

  ngOnInit() {

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();

    //   this.subs.sink = this.customerExt$.subscribe(
    //     data => {
    //       let addressData = [];
    //       if (data) {
    //         data.forEach(ext => {
    //           if (ext) {
    //             addressData.push(ext)
    //           }
    //         })
    //         this.rowData = addressData;
    //         this.gridApi.setRowData(this.rowData);
    //       }
    //     }
    //   )

    this.subs.sink = this.customerAddress$.subscribe(
      data => {
        let addressData = [];
        if (data) {
          addressData = data.main_address.concat(data.billing_address, data.shipping_address);
          this.rowData = addressData;
          this.gridApi.setRowData(this.rowData);
        }
      });


  }

  quickSearch() {
    this.gridApi.setQuickFilter(this.searchValue);
  }

  onRowClicked(entity: CustomerView) {
    const addressData = this.checkAddressPos(entity);
    const entityWithAddressData = { ...entity, address_pos: addressData.address_pos, originalAddressType: addressData.originalAddressType };

    // this.store.dispatch(CustomerActions.selectCustomerEditExt({ ext: entity }));
    this.store.dispatch(CustomerActions.selectCustomerEditExt({ ext: entityWithAddressData }));

    if (!this.localState.deactivateList) {
      this.viewColFacade.updateInstance(this.index, { ...this.localState, deactivateList: true });
      this.viewColFacade.onNextAndReset(this.index, 32);
    }
  }

  checkAddressPos(addressObj) {
    let i = 0;
    while (i < this.rowData.length) {
      if (addressObj.addressType === this.rowData[i].addressType &&
        addressObj.name === this.rowData[i].name &&
        addressObj.address_line_1 === this.rowData[i].address_line_1 &&
        addressObj.address_line_2 === this.rowData[i].address_line_2 &&
        addressObj.address_line_3 === this.rowData[i].address_line_3 &&
        addressObj.address_line_4 === this.rowData[i].address_line_4 &&
        addressObj.address_line_5 === this.rowData[i].address_line_5 &&
        addressObj.country === this.rowData[i].country &&
        addressObj.state === this.rowData[i].state &&
        addressObj.city === this.rowData[i].city &&
        addressObj.postal_code === this.rowData[i].postal_code) {
        return { address_pos: i, originalAddressType: addressObj.addressType };
      }
      i++;
    }

    return null;
  }



  onNext() {
    this.viewColFacade.startDraft();
    this.viewColFacade.updateInstance(this.index, { ...this.localState, deactivateAdd: true });
    this.viewColFacade.onNextAndReset(this.index, 31);
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
