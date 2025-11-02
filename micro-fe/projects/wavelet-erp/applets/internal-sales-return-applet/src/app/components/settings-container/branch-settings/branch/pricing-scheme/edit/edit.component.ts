import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { BranchSettingsSelectors } from 'projects/wavelet-erp/applets/pos-general-applet/src/app/state-controllers/branch-settings-controller/selectors';
import { BranchSettingsStates } from 'projects/wavelet-erp/applets/pos-general-applet/src/app/state-controllers/branch-settings-controller/states';
import { PosStates } from 'projects/wavelet-erp/applets/pos-general-applet/src/app/state-controllers/pos-controller/store/states';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../../../facades/view-column.facade';

interface LocalState {
  deactivateAdd: boolean;
  deactivateReturn: boolean;
  selectedIndex: number;
  deleteConfirmation: boolean;
}

@Component({
  selector: 'app-branch-pricing-schme-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})

export class BranchPricingSchemeEditComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Edit Pricing Scheme';
  protected index = 5;
  protected localState: LocalState;
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);

 
  branchGuid;
  form: FormGroup;
  @ViewChild(MatTabGroup) matTab: MatTabGroup;
  selectedPricingScheme;
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
      this.selectedPricingScheme = a?.data;
      this.componentStore.setState(a);
    });
    this.form = new FormGroup({
      pricingScheme: new FormControl(),
      level: new FormControl()
    })

    this.form.patchValue({
       pricingScheme: this.selectedPricingScheme.bl_fi_mst_branch_pricing_scheme_hdr_link.guid_pricing_scheme_hdr,
       level: this.selectedPricingScheme.bl_fi_mst_branch_pricing_scheme_hdr_link.level_value
    });

    
  }

  onReturn(){
    this.viewColFacade.onPrev(1);
  }

  onSave(){
    this.selectedPricingScheme.bl_fi_mst_branch_pricing_scheme_hdr_link.level_value = this.form.value.level;
    this.selectedPricingScheme.bl_fi_mst_branch_pricing_scheme_hdr_link.guid_pricing_scheme_hdr = this.form.value.pricingScheme;
    // this.store.dispatch(PurchaseOrderActions.editBranchPricingSchemeInit({container:this.selectedPricingScheme}));
    this.onReturn();
  }

  onDelete() {
    // this.store.dispatch(PurchaseOrderActions.deleteBranchPricingSchemeInit({guid: this.selectedPricingScheme.bl_fi_mst_branch_pricing_scheme_hdr_link.guid.toString()}));
    this.onReturn();
  }

  
}