import { Component, ChangeDetectionStrategy, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { ComponentStore } from '@ngrx/component-store';
import { bl_fi_generic_doc_hdr_RowClass, bl_fi_mst_entity_ext_RowClass, EntityContainerModel } from 'blg-akaun-ts-lib';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerConstants } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/models/customer-constants';




interface LocalState {
  deactivateAdd: boolean;
  deactivateList: boolean;
  selectedIndex: number;
}

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class CustomerCreateComponent extends ViewColumnComponent implements OnInit, OnDestroy {

  protected compName = 'Customer Create';
  protected readonly index = 21;
  private localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateAdd$ = this.componentStore.select(state => state.localState.deactivateAdd);
  readonly selectedIndex$ = this.componentStore.select(state => state.localState.selectedIndex);

  prevIndex: number;
  private prevLocalState: any;

  draft$ = this.viewColFacade.draft$;
  customerExt: EntityContainerModel;

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true
  };

  gridApi;

  columnsDefs = [
    { headerName: 'Item Code', field: 'item_code' },
    { headerName: 'Batch No', field: 'item_property_json.batchNo' },
    { headerName: 'From Cable Length', field: 'item_property_json.fromCableLength' },
    { headerName: 'Quantity', field: 'item_property_json.quantity' },
    { headerName: 'UOM', field: 'item_property_json.uom' },
    { headerName: 'Packing Date', field: 'item_property_json.packingDate' },
    { headerName: 'Status', field: 'item_property_json.status' },
  ];

  @ViewChild(MatTabGroup, { static: true }) matTab: MatTabGroup;
  isValid: boolean = false;

  constructor(private viewColFacade: ViewColumnFacade,
    private readonly componentStore: ComponentStore<{ localState: LocalState }>) {
    super();
  }

  ngOnInit() {
    // this.viewColFacade.draft$.subscribe(resolve => this.customerExt = resolve);
    this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    console.log("prevIndex", this.prevIndex);
    this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState({ localState: a });
    });
  }

  onReturn() {
    this.viewColFacade.resetDraft();
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(4);
  }

  onNext(e) {
    this.localState.deactivateAdd = true;
    this.viewColFacade.onNext(2);
  }

  onGridReady(event) {
    this.gridApi = event.api;
    this.gridApi.closeToolPanel();
  }

  onRowClicked(event: string) {
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

  validDraft(f) {
    this.isValid = f;
  }

  updateDraft(e) {
    // this.deactivateAdd$ = e.valid
    // const form = this.createMain.form;
    const customerContainerModel = new EntityContainerModel();
    customerContainerModel.bl_fi_mst_entity_hdr.guid = null;
    customerContainerModel.bl_fi_mst_entity_hdr.name = e.name;
    customerContainerModel.bl_fi_mst_entity_hdr.descr = e.description;
    customerContainerModel.bl_fi_mst_entity_hdr.status = e.status;
    customerContainerModel.bl_fi_mst_entity_hdr.revision = null;
    customerContainerModel.bl_fi_mst_entity_hdr.vrsn = null;
    customerContainerModel.bl_fi_mst_entity_hdr.txn_type = e.type;
    if (e.eType) {
      customerContainerModel.bl_fi_mst_entity_hdr.is_customer = e.eType.includes('CUSTOMER');
      customerContainerModel.bl_fi_mst_entity_hdr.is_supplier = e.eType.includes('SUPPLIER');
      customerContainerModel.bl_fi_mst_entity_hdr.is_employee = e.eType.includes('EMPLOYEE');
      customerContainerModel.bl_fi_mst_entity_hdr.is_merchant = e.eType.includes('MERCHANT');
    };
    customerContainerModel.bl_fi_mst_entity_hdr.id_type = e.id_type;
    customerContainerModel.bl_fi_mst_entity_hdr.id_no = e.id_number;
    customerContainerModel.bl_fi_mst_entity_hdr.customer_code = e.code;
    customerContainerModel.bl_fi_mst_entity_hdr.tax_reg_number = e.taxID;
    customerContainerModel.bl_fi_mst_entity_hdr.default_arap_type = e.arap_type;
    customerContainerModel.bl_fi_mst_entity_hdr.id_no = e.id_number;
    customerContainerModel.bl_fi_mst_entity_hdr.id_no = e.id_number_old;
    customerContainerModel.bl_fi_mst_entity_hdr.customer_code = e.code;
    customerContainerModel.bl_fi_mst_entity_hdr.fiscal_year_end_month = e.fiscal_year_end;
    customerContainerModel.bl_fi_mst_entity_hdr.tax_reg_number = e.taxID;
    customerContainerModel.bl_fi_mst_entity_hdr.dob = e.dob;
    customerContainerModel.bl_fi_mst_entity_hdr.tax_category = e.taxCategory;
    customerContainerModel.bl_fi_mst_entity_hdr.country_alpha3_code = e.country;
    customerContainerModel.bl_fi_mst_entity_hdr.ccy_code = e.currency;
    customerContainerModel.bl_fi_mst_entity_hdr.email = e.email;
    customerContainerModel.bl_fi_mst_entity_hdr.phone = e.phone;
    customerContainerModel.bl_fi_mst_entity_hdr.website_url = e.url;
    customerContainerModel.bl_fi_mst_entity_hdr.business_nature_code = e.business_nature;
    customerContainerModel.bl_fi_mst_entity_hdr.classification = e.classification;
    customerContainerModel.bl_fi_mst_entity_hdr.alternate_tax_no_1 = e.sst_number;
    customerContainerModel.bl_fi_mst_entity_hdr.alternate_tax_no_2 = e.sst_exemption_number;
    customerContainerModel.bl_fi_mst_entity_hdr.gst_number = e.gst_number;
    customerContainerModel.bl_fi_mst_entity_hdr.wht_tax_number = e.wht_number;

    customerContainerModel.bl_fi_mst_entity_ext.push(
      this.createNewCustomerExt(CustomerConstants.GLCODE_INFO, CustomerConstants.GLCODE_INFO, 'STRING',
        e.glCode,
      ),
      this.createNewCustomerExt(CustomerConstants.CURRENCY, CustomerConstants.CURRENCY, 'JSON',
        {
          'currency': e.currency,
        }
      ),
      this.createNewCustomerExt(CustomerConstants.GENDER, CustomerConstants.GENDER, 'STRING',
        e.gender,
      ),
      // this.createNewCustomerExt(CustomerConstants.CUSTOMER_CODE, CustomerConstants.CUSTOMER_CODE, 'STRING',
      //   e.code,
      // ),
    );
    this.customerExt = customerContainerModel;
    this.viewColFacade.updateDraftHdr(customerContainerModel);
  }
  onSave() {
    this.viewColFacade.createCustomer(this.customerExt);
  }

  ngOnDestroy() {
    this.viewColFacade.updateInstance(this.index, { ...this.localState, selectedIndex: this.matTab.selectedIndex });
  }

}
