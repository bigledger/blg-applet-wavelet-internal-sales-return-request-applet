import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { ComponentStore } from "@ngrx/component-store";
import { ViewColumnFacade } from "../../../facades/view-column.facade";
import { SubSink } from "subsink2";
import { ViewColumnComponent } from "projects/shared-utilities/view-column.component";
import { AppConfig } from "projects/shared-utilities/visa";
import { PaginationComponent } from "projects/shared-utilities/utilities/pagination/pagination.component";
import {
  Pagination,
  SalesReturnFileImportContainerModel,
  SalesReturnFileImportService,
} from "blg-akaun-ts-lib";
import { FileImportStates } from "../../../state-controllers/file-import-controller/store/states";
import moment from "moment";
import { FileImportSelectors } from "../../../state-controllers/file-import-controller/store/selectors";
import { FileImportActions } from "../../../state-controllers/file-import-controller/store/actions";
import { SessionStates } from "projects/shared-utilities/modules/session/session-controller/states";
import { SessionSelectors } from "projects/shared-utilities/modules/session/session-controller/selectors";
import {SessionActions} from "../../../../../../../../shared-utilities/modules/session/session-controller/actions";
import {UtilitiesModule} from '../../../../../../../../shared-utilities/utilities/utilities.module';

interface LocalState {
  deactivateAdd: boolean;
  deactivateList: boolean;
  selectedRow: any;
}

@Component({
  selector: "app-file-import-listing",
  templateUrl: "./file-import-listing.component.html",
  styleUrls: ["./file-import-listing.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore],
})
export class FileImportListingComponent extends ViewColumnComponent {
  protected compName = "File Import Listing";
  protected readonly index = 0;
  protected localState: LocalState;
  columnsDefs: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateAdd$ = this.componentStore.select(
    (state) => state.localState.deactivateAdd
  );
  readonly deactivateList$ = this.componentStore.select(
    (state) => state.localState.deactivateList
  );

  toggleColumn$: Observable<boolean>;

  apiVisa = AppConfig.apiVisa;

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

  rowData: any = [];
  sideBar;
  rowSelection;
  rowModelType = "serverSide";
  serverSideStoreType = "partial";

  private subs = new SubSink();

  fileImport$: Observable<SalesReturnFileImportContainerModel[]>;
  newArr: any = [];
  public arr: any = [];

  fileImport: any = [];
  fileImportArray: any = [];
  newfileImportArray: any = [];

  @ViewChild(PaginationComponent, { static: false })
  private paginationComponent: PaginationComponent;

  personalData: any;

  constructor(
    private readonly store: Store<FileImportStates>,
    private readonly componentStore: ComponentStore<{ localState: LocalState }>,
    private viewColFacade: ViewColumnFacade,
    private fileImportService: SalesReturnFileImportService,
    private readonly sessionStore: Store<SessionStates>
  ) {
    super();

    this.rowSelection = "multiple";
    this.sideBar = {
      toolPanels: ["columns"],
      defaultToolPanel: "",
    };

    this.columnsDefs = [
      {
        headerName: "File Name",
        field: "bl_fi_internal_sales_return_import_file_hdr.file_name",
        cellStyle: () => ({ "text-align": "left" }),
        suppressSizeToFit: true,
        minWidth: 100,
      },
      {
        headerName: "File Size",
        field: "bl_fi_internal_sales_return_import_file_hdr.file_size",
        cellStyle: () => ({ "text-align": "left" }),
        suppressSizeToFit: true,
        minWidth: 100,
      },
      {
        headerName: "Format",
        field: "bl_fi_internal_sales_return_import_file_hdr.import_format",
        cellStyle: () => ({ "text-align": "left" }),
        suppressSizeToFit: true,
        minWidth: 100,
      },
      {
        headerName: "Status",
        field: "bl_fi_internal_sales_return_import_file_hdr.status",
        cellStyle: () => ({ "text-align": "left" }),
        suppressSizeToFit: true,
        minWidth: 100,
      },
      {
        headerName: "Process Status",
        field: "bl_fi_internal_sales_return_import_file_hdr.process_status",
        cellStyle: () => ({ "text-align": "left" }),
        suppressSizeToFit: true,
        minWidth: 100,
      },
      {
        headerName: "Error Message",
        field: "bl_fi_internal_sales_return_import_file_hdr.error_message",
        cellStyle: () => ({ "text-align": "left" }),
        suppressSizeToFit: true,
        minWidth: 150,
      },
      {
        headerName: "Created Date",
        field: "bl_fi_internal_sales_return_import_file_hdr.created_date",
        cellStyle: () => ({ "text-align": "left" }),
        suppressSizeToFit: true,
        minWidth: 100,
        valueFormatter: (params) => moment(params.value).format("YYYY-MM-DD"),
      },
    ];
  }

  ngOnInit() {
    this.toggleColumn$ = this.viewColFacade.toggleColumn$;

    this.localState$.subscribe((a) => {
      this.localState = a;
      this.componentStore.setState({ localState: a });
    });

    this.subs.sink = this.sessionStore.select(SessionSelectors.selectPersonalSettings)
      .subscribe((data) => {
        this.personalData = data;

        if (UtilitiesModule.isMobileView()) {
          this.onToggle(true);
          return;
        }

        const defaultToggle = data?.DEFAULT_TOGGLE_COLUMN;
        this.onToggle(defaultToggle === 'SINGLE');
      });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.retrieveData();
    this.store
      .select(FileImportSelectors.selectLocalOperationCount)
      .subscribe((e) => {
        this.gridApi.purgeServerSideCache();
        this.subs.sink = this.store
          .select(FileImportSelectors.selectRequiresUpdate)
          .subscribe((a) => {
            if (a) {
              this.gridApi.purgeServerSideCache();
              this.store.dispatch(
                FileImportActions.setRequiresUpdate({ update: false })
              );
            }
          });
        if (!this.localState.deactivateList) {
          this.viewColFacade.updateInstance(this.index, {
            ...this.localState,
            deactivateAdd: false,
            deactivateList: false,
          });
        }
      });
  }

  retrieveData(criteria?, apiVisa = AppConfig.apiVisa) {
    criteria = criteria
      ? criteria
      : [{ columnName: "calcTotalRecords", operator: "=", value: "true" }];

    const datasource = {
      getRows: this.getRowsFactory(criteria, apiVisa),
    };
    this.gridApi.setServerSideDatasource(datasource);
  }

  getRowsFactory(criteria, apiVisa) {
    this.rowData = [];

    const sortCriteria = [
      { columnName: "orderBy", value: "updated_date" },
      { columnName: "order", value: "DESC" },
    ];

    return (grid) => {
      var filter = this.pageFiltering(grid.request.filterModel);
      var sortOn = this.pageSorting(grid.request.sortModel);

      const offset = grid.request.startRow;
      const limit = grid.request.endRow;

      const pagination = new Pagination(offset, limit, criteria, sortCriteria);

      this.subs.sink = this.fileImportService
        .getByCriteria(pagination, apiVisa)
        .subscribe(
          (a) => {
            a.data.forEach((element) => {
              const headervalue =
                element.bl_fi_internal_sales_return_import_file_hdr;
              this.rowData.push({
                file_name: headervalue.file_name,
                file_size: headervalue.file_size,
                import_format: headervalue.import_format,
                status: headervalue.status,
                process_status: headervalue.process_status,
                error_message: headervalue.error_message,
                createdDate: headervalue.created_date,
                created_by: headervalue.created_by_subject_guid,
              });
            });

            var data = sortOn(
              a.data.filter((o) =>
                filter.by(o.bl_fi_internal_sales_return_import_file_hdr)
              )
            );

            var totalRecords = filter.isFiltering ? a.data.length : data.length;

            grid.successCallback(data, totalRecords);

            this.store.dispatch(
              FileImportActions.GET_FILEIMPORT_SUCCESS({
                fileimport: a.data,
                totalRecords: a.data.length,
              })
            );
          },
          (err) => {
            grid.failCallback();
            this.store.dispatch(
              FileImportActions.GET_FILEIMPORT_FAILED({ error: err.message })
            );
          }
        );
    };
  }

  pageSorting(sortModel) {
    return (data) => {
      if (sortModel.length <= 0) return data;
      var newData = data.map((o) => o);
      sortModel.forEach((model) => {
        var col = model.colId.replace(
          "bl_fi_internal_sales_return_import_file_hdr.",
          ""
        );

        newData =
          model.sort == "asc"
            ? newData.sort(
                (p, c) =>
                  0 -
                  (p.bl_fi_internal_sales_return_import_file_hdr[col] >
                  c.bl_fi_internal_sales_return_import_file_hdr[col]
                    ? -1
                    : 1)
              )
            : newData.sort(
                (p, c) =>
                  0 -
                  (p.bl_fi_internal_sales_return_import_file_hdr[col] >
                  c.bl_fi_internal_sales_return_import_file_hdr[col]
                    ? 1
                    : -1)
              );
      });

      return newData;
    };
  }

  pageFiltering(filterModel) {
    var noFilters = Object.keys(filterModel).length <= 0;
    if (noFilters)
      return {
        by: (viewModel) => true,
        isFiltering: noFilters,
      };
    return {
      by: (viewModel: any) =>
        Object.keys(filterModel)
          .map((col) => {
            const newcolumn = col.replace(
              "bl_fi_internal_sales_return_import_file_hdr.",
              ""
            );
            return viewModel[newcolumn]
              .toLowerCase()
              .includes(filterModel[col].filter.toLowerCase());
          })
          .reduce((p, c) => p && c),
      isFiltering: noFilters,
    };
  }

  onToggle(e: boolean) {
    this.viewColFacade.toggleColumn(e);
    this.personalData.DEFAULT_TOGGLE_COLUMN = e ? 'SINGLE' : 'DOUBLE';
    this.sessionStore.dispatch(SessionActions.saveTogglePersonalSettingsInit({ settings: this.personalData }));
  }

  onNext() {
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateAdd: true,
      deactivateList: true,
      selectedIndex: 0,
    });
    this.viewColFacade.onNextAndReset(this.index, 1);
  }

  onRowClicked(entity: any) {
    console.log("Row clicked", entity);

    this.store.dispatch(
      FileImportActions.selectFileImportGuid({
        fileimportguid:
          entity.bl_fi_internal_sales_return_import_file_hdr.guid,
      })
    );
    this.store.dispatch(FileImportActions.selectEntity({ fileimport: entity }));
    if (!this.localState.deactivateList) {
      this.viewColFacade.updateInstance(this.index, {
        ...this.localState,
        deactivateList: false,
      });
      this.viewColFacade.onNextAndReset(this.index, 2);
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
