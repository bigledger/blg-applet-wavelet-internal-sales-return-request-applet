import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { PrintableFormatStates } from 'projects/wavelet-erp/applets/internal-sales-invoice-applet/src/app/state-controllers/printable-format-controller/store/states';
import { PrintableFormatActions } from 'projects/wavelet-erp/applets/internal-sales-invoice-applet/src/app/state-controllers/printable-format-controller/store/actions';
import { ReasonSettingActions } from '../../../../state-controllers/reason-settings-controller/store/actions';
import { ReasonSettingSelectors } from '../../../../state-controllers/reason-settings-controller/store/selectors';
import { ReasonSettingStates } from '../../../../state-controllers/reason-settings-controller/store/states';



interface LocalState {
  deactivateAdd: boolean;
  deactivateReturn: boolean;
  selectedIndex: number;
  deleteConfirmation: boolean;
}

@Component({
  selector: 'app-reason-settings-edit',
  templateUrl: './reason-settings-edit.component.html',
  styleUrls: ['./reason-settings-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})

export class ReasonSettingsEditComponent extends ViewColumnComponent {

  private subSink = new SubSink;

  protected compName = 'Create Reason Settings';
  protected index = 1;
  protected localState: LocalState;
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);

  protected prevLocalState: any;

  reasonGuid: string = null;

  form: FormGroup;
  @ViewChild(MatTabGroup) matTab: MatTabGroup;
 
  constructor(
    protected viewColFacade: ViewColumnFacade,
    private readonly store: Store<ReasonSettingStates>,
    protected readonly componentStore: ComponentStore<LocalState>
    ) {
    super();
  }

  ngOnInit() {
   // this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
   this.subSink.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.subSink.sink = this.localState$.subscribe( a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.form = new FormGroup({
        reasonCode: new FormControl(),
        reasonName: new FormControl(),
    })
    
    this.subSink.sink = this.store.select(ReasonSettingSelectors.selectReasonSetting).subscribe(
      (data) => {
        this.reasonGuid = data.bl_svc_return_reason.guid.toString();
        this.form.controls['reasonCode'].patchValue(data.bl_svc_return_reason.reason_code);
        this.form.controls['reasonName'].patchValue(data.bl_svc_return_reason.reason_name);
      },
      (err) => {
          console.error("ReasonSettingSelectors.selectReasonSetting", err);
      }
    );
  }

  onReturn(){
    this.viewColFacade.updateInstance(0, {
      ...this.prevLocalState,
      deactivateReturn: false,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(0);
  }

  onSave(){
    this.store.dispatch(ReasonSettingActions.updateReasonSettingInit({guid: this.reasonGuid, reasonSetting: this.form}));
   
  }

  
  onDelete(){
    this.store.dispatch(ReasonSettingActions.deleteReasonSettingInit({guid: this.reasonGuid}));
  
  }
  
}
