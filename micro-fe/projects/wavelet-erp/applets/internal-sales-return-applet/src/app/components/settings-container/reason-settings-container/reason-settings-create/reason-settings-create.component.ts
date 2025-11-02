import { T } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { ServiceReturnReasonContainerModel } from 'blg-akaun-ts-lib';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { Attachment } from '../../../../models/attachment.model';
import { ReasonSettingActions } from '../../../../state-controllers/reason-settings-controller/store/actions';
import { ReasonSettingStates } from '../../../../state-controllers/reason-settings-controller/store/states';

interface LocalState {
  deactivateReturn: boolean;
}

@Component({
  selector: 'app-reason-settings-create',
  templateUrl: './reason-settings-create.component.html',
  styleUrls: ['./reason-settings-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [ComponentStore]
})
export class ReasonSettingsCreateComponent extends ViewColumnComponent {

  protected subSink = new SubSink();

  protected compName = 'Create Reason Setting';
  protected readonly index = 1;
  protected localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);

  prevIndex: number;
  protected prevLocalState: any;

  public form: FormGroup;

  constructor(
    private viewColFacade: ViewColumnFacade,
    private readonly componentStore: ComponentStore<LocalState>,
    protected readonly store: Store<ReasonSettingStates>) {
    super();
  }

  ngOnInit() {
    this.subSink.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subSink.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.subSink.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });

    this.form = new FormGroup({
      reasonCode: new FormControl('', Validators.required),
      reasonName: new FormControl('', Validators.required)
    });

  }

  onSave(){
    console.log(this.form.value)
    const reasonContainer = new ServiceReturnReasonContainerModel();
    reasonContainer.bl_svc_return_reason.reason_code = this.form.controls['reasonCode'].value;
    reasonContainer.bl_svc_return_reason.reason_name = this.form.controls['reasonName'].value;
    this.store.dispatch(ReasonSettingActions.createReasonSettingInit({
      reasonSetting: reasonContainer
    }));
    this.onReturn()
  }

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateReturn: false,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }

}
