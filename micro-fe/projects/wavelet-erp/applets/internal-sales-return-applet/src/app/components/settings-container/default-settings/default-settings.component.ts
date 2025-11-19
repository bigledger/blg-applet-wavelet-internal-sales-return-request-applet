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
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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

  detailsTabs = [
    { title: 'Search', content: 'search'},
    { title: 'Main Details', content: 'main-details'},
    { title: 'E-Invoice', content: 'e-invoice' },
    { title: 'Account', content: 'account'},
    { title: 'Lines', content: 'lines'},
    { title: 'ARAP', content: 'arap'},
    { title: 'Delivery Details', content: 'delivery-details'},
    { title: 'Payment', content: 'payment'},
    { title: 'Payment Adjustment', content: 'payment-adjustment'},
    { title: 'Department Hdr', content: 'department-hdr'},
    { title: 'TraceDocument', content: 'trace-document'},
    { title: 'Contra', content: 'contra'},
    { title: 'Doc Link', content: 'doc-link'},
    { title: 'Attachments', content: 'attachments'},
    { title: 'Export', content: 'export'}
  ];
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
      if (resolve?.SALES_RETURN_DETAILS_TAB_ORDER) {
          // Merge saved tab order with any new tabs that might have been added
          const savedTabContents = new Set(resolve.SALES_RETURN_DETAILS_TAB_ORDER.map(tab => tab.content));

          // Create a map of current tabs by content for quick lookup
          const currentTabsMap = new Map(this.detailsTabs.map(tab => [tab.content, tab]));

          // Get saved tabs that still exist (using current tab data for updated titles)
          const savedTabs = resolve.SALES_RETURN_DETAILS_TAB_ORDER
            .map(savedTab => currentTabsMap.get(savedTab.content))
            .filter(Boolean); // Remove any that no longer exist

          // Find new tabs that aren't in the saved configuration
          const newTabs = this.detailsTabs.filter(tab => !savedTabContents.has(tab.content));

          // Combine saved tabs with new tabs (new tabs added at the end)
          this.detailsTabs = [...savedTabs, ...newTabs];
        }
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
    const payload = {
      ...this.form.value,
      SALES_RETURN_DETAILS_TAB_ORDER: this.detailsTabs,
    }
    this.store.dispatch(SessionActions.saveMasterSettingsInit({ settings: payload }));
  }

  onReset() {
    this.store.dispatch(
      SessionActions.saveMasterSettingsInit({
        settings: {
          DEFAULT_BRANCH: null,
          DEFAULT_LOCATION: null,
          DEFAULT_COMPANY: null,
          SALES_RETURN_DETAILS_TAB_ORDER: this.detailsTabs,
        },
      })
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.detailsTabs, event.previousIndex, event.currentIndex);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
