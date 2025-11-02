import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BranchContainerModel, GuidDataFieldInterface, LocationContainerModel } from 'blg-akaun-ts-lib';
import { SessionActions } from 'projects/shared-utilities/modules/session/session-controller/actions';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';
import { AppletSettings } from '../../../models/applet-settings.model';
import { InternalSalesReturnSelectors } from '../../../state-controllers/internal-sales-return-controller/store/selectors';
// import { AppletSettings } from '../../../models/applet-settings.model';

@Component({
  selector: 'app-default-settings',
  templateUrl: './default-settings.component.html',
  styleUrls: ['./default-settings.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultSettingsComponent implements OnInit, OnDestroy {

  private subs = new SubSink();

  form: FormGroup;

  apiVisa = AppConfig.apiVisa;
  selectedBranch: GuidDataFieldInterface;

  constructor(
    private readonly store: Store<SessionStates>,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      DEFAULT_BRANCH: new FormControl(),
      DEFAULT_LOCATION: new FormControl(),
      DEFAULT_COMPANY: new FormControl(),
    });
    this.subs.sink = this.store.select(SessionSelectors.selectMasterSettings).subscribe({
      next: (resolve: AppletSettings) => {
        this.form.patchValue({
          DEFAULT_BRANCH: resolve?.DEFAULT_BRANCH,
          DEFAULT_LOCATION: resolve?.DEFAULT_LOCATION,
          DEFAULT_COMPANY: resolve?.DEFAULT_COMPANY
        });
        this.subs.sink = this.store
      .select(SessionSelectors.selectMasterSettings)
      .subscribe({
        next: (resolve: AppletSettings) => {
          this.form.patchValue({
            DEFAULT_BRANCH: resolve?.DEFAULT_BRANCH,
            DEFAULT_LOCATION: resolve?.DEFAULT_LOCATION,
            DEFAULT_COMPANY: resolve?.DEFAULT_COMPANY,
          });
        },
      });
      }
    });
  }

  onBranchSelected(e: BranchContainerModel) {
    this.selectedBranch = e.bl_fi_mst_branch.guid;
    this.form.patchValue({ DEFAULT_COMPANY: e.bl_fi_mst_branch.comp_guid });
    if (e.bl_fi_mst_branch_ext.find((x) => x.param_code === "MAIN_LOCATION")) {
      console.log("main location:: ",e.bl_fi_mst_branch_ext.find((x) => x.param_code === "MAIN_LOCATION")?.value_string);
      this.form.controls["DEFAULT_LOCATION"].setValue(
        e.bl_fi_mst_branch_ext.find((x) => x.param_code === "MAIN_LOCATION")?.value_string
      );
    }
  }

  onSave() {
    this.store.dispatch(
      SessionActions.saveMasterSettingsInit({ settings: this.form.value })
    );
  }

  onReset() {
    this.store.dispatch(
      SessionActions.saveMasterSettingsInit({
        settings: {
          DEFAULT_BRANCH: null,
          DEFAULT_LOCATION: null,
          DEFAULT_COMPANY: null,
        },
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
