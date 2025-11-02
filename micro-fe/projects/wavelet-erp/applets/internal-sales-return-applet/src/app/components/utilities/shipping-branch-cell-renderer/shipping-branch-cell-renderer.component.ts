import { Component, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { SubSink } from 'subsink2';
import { DraftStates } from '../../../state-controllers/draft-controller/store/states';
import { ColumnViewModelStates } from "../../../state-controllers/sales-return-view-model-controller/store/states";
import { PNSActions } from "../../../state-controllers/draft-controller/store/actions";
import { Column2ViewSelectors } from "../../../state-controllers/sales-return-view-model-controller/store/selectors";

@Component({
  selector: 'app-shipping-branch-cell-renderer',
  templateUrl: './shipping-branch-cell-renderer.component.html',
  styleUrls: ['./shipping-branch-cell-renderer.component.css'],
})
export class ShippingBranchCellRendererComponent implements ICellRendererAngularComp, OnDestroy
{
  params!: ICellRendererParams;
  private subs = new SubSink();
  public form: FormGroup;
  branchArr: any[] = [];
  newBranchArr: any[] = [];
  inputBranch: any;

  constructor(
    private readonly draftStore: Store<DraftStates>,
    public readonly viewModelStore: Store<ColumnViewModelStates>,
  ) {}

  refresh(params: ICellRendererParams): boolean {
    this.inputBranch = params.data.delivery_branch_code;
    return true;
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.viewModelStore.select(Column2ViewSelectors.selectDeliveryDetailsTab_LoadedBranches).subscribe(data=>{
      this.branchArr=data;
      this.newBranchArr=data;
    })
    this.inputBranch = params.data.delivery_branch_code;
  }

  applyBranchFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.newBranchArr = this.branchArr.filter((option) =>
      option.code.toLowerCase().includes(filterValue)
    );
  }

  onBranchSelection(event: MatSelectChange) {
    this.inputBranch = event;
    this.params.data.delivery_branch_code = event;
    let result = this.branchArr.find((a) => a.code === event);
    this.params.data.delivery_branch_guid = result.guid;
    this.draftStore.dispatch(PNSActions.editPNS({ pns: this.params.data }));
  }

  getValue(): any {
    return this.inputBranch;
  }

  compareRegions(o1: any, o2: any) {
    console.log(o1===o2);
    return o1===o2
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}

