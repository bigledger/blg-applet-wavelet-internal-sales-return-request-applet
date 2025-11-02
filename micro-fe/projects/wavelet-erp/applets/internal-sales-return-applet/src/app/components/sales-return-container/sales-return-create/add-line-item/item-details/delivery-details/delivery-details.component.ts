import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BranchContainerModel, BranchService, GuidDataFieldInterface, LocationContainerModel, LocationService, RegionHdrService, bl_alg_cc_agent_ext_RowClass } from 'blg-akaun-ts-lib';
import { PermissionStates } from 'projects/shared-utilities/modules/permission/permission-controller';
import { UserPermInquirySelectors } from 'projects/shared-utilities/modules/permission/user-permissions-inquiry-controller/selectors';
import { AppConfig } from 'projects/shared-utilities/visa';
import { InternalSalesReturnSelectors } from '../../../../../../state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnStates } from '../../../../../../state-controllers/internal-sales-return-controller/store/states';
import { Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { SubSink } from 'subsink2';

export class BasicView {
  state;
  reg_code;
  guid;
  status;
}
@Component({
  selector: 'app-item-details-delivery-details',
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.scss']
})
export class ItemDetailsDeliveryDetailsComponent implements OnInit {
  @Input() editMode: boolean;

  lineItem$ = this.store.select(InternalSalesReturnSelectors.selectLineItem);
  @Input() credits$: Observable<{
    creditTerms: bl_alg_cc_agent_ext_RowClass[];
    creditLimit: bl_alg_cc_agent_ext_RowClass[];
  }>;
  userPermissionTarget$ = this.permissionStore.select(
    UserPermInquirySelectors.selectUserPermInquiry
  );

  @Output() customer = new EventEmitter();
  @Output() member = new EventEmitter();
  @Output() shippingInfo = new EventEmitter();
  @Output() billingInfo = new EventEmitter();
  @Output() updateMain = new EventEmitter();

  apiVisa = AppConfig.apiVisa;
  selectedBranch: GuidDataFieldInterface;
  selectedLocation: GuidDataFieldInterface;
  selectedCompany: GuidDataFieldInterface;
  selectedMember: GuidDataFieldInterface;
  postingStatus: boolean = false;
  arrayRegion: Array<BasicView> = [];
  selectedRegionList;
  branchGuids: any[];
  deliveryBranchGuids: any[];

  private subs = new SubSink();
  entity$ = this.store.select(InternalSalesReturnSelectors.selectEntity);

  form: FormGroup;

  leftColControls = [
    {
      label: "Require Delivery",
      formControl: "requireDelivery",
      type: "reqDelivery",
      readonly: false,
    },
    {
      label: "Delivery Region Code",
      formControl: "regionList",
      type: "regionCode",
      readonly: false,
    },
    {
      label: "Delivery Logic",
      formControl: "deliveryLogic",
      type: "text",
      readonly: false,
    },
    {
      label: "Planned Delivery Date",
      formControl: "planDeliveryDate",
      type: "date",
      readonly: false,
    },
    {
      label: "Actual Delivery Date",
      formControl: "actualDeliveryDate",
      type: "date",
      readonly: false,
    },
    {
      label: "Delivery PIC Contact",
      formControl: "picContact",
      type: "text",
      readonly: false,
    },
  ];

  rightColControls = [
    {
      label: "Delivery Status",
      formControl: "deliveryStatus",
      type: "text",
      readonly: false,
    },
    {
      label: "Delivery Region Status",
      formControl: "regionStatus",
      type: "text",
      readonly: false,
    },
    {
      label: "Delivery Id",
      formControl: "deliveryId",
      type: "text",
      readonly: false,
    },
    {
      label: "Estimate Delivery Date",
      formControl: "estimateDeliveryDate",
      type: "date",
      readonly: false,
    },
    {
      label: "Delivery PIC Name",
      formControl: "picName",
      type: "text",
      readonly: false,
    },
    {
      label: "Requested Delivery Date",
      formControl: "requestedDeliveryDate",
      type: "date",
      readonly: false,
    },
  ];

  creditLimitList = [];
  creditTermsList = [];
  selectedDeliveryBranch: GuidDataFieldInterface;

  constructor(
    protected readonly store: Store<InternalSalesReturnStates>,
    private regionHdrService: RegionHdrService,
    protected readonly permissionStore: Store<PermissionStates>,
    private branchService: BranchService,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      requireDelivery: new FormControl(),
      regionList: new FormControl(),
      regionGuid: new FormControl(),
      regionCode: new FormControl(),
      regionState: new FormControl(),
      deliveryLogic: new FormControl(),
      planDeliveryDate: new FormControl(),
      actualDeliveryDate: new FormControl(),
      picContact: new FormControl(),
      deliveryStatus: new FormControl(),
      regionStatus: new FormControl(),
      deliveryId: new FormControl(),
      estimateDeliveryDate: new FormControl(),
      requestedDeliveryDate: new FormControl(),
      picName: new FormControl(),
      remarks: new FormControl(),
      deliveryBranch: new FormControl(),
      deliveryLocation: new FormControl(),
      deliveryBranchCode: new FormControl(),
      deliveryLocationCode: new FormControl(),
    });
    this.subs.sink = this.lineItem$
      .pipe(
        withLatestFrom(this.store.select(InternalSalesReturnSelectors.selectSalesReturn))
      )
      .subscribe(async ([a, c]) => {
        console.log("c:: ", c);
        if (c) {
          if (
            c.bl_fi_generic_doc_hdr.posting_status === "FINAL" ||
            (c.bl_fi_generic_doc_hdr.status !== "ACTIVE" &&
              c.bl_fi_generic_doc_hdr.status !== null)
          ) {
            this.postingStatus = true;
          } else {
            this.postingStatus = false;
          }
        }
        await this.getRegionCode();
        this.selectedRegionList = this.arrayRegion.find(
          (x) => x.guid === a.del_region_hdr_guid
        );
        this.selectedDeliveryBranch = a.delivery_branch_guid;
        console.log("selectRegion:: ", this.selectedRegionList?.status);
        this.form.patchValue({
          requireDelivery: a.delivery_required,
          regionGuid: this.selectedRegionList?.guid ?? "",
          regionCode: this.selectedRegionList?.reg_code ?? "",
          regionState: this.selectedRegionList?.state ?? "",
          regionStatus: this.selectedRegionList?.status ?? "",
          planDeliveryDate: a.track_delivery_time_planned,
          actualDeliveryDate: a.track_delivery_time_actual,
          estimateDeliveryDate: a.track_delivery_time_estimated,
          requestedDeliveryDate: a.track_delivery_date_requested,
          picName: a.track_delivery_pic_name,
          picContact: a.track_delivery_pic_contact,
          deliveryStatus: a.track_delivery_status,
          deliveryLogic: a.track_delivery_logic,
          deliveryId: a.track_delivery_id,
          remarks: a.track_delivery_remarks,
          deliveryBranch: a.delivery_branch_guid,
          deliveryLocation: a.delivery_location_guid,
          deliveryBranchCode: a.delivery_branch_code,
          deliveryLocationCode: a.delivery_location_code,
        });
      });

    this.subs.sink = this.userPermissionTarget$.subscribe((targets) => {
      console.log("targets", targets);
      let tempBranch: any[];
      let target = targets.filter(
        (target) =>
          target.permDfn ===
          "TNT_API_DOC_INTERNAL_SALES_RETURN_READ_TGT_GUID"
      );
      let targetDelivery = targets.filter(
        (targetDelivery) =>
        targetDelivery.permDfn === "TNT_API_DOC_INTERNAL_SALES_RETURN_DELIVERY_BRANCH_READ"
      );
      tempBranch =
        target[0]?.target !== null &&
        Object.keys(target[0]?.target || {}).length !== 0
          ? target[0]?.target["bl_fi_mst_branch"]
          : [];
      this.deliveryBranchGuids = (targetDelivery[0]?.target!==null && Object.keys(targetDelivery[0]?.target || {}).length !== 0) ? targetDelivery[0]?.target["bl_fi_mst_branch"] : [];
      this.branchGuids = [...this.deliveryBranchGuids, ...tempBranch];
    });
  }

  async getRegionCode() {
    this.arrayRegion = [];
    let regionData = await this.regionHdrService.getPromise(this.apiVisa);
    if (regionData.data) {
      regionData.data.forEach((dataRegion) => {
        const tempData = new BasicView();
        tempData.guid = dataRegion.bl_del_region_hdr.guid;
        tempData.reg_code = dataRegion.bl_del_region_hdr.region_code;
        tempData.state = dataRegion.bl_del_region_hdr.state;
        tempData.status = dataRegion.bl_del_region_hdr.status;
        this.arrayRegion.push(tempData);
      });

      console.log("regionData:: ", this.arrayRegion);
    }
  }

  async onDeliveryBranchSelected(e: BranchContainerModel) {
    this.selectedDeliveryBranch = e.bl_fi_mst_branch.guid;
    this.subs.sink = await this.branchService
      .getByGuid(e.bl_fi_mst_branch.guid.toString(), AppConfig.apiVisa)
      .subscribe((data) => {
        this.form.patchValue({
          deliveryBranchCode: data.data.bl_fi_mst_branch.code,
        });
      });
    this.updateMain.emit(this.form.value);
  }

  async onDeliveryLocationSelected(e: LocationContainerModel) {
    this.subs.sink = await this.locationService
      .getByGuid(e.bl_inv_mst_location.guid.toString(), AppConfig.apiVisa)
      .subscribe((data) => {
        this.form.patchValue({
          deliveryLocationCode: data.data.bl_inv_mst_location.code,
        });
      });
    this.updateMain.emit(this.form.value);
  }

  test(e) {
    console.log("e:: ", e);
    this.selectedRegionList = e;
    this.form.controls["regionCode"].setValue(e.reg_code);
    this.form.controls["regionGuid"].setValue(e.guid);
    this.form.controls["regionState"].setValue(e.state);
    this.form.controls["regionStatus"].setValue(e.status);
    this.updateMain.emit(this.form.value);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
