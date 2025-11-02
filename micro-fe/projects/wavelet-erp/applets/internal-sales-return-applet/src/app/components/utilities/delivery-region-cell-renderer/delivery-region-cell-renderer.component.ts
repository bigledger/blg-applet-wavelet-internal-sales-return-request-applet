import {
  Component,
  OnDestroy
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatSelectChange } from "@angular/material/select";
import { Store } from "@ngrx/store";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";
import { SubSink } from "subsink2";
import { DraftStates } from "../../../state-controllers/draft-controller/store/states";
import { ColumnViewModelStates } from "../../../state-controllers/sales-return-view-model-controller/store/states";
import { PNSActions } from "../../../state-controllers/draft-controller/store/actions";
import { Column2ViewSelectors } from "../../../state-controllers/sales-return-view-model-controller/store/selectors";

@Component({
  selector: "app-delivery-region-cell-renderer",
  templateUrl: "./delivery-region-cell-renderer.component.html",
  styleUrls: ["./delivery-region-cell-renderer.component.css"],
})
export class DeliveryRegionCellRendererComponent
  implements ICellRendererAngularComp, OnDestroy
{
  params: ICellRendererParams;
  private subs = new SubSink();
  public form: FormGroup;
  regArr: any[] = [];
  newRegArr: any[] = [];
  inputRegion: any;

  constructor(
    private readonly draftStore: Store<DraftStates>,
    public readonly viewModelStore: Store<ColumnViewModelStates>,
  ) {}

  refresh(params: ICellRendererParams): boolean {
    this.inputRegion = params.data.del_region_hdr_reg_code;
    return true;
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.viewModelStore.select(Column2ViewSelectors.selectDeliveryDetailsTab_LoadedDeliveryRegions).subscribe(data=>{
      this.regArr=data;
      this.newRegArr=data;
    })
    this.inputRegion = params.data.del_region_hdr_reg_code;
  }

  applyRegionFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.newRegArr = this.regArr.filter((option) =>
      option.region.toLowerCase().includes(filterValue)
    );
  }

  onRegionSelection(event: MatSelectChange) {
    this.inputRegion = event;
    this.params.data.del_region_hdr_reg_code = event;
    let result = this.regArr.find((a) => a.region === event);
    this.params.data.del_region_hdr_guid = result.guid;
    this.params.data.del_region_hdr_state = result.state;
    this.draftStore.dispatch(PNSActions.editPNS({ pns: this.params.data }));
  }

  getValue(): any {
    return this.inputRegion;
  }

  compareRegions(o1: any, o2: any) {
    console.log(o1===o2);
    return o1===o2
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
