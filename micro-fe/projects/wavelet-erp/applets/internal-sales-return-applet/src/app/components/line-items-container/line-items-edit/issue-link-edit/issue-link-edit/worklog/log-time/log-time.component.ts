import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ViewColumnFacade } from '../../../../../../../facades/view-column.facade';
import { ComponentStore } from '@ngrx/component-store';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';

interface LocalState {
  deactivateReturn: boolean;
  deactivateAdd: boolean;
}

@Component({
  selector: 'app-edit-issue-link-edit-log-time',
  templateUrl: './log-time.component.html',
  styleUrls: ['./log-time.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class EditLineItemIssueLinkEditLogTimeComponent extends ViewColumnComponent {

  protected subs = new SubSink();
  
  protected compName = 'Edit Line Item Log Time'
  protected readonly index = 15;
  protected localState: LocalState;
  protected prevLocalState: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);

  prevIndex: number;
  apiVisa = AppConfig.apiVisa;
  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private viewColFacade: ViewColumnFacade,
    private readonly componentStore: ComponentStore<LocalState>) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.form = this.fb.group({
      activityType: new FormControl(),
      date: new FormControl(),
      duration: new FormControl(),
      description: new FormControl()
    });
  }

  onSubmit() {

  }

  onReturn() {
    this.viewColFacade.updateInstance<LocalState>(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateReturn: false,
    });
      this.viewColFacade.onPrev(this.prevIndex);
  }
  
  ngOnDestroy() {
    this.subs.unsubscribe();  
  }

}
