import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { ComponentStore } from '@ngrx/component-store';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../../facades/view-column.facade';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { Store } from '@ngrx/store';

interface LocalState {
  deactivateReturn: boolean;
  deactivateAdd: boolean;
  selectedIndex: number;
}

@Component({
  selector: 'app-edit-line-item-issue-link-edit',
  templateUrl: './issue-link-edit.component.html',
  styleUrls: ['./issue-link-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class EditLineItemIssueLinkEditComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Edit Line Item Edit Issue';
  protected readonly index = 2;
  protected localState: LocalState;
  protected prevLocalState: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);
  readonly selectedIndex$ = this.componentStore.select(state => (state.selectedIndex));

  appletSettings$ = combineLatest([
    this.sessionStore.select(SessionSelectors.selectMasterSettings),
    this.sessionStore.select(SessionSelectors.selectPersonalSettings)
  ]).pipe(map(([a, b]) => ({...a, ...b})));

  prevIndex: number;
  apiVisa = AppConfig.apiVisa;
  public form: FormGroup;
  appletSettings;
  orientation: boolean = false;

  @ViewChild(MatTabGroup) matTab: MatTabGroup;

  constructor(
    private viewColFacade: ViewColumnFacade,
    private readonly componentStore: ComponentStore<LocalState>,
    private readonly sessionStore: Store<SessionStates>) {
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

    this.subs.sink = this.appletSettings$.subscribe(resolve => {
      this.appletSettings = resolve ;
    }); 
  }

  onSave() {

  }

  goToLogTime() {
    if (!this.localState.deactivateAdd) {
      this.viewColFacade.updateInstance(this.index, {
        ...this.localState, deactivateReturn: true, deactivateAdd: true
      });
      this.viewColFacade.onNextAndReset(this.index, 3);
    }
  }

  onReturn() {
    this.viewColFacade.updateInstance<LocalState>(this.prevIndex, {
      ...this.prevLocalState, deactivateReturn: false, deactivateIssueLinkList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  showPanels(): boolean {
    if(this.appletSettings?.VERTICAL_ORIENTATION){
      if(this.appletSettings?.DEFAULT_ORIENTATION === 'HORIZONTAL'){
        this.orientation = false;
      } else {
        this.orientation = true;
      }
    } else {
      if(this.appletSettings?.DEFAULT_ORIENTATION === 'VERTICAL'){
        this.orientation = true;
      } else {
        this.orientation = false;
      }
    }
    return this.orientation;
  }

  ngOnDestroy() {
    if (this.matTab) {
      this.viewColFacade.updateInstance<LocalState>(this.index, {
        ...this.localState,
        selectedIndex: this.matTab.selectedIndex,
      });
    }
    this.subs.unsubscribe();
  }

}