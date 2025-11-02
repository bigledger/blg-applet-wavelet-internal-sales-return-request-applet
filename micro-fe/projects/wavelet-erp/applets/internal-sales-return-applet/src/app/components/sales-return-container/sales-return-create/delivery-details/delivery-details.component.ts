import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ComponentStore } from '@ngrx/component-store';
import { ColDef, CellValueChangedEvent } from 'ag-grid-community';
import { bl_fi_generic_doc_hdr_RowClass, bl_fi_generic_doc_line_RowClass, PickPackQueueService, SalesInvoiceService, CompanyService, BranchService, LocationService, RegionHdrService, BranchLocationLinkService, Pagination } from 'blg-akaun-ts-lib';
import { PermissionStates } from 'projects/shared-utilities/modules/permission/permission-controller';
import { UserPermInquirySelectors } from 'projects/shared-utilities/modules/permission/user-permissions-inquiry-controller/selectors';
import { AppConfig } from 'projects/shared-utilities/visa';
import { Observable } from 'rxjs';
import { exhaustMap, map, toArray } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { HDRActions, PNSActions } from '../../../../state-controllers/draft-controller/store/actions';
import { DraftStates } from '../../../../state-controllers/draft-controller/store/states';
import { Column2ViewModelActions } from '../../../../state-controllers/sales-return-view-model-controller/store/actions';
import { ColumnViewModelStates } from '../../../../state-controllers/sales-return-view-model-controller/store/states';
import { DateCellRendererComponent } from '../../../utilities/date-cell-renderer/date-cell-renderer.component';
import { DeliveryRegionCellRendererComponent } from '../../../utilities/delivery-region-cell-renderer/delivery-region-cell-renderer.component';
import { ShippingBranchCellRendererComponent } from '../../../utilities/shipping-branch-cell-renderer/shipping-branch-cell-renderer.component';
import { ShippingLocationCellRendererComponent } from '../../../utilities/shipping-location-cell-renderer/shipping-location-cell-renderer.component';
import { Store } from '@ngrx/store';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { DeliveryTypeCellRendererComponent } from "projects/shared-utilities/utilities/delivery-type-cell-renderer/delivery-type-cell-renderer.component";
import { RequireDeliveryCellRendererComponent } from "projects/shared-utilities/utilities/require-delivery-cell-renderer/require-delivery-cell-renderer.component";
interface LocalState {
  deactivateAdd: boolean;
  deactivateList: boolean;
}
@Component({
  selector: 'app-delivery-details',
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.scss']
})
export class DeliveryDetailsComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = "Generic Listing";
  protected readonly index = 0;
  protected localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateAdd$ = this.componentStore.select(
    (state) => state.deactivateAdd
  );
  readonly deactivateList$ = this.componentStore.select(
    (state) => state.deactivateList
  );

  userPermissionTarget$ = this.permissionStore.select(
    UserPermInquirySelectors.selectUserPermInquiry
  );

  toggleColumn$: Observable<boolean>;
  searchModel;
  @Input() rowData: any[] = [];
  @Input() draft$: Observable<bl_fi_generic_doc_hdr_RowClass>;
  @Input() pns$: Observable<bl_fi_generic_doc_line_RowClass[]>;

  defaultColDef = {
    filter: "agTextColumnFilter",
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true,
  };

  gridApi;
  branchArr: any[] = [];
  newBranchArr: any[] = [];
  locationArr: any[] = [];
  newLocationArr: any[] = [];

  form: FormGroup;

  columnsDefs: ColDef[] = [
    {
      headerName: "Item Code",
      field: "item_code",
      cellStyle: () => ({ "text-align": "left" }),
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    {
      headerName: "Item Name",
      field: "item_name",
      cellStyle: () => ({ "text-align": "left" }),
    },
    {
      headerName: "UOM",
      field: "uom",
      cellStyle: () => ({ "text-align": "left" }),
    },
    {
      headerName: "Volumetric Weight",
      field: "",
      cellStyle: () => ({ "text-align": "left" }),
    },
    {
      headerName: "Weight",
      field: "",
      cellStyle: () => ({ "text-align": "left" }),
    },
    {
      headerName: "Requested Delivery Date",
      field: "track_delivery_date_requested",
      cellRenderer: "dateCellRenderer",
      cellStyle: () => ({ "text-align": "left" }),
      minWidth: 220
    },
    {
      headerName: "Require Delivery",
      field: "delivery_required",
      cellRenderer: "requireDeliveryCellRenderer",
      cellStyle: () => ({ "text-align": "left" }),
      minWidth: 200,
    },
    {
      headerName: "Delivery Type",
      field: "track_delivery_logic",
      cellRenderer: "deliveryTypeCellRenderer",
      cellStyle: () => ({ "text-align": "left" }),
      minWidth: 220,
    },
    {
      headerName: "Base Quantity",
      field: "quantity_base",
      cellStyle: () => ({ "text-align": "left" }),
    },
    {
      headerName: "Tracking ID",
      field: "tracking_id",
      cellStyle: () => ({ "text-align": "left" }),
      editable: true,
    },
    {
      headerName: "Delivery Branch",
      field: "delivery_branch_code",
      cellRenderer: "shippingBranchCellRenderer",
      cellStyle: () => ({ "text-align": "left" }),
    },
    {
      headerName: "Delivery Location",
      field: "delivery_location_code",
      cellRenderer: "shippingLocationCellRenderer",
      cellStyle: () => ({ "text-align": "left" }),
    },
    {
      headerName: "Delivery Region",
      field: "del_region_hdr_state",
      cellRenderer: "deliveryRegionCellRenderer",
      cellStyle: () => ({ "text-align": "left" }),
    },
    {
      headerName: "Delivery Remarks",
      field: "track_delivery_remarks",
      cellStyle: () => ({ "text-align": "left" }),
      editable: true,
    },
  ];
  genDocHdrGuid: any;
  disableSendtoQ: boolean;
  branchGuids: any;
  deliveryBranchGuids: any;

  constructor(
    private pickPackQService: PickPackQueueService,
    protected viewColFacade: ViewColumnFacade,
    protected siService: SalesInvoiceService,
    protected compService: CompanyService,
    protected brchService: BranchService,
    private readonly draftStore: Store<DraftStates>,
    protected lctnService: LocationService,
    protected readonly componentStore: ComponentStore<LocalState>,
    private branchService: BranchService,
    private regionHdrService: RegionHdrService,
    private readonly viewModelStore: Store<ColumnViewModelStates>,
    protected readonly permissionStore: Store<PermissionStates>,
    private branchLocationLinkService: BranchLocationLinkService,
  ) {
    super();
  }

  frameworkComponents = {
    dateCellRenderer: DateCellRendererComponent,
    deliveryRegionCellRenderer: DeliveryRegionCellRendererComponent,
    shippingBranchCellRenderer: ShippingBranchCellRendererComponent,
    shippingLocationCellRenderer: ShippingLocationCellRendererComponent,
    requireDeliveryCellRenderer: RequireDeliveryCellRendererComponent,
    deliveryTypeCellRenderer: DeliveryTypeCellRendererComponent
  };

  ngOnInit() {
    this.toggleColumn$ = this.viewColFacade.toggleColumn$;
    this.subs.sink = this.localState$.subscribe((a) => {
      this.localState = a;
      this.componentStore.setState(a);
    });

    this.pns$.subscribe(data=>{
      this.rowData=data;
    })

    this.subs.sink = this.userPermissionTarget$.subscribe((targets) => {
      console.log("targets", targets);
      let tempBranch: any;
      let target = targets.filter(
        (target) =>
          target.permDfn === "TNT_API_DOC_INTERNAL_SALES_RETURN_READ_TGT_GUID"
      );
      let targetDelivery = targets.filter(
        (targetDelivery) =>
        targetDelivery.permDfn === "TNT_API_DOC_INTERNAL_SALES_RETURN_DELIVERY_BRANCH_READ"
      );
      let adminCreatePermissionTarget = targets.filter(
        (target) => target.permDfn === "TNT_TENANT_ADMIN"
      );
      let ownerCreatePermissionTarget = targets.filter(
        (target) => target.permDfn === "TNT_TENANT_OWNER"
      );
      if(adminCreatePermissionTarget[0]?.hasPermission || ownerCreatePermissionTarget[0]?.hasPermission){
        this.branchGuids = [];
        this.deliveryBranchGuids = [];
      }else{
        tempBranch = (target[0]?.target!==null && Object.keys(target[0]?.target || {}).length !== 0) ? target[0]?.target["bl_fi_mst_branch"] : [];
        this.deliveryBranchGuids = (targetDelivery[0]?.target!==null && Object.keys(targetDelivery[0]?.target || {}).length !== 0) ? targetDelivery[0]?.target["bl_fi_mst_branch"] : [];
        this.branchGuids = [...this.deliveryBranchGuids, ...tempBranch];
      }
    });

    this.form = new FormGroup({
      trackingID: new FormControl(),
      deliveryType: new FormControl(),
      shippingBranch:  new FormControl(),
      shippingLocation: new FormControl(),
    });

    let branchPagination = new Pagination();

    branchPagination.limit = 1000;
    if (this.branchGuids.length > 0) {
      branchPagination.conditionalCriteria.push({
        columnName: 'hdr_guids',
        operator: '=',
        value: this.branchGuids.toString(),
      });
    }

    this.subs.sink = this.branchService
    .getByCriteria(branchPagination,AppConfig.apiVisa)
    .pipe(
      exhaustMap((x) => {
        return x.data;
      }),
      map((x) => {
        return {
          guid: x.bl_fi_mst_branch.guid,
          code: x.bl_fi_mst_branch.code,
        };
      }),
      toArray()
    )
    .subscribe((x: any) => {
      this.branchArr=x;
      this.newBranchArr=x;
      this.viewModelStore.dispatch(
        Column2ViewModelActions.setDeliveryDetailsTab_LoadedBranches({
          branches: x,
        })
      );
    });


  this.subs.sink = this.regionHdrService
    .get(AppConfig.apiVisa)
    .pipe(
      exhaustMap((x) => {
        return x.data;
      }),
      map((x) => {
        return {
          guid: x.bl_del_region_hdr.guid,
          region: x.bl_del_region_hdr.region_code,
          state: x.bl_del_region_hdr.state,
        };
      }),
      toArray()
    )
    .subscribe((x: any) => {
      this.viewModelStore.dispatch(
        Column2ViewModelActions.setDeliveryDetailsTab_LoadedDeliveryRegions({
          deliveryRegions: x,
        })
      );
    });
  }

  onNext() {
    this.viewColFacade.updateInstance<LocalState>(this.index, {
      ...this.localState,
      deactivateAdd: true,
      deactivateList: false,
    });
    this.viewColFacade.onNextAndReset(this.index, 1);
  }

  onGridReady(params) {
    const apiVisa = AppConfig.apiVisa;
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
  }

  onSelectedBranch(event:any){
    console.log(event.source.value);
    let selectedBranch = this.branchArr.find((a) => a.code === event.source.value);
    console.log("selectedBranch",selectedBranch);
    let defaultLocationGuid;
    this.branchService
    .getByGuid(selectedBranch.guid, AppConfig.apiVisa)
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
    value: selectedBranch.guid,
  });

  this.branchLocationLinkService
    .getByCriteria(pagination, AppConfig.apiVisa)
    .subscribe((response) => {
      if (response.data && response.data.length) {
        for (let i = 0; i < response.data.length; i++) {
          if (
            response.data[i].bl_fi_mst_branch_location_link.guid_location !==
            null
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
  }

  onToggle(e: boolean) {
    this.viewColFacade.toggleColumn(e);
  }

  onCellValueChanged(event: CellValueChangedEvent) {
    let data: bl_fi_generic_doc_line_RowClass = event.data;
    this.draftStore.dispatch(PNSActions.editPNS({ pns: data }));
    console.log(data);
  }

  getAllRows() {
    let rowData = [];
    this.gridApi.forEachNode((node) => rowData.push(node.data));
    return rowData;
  }

  addTrackingIDToSelectedLines() {
    const trackingID = this.form.value.trackingID;
    let selectedRows:any []=[];
    this.gridApi.forEachNode((node) => {
      // Access the data for each row
      selectedRows.push(node.data);
      console.log(selectedRows);
    });   
    for (var i = 0; i < this.rowData.length; i++) {
      selectedRows.forEach((record) => {
        console.log(record);
        if (record.guid === this.rowData[i].guid) {
          // merge objects into one with multiple props
          this.rowData[i].tracking_id = trackingID;
        }
      });
    }
    this.gridApi.setRowData(this.rowData);
    this.draftStore.dispatch(PNSActions.updateTrackingID({ trackingID }));    
    // this.rowData.forEach((record) => {
    //   this.draftStore.dispatch(PNSActions.editPNS({ pns: record }));
    // });
  }

  addDeliveryTypeToSelectedLines() {
    const deliveryType = this.form.value.deliveryType;
    let selectedRows:any []=[];
    this.gridApi.forEachNode((node) => {
      // Access the data for each row
      selectedRows.push(node.data);
      console.log(selectedRows);
    });
    for (var i = 0; i < this.rowData.length; i++) {
      selectedRows.forEach((record) => {
        console.log(record);
        if (record.guid === this.rowData[i].guid) {
          // merge objects into one with multiple props
          this.rowData[i].track_delivery_logic = deliveryType;
        }
      });
    }
    this.gridApi.setRowData(this.rowData);
    this.draftStore.dispatch(HDRActions.updateDeliveryType({ deliveryType }));
    this.draftStore.dispatch(PNSActions.updateDeliveryType({ deliveryType }));   
    // this.rowData.forEach((record) => {
    //   this.draftStore.dispatch(PNSActions.editPNS({ pns: record }));
    // });
  }

  addShippingBranchToSelectedLines() {
    const shippingBranch = this.form.value.shippingBranch;
    console.log("shippingBranch",shippingBranch);
    let selectedRows:any []=[];
    this.gridApi.forEachNode((node) => {
      // Access the data for each row
      selectedRows.push(node.data);
      console.log(selectedRows);
    });
    let result = this.branchArr.find((a) => a.code === shippingBranch);
    for (var i = 0; i < this.rowData.length; i++) {
      selectedRows.forEach((record) => {
        console.log(record);
        if (record.guid === this.rowData[i].guid) {
          // merge objects into one with multiple props
          this.rowData[i].delivery_branch_code = shippingBranch;
          this.rowData[i].delivery_branch_guid = result.guid;
        }
      });
    }
    this.gridApi.setRowData(this.rowData);
    this.draftStore.dispatch(PNSActions.updateDeliveryBranch({ deliveryBranch: result.guid ,deliveryBranchCode: shippingBranch }));    
    // this.rowData.forEach((record) => {
    //   this.draftStore.dispatch(PNSActions.editPNS({ pns: record }));
    // });
  }

  applyBranchFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.newBranchArr = this.branchArr.filter((option) =>
      option.code.toLowerCase().includes(filterValue)
    );
  }

  addShippingLocationToSelectedLines() {
    const shippingLocation = this.form.value.shippingLocation;
    let selectedRows:any []=[];
    this.gridApi.forEachNode((node) => {
      // Access the data for each row
      selectedRows.push(node.data);
      console.log(selectedRows);
    });
    let result = this.locationArr.find((a) => a.code === shippingLocation);
    for (var i = 0; i < this.rowData.length; i++) {
      selectedRows.forEach((record) => {
        console.log(record);
        if (record.guid === this.rowData[i].guid) {
          // merge objects into one with multiple props
          this.rowData[i].delivery_location_code = shippingLocation;
          this.rowData[i].delivery_location_guid = result.guid;
        }
      });
    }
    this.gridApi.setRowData(this.rowData);
    this.draftStore.dispatch(PNSActions.updateDeliveryLocation({ deliveryLocation: result.guid ,deliveryLocationCode: shippingLocation }));    
    // this.rowData.forEach((record) => {
    //   this.draftStore.dispatch(PNSActions.editPNS({ pns: record }));
    // });
  }

  applyLocationFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.newLocationArr = this.locationArr.filter((option) =>
      option.code.toLowerCase().includes(filterValue)
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}