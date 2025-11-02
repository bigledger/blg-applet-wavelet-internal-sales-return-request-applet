import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { PermissionFacade } from 'projects/shared-utilities/modules/permission/facades/permission.facade';
import { UserTeamModel } from 'projects/shared-utilities/models/team-permissions.model';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';
import { BranchSettingsStates } from '../../../../state-controllers/branch-settings-controller/states';
import { BranchSettingsActions } from '../../../../state-controllers/branch-settings-controller/actions';
import { BranchSettingsSelectors } from '../../../../state-controllers/branch-settings-controller/selectors';

interface LocalState {
  deactivateReturn: boolean;
  selectedIndex: number;
  deactivateAdd: boolean;
  deactivateList: boolean;
}

@Component({
  selector: 'app-branch-edit',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class BranchEditComponent extends ViewColumnComponent {

  @ViewChild(MatTabGroup, {static: true}) matTab: MatTabGroup;

  protected readonly index = 1;
  private localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.localState.deactivateReturn);
  readonly selectedIndex$ = this.componentStore.select(state => (state.localState.selectedIndex));

  prevIndex: number;
  private prevLocalState: any;

  apiVisa = AppConfig.apiVisa;

  public form: FormGroup;

  // keep track of tabs
  currentIndexTab: number;
  // keep track of form being enabled/disabled
  formDisabled: boolean = false;

  // selected team guid
  branchGuid: string;
  currentUser: UserTeamModel;

  private subSink = new SubSink;

  constructor(
    private fb: FormBuilder,
    private store: Store<BranchSettingsStates>,
    private viewColFacade: PermissionFacade,
    private readonly componentStore: ComponentStore<{localState: LocalState}>
  ) {
    super();
  }

  /**
   * Lifecycle method: Called when component is first initialised.
   */
  ngOnInit(): void {
    this.subSink.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState({localState: a});
    });

    this.subSink.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subSink.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);

    // initialise a new form
    this.form = this.fb.group({
      detailsForm: this.fb.group({
        name: ['', Validators.required],
        description: [''],

        // uneditable
        code: [''],
        createdDate: [''],
        updatedDate: [''],
        createdBy: [''],
        updatedBy: ['']
      })
    });

   
    // get currently selected index and disable form if necessary
    this.subSink.sink = this.localState$.subscribe(x => {
      this.currentIndexTab = x.selectedIndex;
      this.formDisabled = this.currentIndexTab == 0 ? false : true;
    })

    // enable/disable form based on current index change
    this.subSink.sink = this.matTab.selectedIndexChange.subscribe(x =>
      {
        this.currentIndexTab = x;
        this.formDisabled = this.currentIndexTab == 0 ? false : true;
        //this.disableForm();
      })

    const guid$ = this.store.select(BranchSettingsSelectors.selectGuid);
   


    this.subSink.sink = guid$
    .subscribe(guid => {
      this.branchGuid = guid;
    })
  }

  /**
   * Set form disabled to true if user is not Owner or Admin and false otherwise.
   */
  disableForm() {
    const isInTeam = this.currentUser.link_subject_to_grps.map(x => x.app_grp_guid.toString()).includes(this.branchGuid);
    const isCorrectIndex = this.currentIndexTab == 0 ? true : false;
    if (!isInTeam || !isCorrectIndex) {
      this.formDisabled = true;
    } else {
      const ranks = this.currentUser.link_subject_to_grps.filter(x => x.app_grp_guid.toString() == this.branchGuid).map(x => x.rank)
      if (!ranks.includes('OWNER') && !ranks.includes('ADMIN')) {
        this.formDisabled = true;
      } else {
        this.formDisabled = false;
      }
    }
  }

  /**
  Return to previous drawer.
  */
  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false
    })
    this.viewColFacade.onPrev(this.prevIndex);
  }


  /**
   * Lifecycle method: called when the component is destroyed.
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