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
  selector: 'app-customer-tax',
  templateUrl: './customer-tax.component.html',
  styleUrls: ['./customer-tax.component.css']
})
export class CustomerTaxComponent implements OnInit {

  @Input() taxArray$: Observable<any>;
  deactivateAdd$;
  @Input() localState: any;

  protected subs = new SubSink();

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

  // columnsDefs = [
  //   { headerName: 'Item Code', field: 'item_code' },
  //   { headerName: 'Batch No', field: 'item_property_json.batchNo' },
  //   { headerName: 'From Cable Length', field: 'item_property_json.fromCableLength' },
  //   { headerName: 'Drum Size', field: 'item_property_json.fromCableLength' },
  //   { headerName: 'Quantity', field: 'item_property_json.quantity' },
  //   { headerName: 'UOM', field: 'item_property_json.uom' },
  //   { headerName: 'Packing Date', field: 'item_property_json.packingDate' },
  //   { headerName: 'Remarks', field: 'item_property_json.remarks' },
  // ];
  protected readonly index = 2;
  columnsDefs;
  searchValue: any;
  rowData: any[] = [];

  constructor(
    private readonly store: Store<CustomerStates>,
    private viewColFacade: ViewColumnFacade,
  ) {
    this.columnsDefs = [
      { headerName: 'Country', field: 'value_json.country', sort: 'desc', suppressSizeToFit: true },
      { headerName: 'Tax Code', field: 'value_json.tax_code', suppressSizeToFit: true },
      { headerName: 'Tax Type', field: 'value_json.tax_type', suppressSizeToFit: true },
      { headerName: 'Tax Rate', field: 'value_json.tax_rate', suppressSizeToFit: true, cellStyle: { textAlign: "right" }, },
      { headerName: 'Tax Option', field: 'value_json.tax_option', suppressSizeToFit: true, },
    ];
  }

  ngOnInit() {

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();

    this.subs.sink = this.taxArray$.subscribe(
      data => {
        let taxData = [];
        if (data) {
          data.forEach(ext => {
            if (ext && ext.status != 'DELETED') {
              taxData.push(ext)
            }
          })
          this.rowData = taxData;
          this.gridApi.setRowData(this.rowData);
        }
      }
    )
  }

  onRowClicked(entity: CustomerView) {
    this.store.dispatch(CustomerActions.selectCustomerEditExt({ ext: entity }));
    if (!this.localState.deactivateList) {
      this.viewColFacade.updateInstance(this.index, { ...this.localState, deactivateList: true });
      this.viewColFacade.onNextAndReset(this.index, 30);
    }
  }
  quickSearch() {
    this.gridApi.setQuickFilter(this.searchValue);
  }

  onNext() {
    // this.viewColFacade.startDraft();
    this.viewColFacade.updateInstance(this.index, { ...this.localState, deactivateAdd: true });
    this.viewColFacade.onNextAndReset(this.index, 29);
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
