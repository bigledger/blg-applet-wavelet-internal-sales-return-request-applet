import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { Store } from '@ngrx/store';
import { SessionActions } from 'projects/shared-utilities/modules/session/session-controller/actions';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';
import { BranchSettingsSelectors } from '../../../../../state-controllers/branch-settings-controller/selectors';
import { BranchSettingsStates } from '../../../../../state-controllers/branch-settings-controller/states';

interface LocalState {
    deactivateReturn: boolean;
    selectedIndex: number;
    deactivateAdd: boolean;
    deactivateList: boolean;
  }
  
  @Component({
    selector: 'app-menu-list',
    templateUrl: './menu-list.component.html',
    styleUrls: ['./menu-list.component.css'],
    encapsulation: ViewEncapsulation.None,
  })

  
  export class MenuListComponent  extends ViewColumnComponent {
    
    form: FormGroup;
    apiVisa = AppConfig.apiVisa;
    private subs = new SubSink;
    options:any={};
    branchGuid;
    constructor(
      private branchSettingsStore: Store<BranchSettingsStates>,
      private store: Store<SessionStates>)
    {
      super();
      this.form = new FormGroup({}); 
    }
    ngOnInit(){
      this.subs.sink = this.branchSettingsStore.select(BranchSettingsSelectors.selectBranch).subscribe(b=>{
        this.branchGuid = b.bl_fi_mst_branch.guid;
      })

     // Create a dynamic form control
    const dynamicControlName = this.getDynamicControlName();
    this.form.addControl(dynamicControlName, new FormControl());
        this.subs.sink = this.store.select(SessionSelectors.selectMasterSettings).subscribe({next: (resolve: any) => {
          const resolvedValue = resolve ? resolve[dynamicControlName] : null;
          
          this.form.get(dynamicControlName).patchValue(resolvedValue);
        }});
    }
    onReset(){
      const dynamicControlName = this.getDynamicControlName();
      this.form.get(dynamicControlName).patchValue(null);
    }

    onSave(){
        this.store.dispatch(SessionActions.saveMasterSettingsInit({settings: this.form.value}));
    }

    getDynamicControlName(): string {
      return `ITEM_CATEGORY_GROUP_BRANCH_${this.branchGuid}`;
    }
  }
