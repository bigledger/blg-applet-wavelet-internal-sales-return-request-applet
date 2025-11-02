import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ViewColumnFacade } from '../../../../../../facades/view-column.facade';
import { ComponentStore } from '@ngrx/component-store';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { MatTabGroup } from '@angular/material/tabs';

interface LocalState {
  deactivateReturn: boolean;
  deactivateAdd: boolean;
  selectedIndex: number;
}

@Component({
  selector: 'app-line-item-issue-link-edit',
  templateUrl: './issue-link-edit.component.html',
  styleUrls: ['./issue-link-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class LineItemIssueLinkEditComponent extends ViewColumnComponent {

  protected subs = new SubSink();
  
  protected compName = 'Edit Issue';
  protected readonly index = 12;
  protected localState: LocalState;
  protected prevLocalState: any;
 
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);
  readonly selectedIndex$ = this.componentStore.select(state => (state.selectedIndex));

  prevIndex: number;
  apiVisa = AppConfig.apiVisa;
  public form: FormGroup;

  @ViewChild(MatTabGroup) matTab: MatTabGroup;

  constructor(
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
    this.form = new FormGroup({
      issueNumber: new FormControl(),
      summary: new FormControl(),
    });
  }

  onSave() {

  }

  goToLogTime() {
    if (!this.localState.deactivateAdd) {
      this.viewColFacade.updateInstance(this.index, {
        ...this.localState, deactivateReturn: true, deactivateAdd: true
      });
      this.viewColFacade.onNextAndReset(this.index, 13);
    }
  }

  onReturn() {
    this.viewColFacade.updateInstance<LocalState>(this.prevIndex, {
      ...this.prevLocalState, deactivateReturn: false, deactivateIssueLinkList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }
  
  ngOnDestroy() {
    if (this.matTab) {
      this.viewColFacade.updateInstance<LocalState>(this.index, {
        ...this.localState, selectedIndex: this.matTab.selectedIndex,
      });
    }
    this.subs.unsubscribe();  
  }

}