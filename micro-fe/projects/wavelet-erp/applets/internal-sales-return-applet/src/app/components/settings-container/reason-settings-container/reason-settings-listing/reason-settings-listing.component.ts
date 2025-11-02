import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Store } from "@ngrx/store";

// , ReasonSettingContainerModel, ReasonSettingService

import {
  Pagination,
  ServiceReturnReasonService,
  TenantAppletConfigService,
  TenantUserProfileService,
} from "blg-akaun-ts-lib";
import {
  pageFiltering,
  pageSorting,
} from "projects/shared-utilities/listing.utils";
import { AppConfig } from "projects/shared-utilities/visa";
import { Observable } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { SubSink } from "subsink2";
import { ViewColumnFacade } from "../../../../facades/view-column.facade";
// import { AppletConstants } from '../../../../models/constants/applet-constants';
import { ReasonSettingActions } from "../../../../state-controllers/reason-settings-controller/store/actions";
import { ReasonSettingSelectors} from "../../../../state-controllers/reason-settings-controller/store/selectors";
import { ReasonSettingStates } from "../../../../state-controllers/reason-settings-controller/store/states";
import { ViewColumnComponent } from "projects/shared-utilities/view-column.component";
import { PrintableFormatActions } from "../../../../state-controllers/printable-format-controller/store/actions";

interface LocalState {
  deactivateAdd: boolean;
  deactivateList: boolean;
  selectedRow: any;
}

@Component({
  selector: "app-reason-settings-listing",
  templateUrl: "./reason-settings-listing.component.html",
  styleUrls: ["./reason-settings-listing.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore],
})
export class ReasonSettingsListingComponent extends ViewColumnComponent {
  private subs = new SubSink();

  protected readonly index = 0;
  private localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateAdd$ = this.componentStore.select(
    (state) => state.deactivateAdd
  );

  toggleColumn$: Observable<boolean>;
  gridApi;
  rowData = [];
  SQLGuids: string[] = null;
  pagination = new Pagination();

  defaultColDef = {
    filter: "agTextColumnFilter",
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true,
    floatingFilter: true
  };

  columnsDefs = [
    // {
    //   headerName: "Default Selection",
    //   field: "default_selection",
    //   checkboxSelection: true,
    // },
    {
      headerName: "Reason Code",
      field: "bl_svc_return_reason.reason_code",
      cellStyle: () => ({ "text-align": "left" }),
    },
    {
      headerName: "Reason Name",
      field: "bl_svc_return_reason.reason_name",
      cellStyle: () => ({ "text-align": "left" }),
    },
  ];

  constructor(
    private returnReasonService: ServiceReturnReasonService,
    private viewColFacade: ViewColumnFacade,
    private readonly store: Store<ReasonSettingStates>,
    private readonly componentStore: ComponentStore<LocalState>
  ) {
    super();
  }

  ngOnInit() {
    this.toggleColumn$ = this.viewColFacade.toggleColumn$;
    this.subs.sink = this.localState$.subscribe((a) => {
      this.localState = a;
      this.componentStore.setState(a);
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.setGridData();
  }

  setGridData() {
    const apiVisa = AppConfig.apiVisa;
    const datasource = {
      getRows: (grid) => {
        this.store.dispatch(
          ReasonSettingActions.loadReasonSettingInit({ request: grid.request })
        );
        const filter = pageFiltering(grid.request.filterModel);
        const sortOn = pageSorting(grid.request.sortModel);
        this.pagination.offset = this.SQLGuids ? 0 : grid.request.startRow;
        this.pagination.limit = grid.request.endRow - grid.request.startRow;
        this.pagination.conditionalCriteria = [
          { columnName: "calcTotalRecords", operator: "=", value: "true" },
        ];
        this.subs.sink = this.returnReasonService
          .getByCriteria(this.pagination, apiVisa)
          .subscribe(
            (resolved) => {
              this.store.dispatch(
                ReasonSettingActions.loadReasonSettingSuccess({
                  totalRecords: resolved.totalRecords,
                })
              );
              const data = sortOn(resolved.data).filter((entity) =>
                filter.by(entity)
              );
              const totalRecords = filter.isFiltering
                ? this.SQLGuids
                  ? this.SQLGuids.length
                  : resolved.totalRecords
                : data.length;
              grid.success({
                rowData: data,
                rowCount: totalRecords,
              });
              this.gridApi.forEachNode((node) => {
                if (
                  node.data?.bl_svc_return_reason.guid === this.localState.selectedRow
                )
                  node.setSelected(true);
              });
            },
            (err) => {
              grid.fail();
              this.store.dispatch(
                ReasonSettingActions.loadReasonSettingFailed({
                  error: err.message,
                })
              );
            }
          );
      },
    };
    this.gridApi.setServerSideDatasource(datasource);
    this.subs.sink = this.store
      .select(ReasonSettingSelectors.updateAgGrid)
      .subscribe((resolved) => {
        if (resolved) {
          this.gridApi.refreshServerSideStore();
          this.store.dispatch(
            ReasonSettingActions.updateAgGridDone({ done: false })
          );
        }
      });
  }

  onNext() {
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateAdd: true,
      deactivateList: true,
    });
    this.viewColFacade.onNextAndReset(this.index, 1);
  }

  onRowClicked(reasonSetting: any) {
    console.log("Reason gg",reasonSetting);
    if (reasonSetting && !this.localState.deactivateList) {
      console.log(reasonSetting);
      this.store.dispatch(
        ReasonSettingActions.selectReasonSettingForEdit({ reasonSetting })
      );
      
      this.viewColFacade.updateInstance(this.index, {
        ...this.localState,
        deactivateAdd: true,
        deactivateList: false,
      });
      this.viewColFacade.onNextAndReset(this.index, 2);
    }
  }

  onSelectionChange(event) {
    if (event.api.getSelectedRows().length > 0) {
      const selectedGuid = event.api
        .getSelectedRows()[0]
        .bl_prt_printable_format_hdr.guid.toString();
      this.store.dispatch(
        PrintableFormatActions.selectDefaultPrintableFormat({
          defaultPrintableFormatGuid: selectedGuid,
        })
      );
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
