import {
  ChangeDetectorRef,
  Component,
  OnDestroy
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatSelectChange } from "@angular/material/select";
import { Store } from "@ngrx/store";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";
import {
  BranchLocationLinkService,
  BranchService,
  LocationService,
  Pagination,
} from "blg-akaun-ts-lib";
import { AppConfig } from "projects/shared-utilities/visa";
import { exhaustMap, map, toArray } from "rxjs/operators";
import { SubSink } from "subsink2";
import { DraftStates } from "../../../state-controllers/draft-controller/store/states";
import { ColumnViewModelStates } from "../../../state-controllers/sales-return-view-model-controller/store/states";
import { PNSActions } from "../../../state-controllers/draft-controller/store/actions";

@Component({
  selector: "app-shipping-location-cell-renderer",
  templateUrl: "./shipping-location-cell-renderer.component.html",
  styleUrls: ["./shipping-location-cell-renderer.component.css"],
})
export class ShippingLocationCellRendererComponent
  implements ICellRendererAngularComp, OnDestroy
{
  params: ICellRendererParams;
  private subs = new SubSink();
  public form: FormGroup;
  locationArr: any[] = [];
  newLocationArr: any[] = [];
  inputLocation: any;

  constructor(
    private readonly draftStore: Store<DraftStates>,
    public readonly viewModelStore: Store<ColumnViewModelStates>,
    private lctnService: LocationService,
    private branchLocationLinkService: BranchLocationLinkService,
    private branchService: BranchService,
    private cdRef: ChangeDetectorRef
  ) {}

  refresh(params: ICellRendererParams): boolean {
    this.inputLocation = params.data.delivery_location_code;
    return true;
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    let defaultLocationGuid;

    if (
      this.params.data.delivery_branch_guid !== null &&
      this.params.data.delivery_branch_guid !== undefined
    ) {
      this.branchService
        .getByGuid(this.params.data.delivery_branch_guid, AppConfig.apiVisa)
        .subscribe((branch) => {
          if (branch.data.bl_fi_mst_branch?.location_guid) {
            defaultLocationGuid = branch.data.bl_fi_mst_branch.location_guid;
          } else if (
            branch.data.bl_fi_mst_branch_ext.find(
              (x) => x.param_code === "MAIN_LOCATION"
            )
          ) {
            defaultLocationGuid = branch.data.bl_fi_mst_branch_ext.find(
              (x) => x.param_code === "MAIN_LOCATION"
            )?.value_string;
          }
        });

      let locationGuidsList = [];
      let pagination = new Pagination();
      pagination.limit = 1000;
      pagination.conditionalCriteria = [];
      pagination.conditionalCriteria.push({
        columnName: "guid_branch",
        operator: "=",
        value: this.params.data.delivery_branch_guid,
      });

      this.branchLocationLinkService
        .getByCriteria(pagination, AppConfig.apiVisa)
        .subscribe((response) => {
          if (response.data && response.data.length) {
            for (let i = 0; i < response.data.length; i++) {
              if (
                response.data[i].bl_fi_mst_branch_location_link
                  .guid_location !== null
              ) {
                locationGuidsList.push(
                  response.data[
                    i
                  ].bl_fi_mst_branch_location_link.guid_location.toString()
                );
              }
            }

            let paging = new Pagination();
            paging.limit = 1000;
            paging.conditionalCriteria = [];
            paging.conditionalCriteria.push({
              columnName: "hdr_guids",
              operator: "=",
              value: locationGuidsList.toString(),
            });

            if (locationGuidsList.length > 0) {
              this.lctnService
                .getByCriteria(paging, AppConfig.apiVisa)
                .pipe(
                  exhaustMap((x) => {
                    return x.data;
                  }),
                  map((x) => {
                    return {
                      guid: x.bl_inv_mst_location.guid,
                      code: x.bl_inv_mst_location.code,
                    };
                  }),
                  toArray()
                )
                .subscribe((x: any) => {
                  this.locationArr = x;
                  this.newLocationArr = x;
                });
            }
          }
        });

      setTimeout(() => {
        this.inputLocation = params.data.delivery_location_code;
        this.cdRef.detectChanges();
      }, 1000);
    }
  }

  applyLocationFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.newLocationArr = this.locationArr.filter((option) =>
      option.code.toLowerCase().includes(filterValue)
    );
  }

  onLocationSelection(event: MatSelectChange) {
    console.log("event", event);
    this.inputLocation = event;
    this.params.data.delivery_location_code = event;
    let result = this.locationArr.find((a) => a.code === event);
    this.params.data.delivery_location_guid = result.guid;
    this.draftStore.dispatch(PNSActions.editPNS({ pns: this.params.data }));
    this.cdRef.detectChanges();
  }

  getValue(): any {
    return this.inputLocation;
  }

  compareRegions(o1: any, o2: any) {
    console.log(o1 === o2);
    return o1 === o2;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
