import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiResponseModel, bl_fi_mst_entity_ext_RowClass, bl_fi_mst_entity_line_RowClass, BranchService, EntityLoginSubjectLinkContainerModel, EntityLoginSubjectLinkService, Pagination, SettlementMethodContainerModel, } from 'blg-akaun-ts-lib';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppConfig } from 'projects/shared-utilities/visa';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { SubSink } from 'subsink2';
import { map } from 'rxjs/operators';
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
  selector: 'app-branch-edit',
  templateUrl: './branch-edit.component.html',
  styleUrls: ['./branch-edit.component.css']
})
export class EditBranchComponent extends ViewColumnComponent implements OnInit, OnDestroy {
  @Input() customerExt$: Observable<any>;
  form: FormGroup;
  formProperty: FormGroup;
  @Input() customerExtLineItem$: Observable<bl_fi_mst_entity_line_RowClass>;

  status = [
    { value: 'ACTIVE', viewValue: 'ACTIVE' },
    { value: 'INACTIVE', viewValue: 'INACTIVE' }
  ];
  // @Input() customerExtLineItem$: Observable<bl_fi_mst_entity_line_RowClass>;
  protected readonly index = 10;
  prevIndex: number;
  private prevLocalState: any;
  private localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);

  newSettlement: SettlementMethodContainerModel[];
  settlementList: SettlementMethodContainerModel[];
  settlementListguid;
  settlementArr: any;
  settlementGuid: any;
  settlementName: any;
  settlementArr1: any = [];
  apiVisa = AppConfig.apiVisa;
  paging = new Pagination();

  branchLine: any;
  gridApi: any;
  rowData: any[];
  lineData = new bl_fi_mst_entity_line_RowClass();

  // defaultColDef = {
  //   filter: 'agTextColumnFilter',
  //   floatingFilterComponentParams: { suppressFilterButton: true },
  //   minWidth: 200,
  //   flex: 2,
  //   sortable: true,
  //   resizable: true,
  //   suppressCsvExport: true,
  //   cellStyle: { textAlign: "left" },
  // };
  // columnsDefs;
  guid: any;
  addSuccess = 'Update';
  isClicked = 'primary';
  protected subs = new SubSink();

  constructor(private fb: FormBuilder,
    private readonly store: Store<CustomerStates>,
    private viewColFacade: ViewColumnFacade,
    private _entityLoginSubjectLinkService: EntityLoginSubjectLinkService,
    private branchService: BranchService
  ) {
    super();
    // const customComparator = (valueA, valueB) => {
    //   if (valueA != null && '' !== valueA && valueB != null && '' !== valueB) {
    //     return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
    //   }
    // };
    // this.columnsDefs = [
    //   {
    //     headerName: 'User Email', field: 'bl_fi_mst_entity_login_subject_link.subject_guid',
    //     comparator: customComparator, suppressSizeToFit: true
    //   },
    //   {
    //     headerName: 'Rank', field: 'bl_fi_mst_entity_login_subject_link.rank',
    //     suppressSizeToFit: true, sort: 'desc', comparator: customComparator,
    //   },
    //   {
    //     headerName: 'Status', field: 'bl_fi_mst_entity_login_subject_link.status',
    //     comparator: customComparator, suppressSizeToFit: true
    //   },
    //   {
    //     headerName: 'Modified Date', field: 'bl_fi_mst_entity_login_subject_link.entity_hdr_guid',
    //     comparator: customComparator, suppressSizeToFit: true
    //   },
    // ];
  }

  ngOnInit() {
    this.form = this.fb.group({
      branch_name: ['', Validators.required],
      branch_code: ['', Validators.required],
      status: [''],
      guid: [''],
    });
    this.form.disable();

    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.customerExt$ = this.store.select(CustomerSelectors.selectExt);
    this.subs.sink = this.customerExt$.subscribe(
      data => {
        console.log(data, 'thisafata');
        this.branchLine = data;
        // this.getLogin(data[0].ext.guid);
        this.guid = data[0].ref_1;
        this.lineData = data[0];
      }
    )

    this.subs.sink = this.branchService.getByGuid(this.guid, AppConfig.apiVisa)
      .subscribe(resolved => {
        console.log("branchData: ", resolved)
        console.log("lineData: ", this.lineData)
        this.form.patchValue(
          {
            branch_name: resolved.data.bl_fi_mst_branch.name,
            branch_code: resolved.data.bl_fi_mst_branch.code,
            status: this.lineData.status
          },
        );
      })
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

  onSave() {
    // let date = new Date();
    // const newBranchLine = new bl_fi_mst_entity_line_RowClass();
    // newBranchLine.name = this.form.value.branch_name;
    // newBranchLine.code = this.form.value.branch_code;
    // newBranchLine.phone = this.form.value.phone;
    // newBranchLine.email = this.form.value.email;
    // newBranchLine.status = this.form.value.status;
    // this.formProperty = this.fb.group({
    //   fax_no: this.form.value.fax_no,
    //   description: this.form.value.description
    // });
    // newBranchLine.property_json = this.formProperty.value;
    // newBranchLine.guid = this.form.value.guid;
    // newBranchLine.updated_date = date;
    // this.branchLine = newBranchLine;
    // console.log('this is onsave', this.form.value.guid);
    console.log(this.branchLine, 'this.branchLine.ext');

    this.store.dispatch(CustomerActions.editBranchLine({ guid: this.form.value.guid, ext: this.branchLine }));
    // this.addSuccess = 'Success';
    // this.isClicked = 'buttonSuccess';
    // setTimeout(() => {
    //   this.addSuccess = 'Update';
    //   this.isClicked = 'primary';
    // }, 1500)
  }
  onRemove() {
    this.form.patchValue(
      {
        status: 'DELETED'
      },
    );
    this.branchLine[0].status = 'DELETED';
    console.log(this.branchLine, " status");
    this.onSave();
    this.form.reset();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }


}
