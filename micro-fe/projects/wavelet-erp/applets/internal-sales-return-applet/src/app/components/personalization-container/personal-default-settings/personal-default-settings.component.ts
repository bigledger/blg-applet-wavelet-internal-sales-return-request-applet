import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppletContainerModel, BranchContainerModel, GuidDataFieldInterface } from 'blg-akaun-ts-lib';
import { SessionActions } from 'projects/shared-utilities/modules/session/session-controller/actions';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { AppConfig } from 'projects/shared-utilities/visa';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink2';
import { AppletSettings } from '../../../models/applet-settings.model';
import { UserPermInquirySelectors } from 'projects/shared-utilities/modules/permission/user-permissions-inquiry-controller/selectors';
import { PermissionStates } from 'projects/shared-utilities/modules/permission/permission-controller';
import { debounceTime, distinctUntilChanged } from "rxjs/operators";


@Component({
  selector: 'app-personal-default-settings',
  templateUrl: './personal-default-settings.component.html',
  styleUrls: ['./personal-default-settings.component.css'],
})
export class PersonalDefaultSettingsComponent implements OnInit, OnDestroy {

  @Input() appletSettings$: Observable<AppletContainerModel>;

  private subs = new SubSink();

  form: FormGroup;

  apiVisa = AppConfig.apiVisa;
  selectedBranch: GuidDataFieldInterface;
  branchGuids: any[];
  locationGuids: any[];

  selectedDeliveryBranch: GuidDataFieldInterface;
  deliveryBranchGuids: any[];
  deliveryLocationGuids: any[];

  userPermissionTarget$ = this.permissionStore.select(
    UserPermInquirySelectors.selectUserPermInquiry
  );

  constructor(
    private readonly store: Store<SessionStates>,
    protected readonly permissionStore: Store<PermissionStates>,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      DEFAULT_BRANCH: new FormControl(),
      DEFAULT_LOCATION: new FormControl(),
      DEFAULT_TOGGLE_COLUMN: new FormControl(),
      DEFAULT_DELIVERY_BRANCH: new FormControl(),
      DEFAULT_DELIVERY_LOCATION: new FormControl(),
      DEFAULT_ORIENTATION: new FormControl(),
    });
    this.subs.sink = this.store.select(SessionSelectors.selectPersonalSettings).subscribe({
      next: (resolve: AppletSettings) => {
        this.selectedBranch = resolve?.DEFAULT_BRANCH;
        this.form.patchValue({
          DEFAULT_BRANCH: resolve?.DEFAULT_BRANCH,
          DEFAULT_LOCATION: resolve?.DEFAULT_LOCATION,
          DEFAULT_DELIVERY_BRANCH: resolve?.DEFAULT_DELIVERY_BRANCH,
          DEFAULT_DELIVERY_LOCATION: resolve?.DEFAULT_DELIVERY_LOCATION,
          DEFAULT_TOGGLE_COLUMN: resolve?.DEFAULT_TOGGLE_COLUMN,
          DEFAULT_ORIENTATION: resolve?.DEFAULT_ORIENTATION
        });
      }
    });

    this.subs.sink = this.userPermissionTarget$.subscribe((targets) => {
      console.log("targets", targets);
      let target = targets.filter(
        (target) =>
          target.permDfn === "TNT_API_DOC_INTERNAL_SALES_RETURN_REQUEST_READ_TGT_GUID"
      );
      let targetDelivery = targets.filter(
        (targetDelivery) =>
        targetDelivery.permDfn === "TNT_API_DOC_INTERNAL_SALES_RETURN_DELIVERY_BRANCH_READ"
      );
      let adminCreatePermissionTarget = targets.filter(
        (target) => target.permDfn === "TNT_TENANT_ADMIN"
      );
      let ownerCreatePermissionTarget = targets.filter(
        (target) => target.permDfn === "TNT_TENANT_OWNER"
      );
      if(adminCreatePermissionTarget[0]?.hasPermission || ownerCreatePermissionTarget[0]?.hasPermission){
        this.branchGuids = [];
        this.deliveryBranchGuids = [];
      }else{
        this.branchGuids = (target[0]?.target!==null && Object.keys(target[0]?.target || {}).length !== 0) ? target[0]?.target["bl_fi_mst_branch"] : [];
        this.deliveryBranchGuids = (targetDelivery[0]?.target!==null && Object.keys(targetDelivery[0]?.target || {}).length !== 0) ? targetDelivery[0]?.target["bl_fi_mst_branch"] : [];
        this.deliveryBranchGuids = [...this.branchGuids, ...this.deliveryBranchGuids];
      }
    });

    this.subs.sink = this.form.valueChanges
    .pipe(debounceTime(100), distinctUntilChanged())
    .subscribe({
      next: (form) => {
        //console.log(form);
        this.selectedBranch = form.DEFAULT_BRANCH;
        this.selectedDeliveryBranch = form.DEFAULT_DELIVERY_BRANCH;
      },
    });
  }

  onBranchSelected(e: BranchContainerModel) {
    this.selectedBranch = e.bl_fi_mst_branch.guid;
    this.form.patchValue({ DEFAULT_COMPANY: e.bl_fi_mst_branch.comp_guid });
  }

  onDeliveryBranchSelected(e: BranchContainerModel) {
    console.log("Selected Delivery Branch", e);
    this.selectedDeliveryBranch = e.bl_fi_mst_branch.guid;
  }

  onSave() {
    this.store.dispatch(SessionActions.savePersonalSettingsInit({ settings: this.form.value }));
  }

  onReset() {
    this.store.dispatch(
      SessionActions.savePersonalSettingsInit({
        settings: {
          DEFAULT_BRANCH: null,
          DEFAULT_LOCATION: null,
          DEFAULT_DELIVERY_BRANCH: null,
          DEFAULT_DELIVERY_LOCATION: null,
          DEFAULT_COMPANY: null,
          DEFAULT_TOGGLE_COLUMN: null,
          DEFAULT_ORIENTATION: null,
        },
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
