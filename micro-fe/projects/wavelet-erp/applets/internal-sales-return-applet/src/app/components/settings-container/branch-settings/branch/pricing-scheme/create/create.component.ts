import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../../../facades/view-column.facade';
import { PosStates } from 'projects/wavelet-erp/applets/pos-general-applet/src/app/state-controllers/pos-controller/store/states';
import { BranchPricingSchemeHdrLinkContainerModel } from 'blg-akaun-ts-lib';
import { BranchSettingsSelectors } from 'projects/wavelet-erp/applets/pos-general-applet/src/app/state-controllers/branch-settings-controller/selectors';
import { BranchSettingsStates } from 'projects/wavelet-erp/applets/pos-general-applet/src/app/state-controllers/branch-settings-controller/states';



interface LocalState {
  deactivateAdd: boolean;
  deactivateReturn: boolean;
  selectedIndex: number;
  deleteConfirmation: boolean;
}

@Component({
  selector: 'app-branch-pricing-schme-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})

export class BranchPricingSchemeCreateComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Create Pricing Scheme';
  protected index = 4;
  protected localState: LocalState;
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);

 
  branchGuid;
  form: FormGroup;
  @ViewChild(MatTabGroup) matTab: MatTabGroup;
 
  constructor(
    private branchSettingsStore: Store<BranchSettingsStates>,
    protected viewColFacade: ViewColumnFacade,
    private readonly store: Store<PosStates>,
    protected readonly componentStore: ComponentStore<LocalState>
    ) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.branchSettingsStore.select(BranchSettingsSelectors.selectBranch).subscribe(b=>{
      this.branchGuid = b.bl_fi_mst_branch.guid;
    })
    this.subs.sink = this.localState$.subscribe( a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.form = new FormGroup({
      pricingScheme: new FormControl(),
      level: new FormControl()
    })
    
  }

  onReturn(){
    this.viewColFacade.onPrev(1);
  }

  onSave(){
    const container = new BranchPricingSchemeHdrLinkContainerModel();
    container.bl_fi_mst_branch_pricing_scheme_hdr_link.guid_branch = this.branchGuid;
    container.bl_fi_mst_branch_pricing_scheme_hdr_link.guid_pricing_scheme_hdr = this.form.value.pricingScheme;
    container.bl_fi_mst_branch_pricing_scheme_hdr_link.level_value = this.form.value.level;

    // this.store.dispatch(PosActions.createBranchPricingSchemeInit({container:container}));
    this.onReturn();
  }
  
}