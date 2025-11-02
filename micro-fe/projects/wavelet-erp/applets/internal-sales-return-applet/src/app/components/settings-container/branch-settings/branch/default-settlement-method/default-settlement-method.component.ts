import { Component } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { Store } from '@ngrx/store';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';
import { BranchSettingsActions } from '../../../../../state-controllers/branch-settings-controller/actions';
import { BranchSettingsSelectors } from '../../../../../state-controllers/branch-settings-controller/selectors';
import { BranchSettingsStates } from '../../../../../state-controllers/branch-settings-controller/states';
import { InternalSalesReturnStates } from '../../../../../state-controllers/internal-sales-return-controller/store/states';

interface LocalState {
  deactivateReturn: boolean;
  selectedIndex: number;
  deactivateAdd: boolean;
  deactivateList: boolean;
}

@Component({
  selector: "app-default-settlement-method",
  templateUrl: "./default-settlement-method.component.html",
  styleUrls: ["./default-settlement-method.component.css"],
})
export class DefaultSettlementMethodComponent extends ViewColumnComponent {
  form: FormGroup;
  apiVisa = AppConfig.apiVisa;
  private subs = new SubSink();
  options: any = { level: 1, multiple: true };
  branchGuid;
  constructor(
    private store: Store<InternalSalesReturnStates>,
    private branchSettingsStore: Store<BranchSettingsStates>
  ) {
    super();
  }
  ngOnInit() {
    this.form = new FormGroup({
      default_settlement_cash: new FormControl(),
      default_settlement_credit_card: new FormControl(),
      default_settlement_debit_card: new FormControl(),
      default_settlement_voucher: new FormControl(),
      default_settlement_bank_transfer: new FormControl(),
      default_settlement_cheque: new FormControl(),
      default_settlement_others: new FormControl(),
      default_settlement_ewallet: new FormControl(),
      default_settlement_membership_point_currency: new FormControl(),
    });

    this.subs.sink = this.branchSettingsStore
      .select(BranchSettingsSelectors.selectBranch)
      .subscribe((b: any) => {
        this.branchGuid = b.bl_fi_mst_branch.guid;
        this.form.patchValue({
          default_settlement_cash:
            b.bl_fi_mst_branch.default_settlement_method_json
              ?.default_settlement_cash,
          default_settlement_credit_card:
            b.bl_fi_mst_branch.default_settlement_method_json
              ?.default_settlement_credit_card,
          default_settlement_debit_card:
            b.bl_fi_mst_branch.default_settlement_method_json
              ?.default_settlement_debit_card,
          default_settlement_voucher:
            b.bl_fi_mst_branch.default_settlement_method_json
              ?.default_settlement_voucher,
          default_settlement_bank_transfer:
            b.bl_fi_mst_branch.default_settlement_method_json
              ?.default_settlement_bank_transfer,
          default_settlement_cheque:
            b.bl_fi_mst_branch.default_settlement_method_json
              ?.default_settlement_cheque,
          default_settlement_others:
            b.bl_fi_mst_branch.default_settlement_method_json
              ?.default_settlement_others,
          default_settlement_ewallet:
            b.bl_fi_mst_branch.default_settlement_method_json
              ?.default_settlement_ewallet,
          default_settlement_membership_point_currency:
            b.bl_fi_mst_branch.default_settlement_method_json
              ?.default_settlement_membership_point_currency,
        });
      });
  }

  onSubmit() {
    this.branchSettingsStore.dispatch(
      BranchSettingsActions.updateBranchDetails({
        guid: this.branchGuid,
        form: this.form,
      })
    );
  }
}