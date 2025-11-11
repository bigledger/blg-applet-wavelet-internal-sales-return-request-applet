import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComponentStore } from '@ngrx/component-store';
import { MatTabGroup } from '@angular/material/tabs';
import { Observable, zip } from 'rxjs';
import { SubSink } from 'subsink2';
import { Store } from '@ngrx/store';
import { LinkSubjectToTeamService, Pagination } from 'blg-akaun-ts-lib';
import { map } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AkaunMessageDialogComponent } from 'projects/shared-utilities/dialogues/akaun-message-dialog/akaun-message-dialog';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { PermissionFacade } from 'projects/shared-utilities/modules/permission/facades/permission.facade';
import { BranchSettingsSelectors } from '../../../../../../state-controllers/branch-settings-controller/selectors';
import { BranchSettingsStates } from '../../../../../../state-controllers/branch-settings-controller/states';
import { BranchSettingsActions } from '../../../../../../state-controllers/branch-settings-controller/actions';

interface LocalState {
  deactivateReturn: boolean;
  selectedIndex: number;
}

@Component({
  selector: 'app-settlement-edit',
  templateUrl: './settlement-edit.component.html',
  styleUrls: ['./settlement-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class SettlementEditComponent extends ViewColumnComponent {

  @ViewChild(MatTabGroup, {static: true}) matTab: MatTabGroup;

  protected readonly index = 3;
  private localState: LocalState;

  // initialise local states
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.localState.deactivateReturn);
  readonly selectedIndex$ = this.componentStore.select(state => (state.localState.selectedIndex));

  // info. about previous local states
  prevIndex: number;
  private prevLocalState: any;

  // api visa
  apiVisa = AppConfig.apiVisa;

  toggleColumn$: Observable<boolean>;

  // subSink is to ensure all subscribe calls are unsubscribed to once the component is destroyed
  private subSink = new SubSink;

  form: FormGroup;
  formDisabled: boolean = false;

  selectedMember;
  teamGuid: string;
  branch;
  akaunMessageDialogComponentMatDialogRef: MatDialogRef<AkaunMessageDialogComponent>;

  constructor(
    private linkSubjectToTeamService: LinkSubjectToTeamService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private store: Store<BranchSettingsStates>,
    private viewColFacade: PermissionFacade,
    private readonly componentStore: ComponentStore<{localState: LocalState}>
  ) {
    super();
  }

  /**
   * Lifecycle method: Called when the component is first initialised.
   */
  ngOnInit(): void {
    this.subSink.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState({localState: a});
    });
    this.toggleColumn$ = this.viewColFacade.toggleColumn$;
    this.subSink.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subSink.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.subSink.sink = this.store.select(BranchSettingsSelectors.selectGuid).subscribe(b=>{
      this.branch = b;
    })
    this.form = this.fb.group({
      name: [''],

    })
    /* const selectedMethod$ = this.store.select(BranchSettingsSelectors.selectMember);

    this.subSink.sink = selectedMethod$.subscribe(member => {
      this.selectedMember = member;
      this.setForm();
    }) */

  }

  /**
   * Set the details of the form.
   */
   setForm() {
    this.form.patchValue({
      name: this.selectedMember.name
    })
  }


  /**
   * This function is called whe the user clicks on the save button.
   * This will dispatch an NgRx action to update details.
   *
   */
   onSubmit() {

  }

  /**
   * This function is called whe the user clicks on the delete button.
   * This will dispatch an NgRx action to delete the entity.
   *
   */
  onDelete() {
    //this.store.dispatch(BranchSettingsActions.deleteSettlementMethodInit({guid: this.selectedMember.guid.toString()}));
    this.onReturn();
    if(this.branch){
      console.log('get branch settlement',this.branch)
      // this.store.dispatch(PurchaseOrderActions.getBranchSettlementMethodInit({guid:this.branch.bl_fi_mst_branch.guid.toString()}));
    }
  }




  /**
   * Return to the previous drawer/view column.
   */
   onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateReturn: false,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  /**
   * Lifecycle method: Called when this component is destroyed.
   */
  ngOnDestroy() {
    if (this.matTab) {
      this.viewColFacade.updateInstance(this.index, {
        ...this.localState,
        selectedIndex: this.matTab.selectedIndex
      });
    }
    this.subSink.unsubscribe();
  }

}
