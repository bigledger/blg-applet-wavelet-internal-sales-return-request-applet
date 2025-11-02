import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiResponseModel, bl_fi_mst_entity_ext_RowClass, bl_fi_mst_entity_line_RowClass, EntityLoginSubjectLinkContainerModel, EntityLoginSubjectLinkService, Pagination, SettlementMethodContainerModel, } from 'blg-akaun-ts-lib';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppConfig } from 'projects/shared-utilities/visa';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/selectors';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';

interface LocalState {
  deactivateReturn: boolean;
  deactivateList: boolean;
  selectedIndex: number;
}
@Component({
  selector: 'app-contact-edit',
  templateUrl: './customer-contact-edit.component.html',
  styleUrls: ['./customer-contact-edit.component.css']
})
export class EditContactComponent extends ViewColumnComponent implements OnInit {
  @Input() customerExt$: Observable<any>;
  form: FormGroup;
  formProperty: FormGroup;
  @Input() customerExtLineItem$: Observable<bl_fi_mst_entity_line_RowClass>;


  // @Input() customerExtLineItem$: Observable<bl_fi_mst_entity_line_RowClass>;
  protected readonly index = 10;
  prevIndex: number;
  private prevLocalState: any;
  private localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);

  apiVisa = AppConfig.apiVisa;
  paging = new Pagination();

  contactExt: any;
  gridApi: any;
  rowData: any[];

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
  columnsDefs;
  addSuccess = 'Add';
  isClicked: string;
  constructor(private fb: FormBuilder,
    private readonly store: Store<CustomerStates>,
    private viewColFacade: ViewColumnFacade,
    private _entityLoginSubjectLinkService: EntityLoginSubjectLinkService,
  ) {
    super();
    const customComparator = (valueA, valueB) => {
      if (valueA != null && '' !== valueA && valueB != null && '' !== valueB) {
        return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
      }
    };
    this.columnsDefs = [
      { headerName: 'User Email', field: 'bl_fi_mst_entity_login_subject_link.subject_guid', comparator: customComparator, suppressSizeToFit: true },
      { headerName: 'Rank', field: 'bl_fi_mst_entity_login_subject_link.rank', suppressSizeToFit: true, sort: 'desc', comparator: customComparator, },
      { headerName: 'Status', field: 'bl_fi_mst_entity_login_subject_link.status', comparator: customComparator, suppressSizeToFit: true },
      { headerName: 'Modified Date', field: 'bl_fi_mst_entity_login_subject_link.entity_hdr_guid', comparator: customComparator, suppressSizeToFit: true },
    ];
  }

  ngOnInit() {
    this.isClicked = 'primary';
    this.addSuccess = 'Add';
    this.form = this.fb.group({
      contact_name: ['', Validators.required],
      contact_id: ['', Validators.required],
      position: ['', Validators.required],
      office_no: [''],
      extension_no: [''],
      mobile_no: ['', Validators.required],
      fax_no: [''],
      other_no: [''],
      guid: ['', Validators.required],
      status: [''],
      searchValue: [''],
      email: [''],
      phone: [''],
    });

    this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.customerExt$ = this.store.select(CustomerSelectors.selectExt);
    this.customerExt$.subscribe(
      data => {
        console.log(data, 'thisafata');
        this.contactExt = data[0];
        const extData = data[0].contact_json;
        this.form.patchValue(
          {
            guid: data[0].guid,
            contact_name: data[0].name,
            contact_id: data[0].id_no,
            position: extData.position,
            office_no: extData.office_no,
            extension_no: extData.extension_no,
            mobile_no: extData.mobile_no,
            fax_no: extData.fax_no,
            other_no: extData.other_no,
            phone: data[0].phone,
            email: data[0].email,
            status: data[0].status,
          },
        );
      }
    );
    // this.monitorChanges();
  }

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  onSave(status) {
    const newContactLine = new bl_fi_mst_entity_line_RowClass();
    const form = this.form.value;
    newContactLine.name = form.contact_name;
    newContactLine.id_no = form.contact_id;
    newContactLine.guid = form.guid;
    this.formProperty = this.fb.group({
      position: form.position,
      office_no: form.office_no,
      extension_no: form.extension_no,
      mobile_no: form.mobile_no,
      fax_no: form.fax_no,
      other_no: form.other_no,
    });
    newContactLine.phone = form.phone;
    newContactLine.email = form.email;
    newContactLine.status = status;
    newContactLine.contact_json = this.formProperty.value;
    this.contactExt.ext = newContactLine;

    this.store.dispatch(CustomerActions.editContactLine({ guid: this.form.value.guid, ext: this.contactExt.ext }));
    this.addSuccess = 'Success';
    this.isClicked = 'buttonSuccess';
    setTimeout(() => {
      this.addSuccess = 'Add';
      this.isClicked = 'primary';
    }, 1500);
  }

  onRemove() {
    this.form.patchValue(
      {
        status: 'DELETED'
      },
    );
    // this.contactExt.ext.status = 'DELETED';
    this.onSave('DELETED');
    this.form.reset();
    this.onReturn();
    this.addSuccess = 'DELETED';
  }

  // contact login
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
  }

  quickSearch() {
    this.gridApi.setQuickFilter(this.form.value.searchValue);
  }

}
