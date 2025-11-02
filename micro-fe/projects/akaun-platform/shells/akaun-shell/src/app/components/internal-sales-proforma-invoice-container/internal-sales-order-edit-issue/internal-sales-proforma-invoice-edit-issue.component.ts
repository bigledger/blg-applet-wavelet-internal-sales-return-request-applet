import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../facades/view-column.facade';
import { DraftStates } from '../../../state-controllers/draft-controller/store/states';

interface LocalState {
  deactivateReturn: boolean;
  selectedIndex: number;
}
@Component({
  selector: 'app-internal-sales-proforma-invoice-edit-issue',
  templateUrl: './internal-sales-proforma-invoice-edit-issue.component.html',
  styleUrls: ['./internal-sales-proforma-invoice-edit-issue.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class InternalSalesProformaInvoiceEditIssueComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Edit Issue';
  protected index = 13;
  protected localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);
  readonly selectedIndex$ = this.componentStore.select(state => state.selectedIndex);

  prevIndex: number;
  protected prevLocalState: any;

  // form: FormGroup;

  // leftColControls = [
  //   {label: 'Project', formControl: 'project', type: 'text', readonly: true, hint: ''},
  //   {label: 'Issue Number', formControl: 'issueNumber', type: 'text', readonly: true, hint: ''},
  //   {label: 'Issue Type', formControl: 'issueType', type: 'select', readonly: false, hint: ''},
  //   {label: 'Assignee', formControl: 'assignee', type: 'select', readonly: false, hint: ''},
  //   {label: 'Reporter', formControl: 'reporter', type: 'select', readonly: false, hint: ''},
  //   {label: 'Summary', formControl: 'summary', type: 'select', readonly: false, hint: ''},
  // ];

  @ViewChild(MatTabGroup) matTab: MatTabGroup;

  constructor(
    private viewColFacade: ViewColumnFacade,
    private readonly draftStore: Store<DraftStates>,
    private readonly componentStore: ComponentStore<LocalState>
  ) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.subs.sink = this.localState$.subscribe( a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    // this.form = new FormGroup({
    //   project: new FormControl(),
    //   issueNumber: new FormControl(),
    //   issueType: new FormControl(),
    //   assignee: new FormControl(),
    //   reporter: new FormControl(),
    //   summary: new FormControl(),
    // })
  }

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateIssueLink: false,
      deactivateReturn: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
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