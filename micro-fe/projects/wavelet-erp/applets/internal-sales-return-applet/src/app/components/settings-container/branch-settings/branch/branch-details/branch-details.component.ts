import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CompanyService } from 'blg-akaun-ts-lib';
import * as moment from 'moment';
import { UserTeamModel } from 'projects/shared-utilities/models/team-permissions.model';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { Observable, of, zip } from 'rxjs';
import { SubSink } from 'subsink2';
import { BranchSettingsSelectors } from '../../../../../state-controllers/branch-settings-controller/selectors';
import { BranchSettingsStates } from '../../../../../state-controllers/branch-settings-controller/states';
import { BranchSettingsActions } from '../../../../../state-controllers/branch-settings-controller/actions';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { SessionActions } from 'projects/shared-utilities/modules/session/session-controller/actions';

@Component({
  selector: 'app-branch-details',
  templateUrl: './branch-details.component.html',
  styleUrls: ['./branch-details.component.scss']
})
export class BranchDetailsComponent extends ViewColumnComponent {
  apiVisa = AppConfig.apiVisa;
  form: FormGroup;
  private subSink = new SubSink;

  // flag to indicate whether user can edit or not
  isReadOnly: Observable<boolean>;
  branchGuid: string;
  currentUser: UserTeamModel;

  branch$ = this.store.select(BranchSettingsSelectors.selectBranch);
  showRounding: boolean = false;
  constructor(
    private sessionStore: Store<SessionStates>,
    private companyService: CompanyService,
    private store: Store<BranchSettingsStates>,
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl(),
      code: new FormControl(),
      createdDate: new FormControl(),
      updatedDate: new FormControl(),
      createdBy: new FormControl(),
      updatedBy: new FormControl(),
      company : new FormControl(),
      salesAgent: new FormControl(''),
      rounding_five_cent: new FormControl(''),
      rounding_item_guid: new FormControl(''),
      group_discount_item_guid: new FormControl(''),
    })

    this.subSink.sink = this.branch$
    .subscribe((b:any) => {
      this.branchGuid = b.bl_fi_mst_branch.guid.toString();
      this.form.patchValue({
        name: b.bl_fi_mst_branch.name,
        description: b.bl_fi_mst_branch.descr,
        company:b.bl_fi_mst_branch.comp_guid,
        salesAgent:b.bl_fi_mst_branch.default_sales_entity_hdr_guid,
        code: b.bl_fi_mst_branch.code,
        createdDate: b.bl_fi_mst_branch.date_created ? moment(b.bl_fi_mst_branch.date_created).format('YYYY-MM-DD HH:MM:ss') : "Data not available...",
        updatedDate: b.bl_fi_mst_branch.date_updated ? moment(b.bl_fi_mst_branch.date_updated).format('YYYY-MM-DD HH:MM:ss'): "Data not available...",
        createdBy: b.created_by_name ? b.created_by_name : "Data not available...",
        updatedBy: b.updated_by_name ? b.updated_by_name : "Data not available...",
        rounding_five_cent: b.bl_fi_mst_branch.rounding_five_cent,
        rounding_item_guid: b.bl_fi_mst_branch.rounding_item_guid,
        group_discount_item_guid: b.bl_fi_mst_branch.group_discount_item_guid,
      });
      if( b.bl_fi_mst_branch.rounding_five_cent){
        this.showRounding = true;
      }
      this.companyService.getByGuid(b.bl_fi_mst_branch.comp_guid.toString(),this.apiVisa).subscribe((resp) => {
        this.form.patchValue({
          company : resp.data.bl_fi_mst_comp.name,
        });
      });
    })
  }

  enableRounding() {
    this.showRounding = !this.showRounding;
  }

  onSubmit(){
    this.store.dispatch(BranchSettingsActions.updateBranchDetails({guid: this.branchGuid, form: this.form}));
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }

  onAutoMTO(e){
      // Create a dynamic form control
      const dynamicControlName = this.getDynamicControlName();
      this.form.addControl(dynamicControlName, new FormControl());
          this.subSink.sink = this.sessionStore.select(SessionSelectors.selectMasterSettings).subscribe({next: (resolve: any) => {
            const resolvedValue = resolve ? resolve[dynamicControlName] : null;
            console.log('resolvedValue',resolvedValue)
            this.form.get(dynamicControlName).patchValue(resolvedValue);
          }});
          console.log(this.form.value)
          this.sessionStore.dispatch(SessionActions.saveMasterSettingsInit({settings: this.form.value.dynamicControlName}));
  }

  getDynamicControlName(): string {
    return `AUTO_APPLY_MTO_BRANCH_${this.branchGuid}`;
  }

}