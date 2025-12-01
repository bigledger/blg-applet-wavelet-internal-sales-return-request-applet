import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { ViewColumnComponent } from "projects/shared-utilities/view-column.component";
import { SearchQueryModel } from "projects/shared-utilities/models/query.model";
import { Observable, zip, of, iif, forkJoin } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
} from "rxjs/operators";
import { Pagination} from "blg-akaun-ts-lib";
import { RowGroupingDisplayType } from "ag-grid-community";
import { Store } from "@ngrx/store";
import { SubSink } from "subsink2";
import { PaginationComponent } from "projects/shared-utilities/utilities/pagination/pagination.component";
import * as moment from "moment";
import { ViewColumnFacade } from "../../../../facades/view-column.facade";
import {
  DocumentShortCodesClass,
  IntercompanyProcessingQueueContainer,
  IntercompanyProcessingQueueService,
  GenericDocHdrService,
  BranchIntercompanySettingService,
  bl_wms_grn_hdr_RowClass 
  } from "blg-akaun-ts-lib";
import { AppConfig } from 'projects/shared-utilities/visa';
// import { ColumnViewModelStates } from "../../../state-controllers/space-controller-allocation-view-model-controller/states";
// import { Column1ViewModelActions } from "../../../state-controllers/space-controller-allocation-view-model-controller/actions";
// import { Column1ViewSelectors } from "../../../state-controllers/space-controller-allocation-view-model-controller/selectors"
// import { spaceContainerAllocationSearchModel } from "../../../models/advanced-search-models/space-container-allocation.model";

interface LocalState {
    deactivateAdd: boolean;
    deactivateList: boolean;
    selectedRow: any
}

@Component({
    selector: "intercompany-processing-queue-listing",
    templateUrl: "./intercompany-processing-queue-listing.component.html",
    styleUrls: ["./intercompany-processing-queue-listing.component.css"],
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [ComponentStore],
})

export class IntercompanyProcessingQueueListingComponent extends ViewColumnComponent {

    protected readonly index = 0;
    private localState: LocalState;
    protected subs = new SubSink();
    paging = new Pagination();

    toggleColumn$: Observable<boolean>;
    
    readonly localState$ = this.viewColFacade.selectLocalState(this.index);
    readonly deactivateAdd$ = this.componentStore.select(
      (state) => state.deactivateAdd
    );
    apiVisa = AppConfig.apiVisa;

    searchModel //= spaceContainerAllocationSearchModel;
    gridApi;
    gridColumnApi;
    public groupDisplayType: RowGroupingDisplayType = 'groupRows'
    ColumnViewSelectors //= Column1ViewSelectors;
    ColumnViewActions //= Column1ViewModelActions;

    defaultColDef = {
        filter: 'agTextColumnFilter',
        floatingFilterComponentParams: { suppressFilterButton: true },
        minWidth: 200,
        flex: 2,
        sortable: true,
        resizable: true,
        suppressCsvExport: true
    };

    columnsDefs = [
      { headerName: 'Source Doc Type', field: 'bl_fi_mst_intercompany_processing_queue.src_gendoc_server_doc_type', 
        cellStyle: () => ({ 'text-align': 'left' }), checkboxSelection: true,
        valueFormatter: (params) => params.value ? DocumentShortCodesClass.serverDocTypeToShortCodeMapper(params.value) : ""
      },
      { headerName: 'Source Doc No', field: 'bl_fi_mst_intercompany_processing_queue.src_gendoc_server_doc_1', cellStyle: () => ({ 'text-align': 'left' }) },
      { headerName: 'Target Doc Type', field: 'bl_fi_mst_intercompany_processing_queue.tgt_gendoc_server_doc_type', cellStyle: () => ({ 'text-align': 'left' }) ,
        valueFormatter: (params) => params.value ? DocumentShortCodesClass.serverDocTypeToShortCodeMapper(params.value) : ""
      },        
      { headerName: 'Used Config', field: 'configCode', cellStyle: () => ({ 'text-align': 'left' }) },        
      { 
        headerName: 'Created Date', 
        field: "bl_fi_mst_intercompany_processing_queue.created_date",
        cellStyle: () => ({ "text-align": "left" }),
        valueFormatter: (params) => moment(params.value).format("YYYY-MM-DD")
      },
      {   
        headerName: 'Last Update', 
        field: "bl_fi_mst_intercompany_processing_queue.updated_date",
        cellStyle: () => ({ "text-align": "left" }),
        valueFormatter: (params) => moment(params.value).format("YYYY-MM-DD")
      },
      { headerName: 'Status', field: 'bl_fi_mst_intercompany_processing_queue.status', cellStyle: () => ({ 'text-align': 'left' }) },
    ];


    @ViewChild(PaginationComponent) paginationComp: PaginationComponent;


    constructor(
        private viewColFacade: ViewColumnFacade,
        // public readonly viewModelStore: Store<ColumnViewModelStates>,
        private readonly componentStore: ComponentStore<LocalState>,
        private readonly queueService: IntercompanyProcessingQueueService,
        private readonly configService: BranchIntercompanySettingService,
        private readonly gendocService: GenericDocHdrService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.toggleColumn$ = this.viewColFacade.toggleColumn$;
        this.subs.sink = this.localState$.subscribe(a => {
            this.localState = a;
            this.componentStore.setState(a);
        });

       
    }

    retrieveData(pagination) {
      if (pagination) {
        const datasource = {
          getRows: this.getRowsFactory(pagination),
        };
        this.gridApi.setServerSideDatasource(datasource);
      }
    }
  
    getRowsFactory(pagination) {
      let offset = 0;
      let limit = 10;
  
  
      return (grid) => {
        if (!Object.keys(grid.request.filterModel).length) {
          offset = grid.request.startRow;
          limit = grid.request.endRow - offset;
        }
  
        this.subs.sink = this.queueService.getByCriteria(pagination, this.apiVisa)
        .pipe(
          mergeMap((resp) => {
            // console.log("queue resp", resp)
            const source: Observable<IntercompanyProcessingQueueContainer>[] = [];
            resp.data.forEach((queue) =>
              source.push(
                zip(
                  // generic doc
                  queue.bl_fi_mst_intercompany_processing_queue.branch_intercompany_settings_guid ?
                  this.configService
                    .getByGuid(
                      queue.bl_fi_mst_intercompany_processing_queue.branch_intercompany_settings_guid.toString(),
                      this.apiVisa
                    ).pipe(catchError((err) => of(err))) : of(null),
                      
                ).pipe(
                  map(([setting]) => {
                    // console.log("setting",setting)
                    queue = Object.assign(
                      {
                        configCode: setting ? setting.data.bl_fi_mst_branch_intercompany_setting.config_code : "",
                      },        
                      queue
                    );
                    return queue;
                  })
                )
              )
            );
            return iif(
              () => resp.data.length > 0,
              forkJoin(source).pipe(
                map((b_inner) => {
                  resp.data = b_inner;
                  return resp;
                })
              ),
              of(resp)
            );
          })
        )
        .subscribe(
          (rowData) => {
            console.log('rowData', rowData.data);
            const totalRecords = rowData.data.length;
            grid.successCallback(rowData.data, totalRecords);
          },
          () => {
            grid.failCallback();
          }
        );
      };
    }
  
    onGridReady(params) {
      params.columnApi.autoSizeAllColumns();
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      this.gridApi.closeToolPanel();    
      this.refreshListing();

    }

    refreshListing(){
      let pagination = new Pagination();
      pagination.conditionalCriteria = [
        { columnName: "order", operator: "=", value: "DESC" },
        { columnName: "orderBy", operator: "=", value: "updated_date"},
        { columnName: "src_gendoc_server_doc_types", operator: "=", value: "INTERNAL_SALES_RETURN_REQUEST"},
      ]
      this.retrieveData(pagination);

    }

    onToggle(e: boolean) {
        this.viewColFacade.toggleColumn(e);
    }

    
    manualIntercompanyTxnInit() {
      let docGuids = this.gridApi.getSelectedRows().map((recDoc) => recDoc.bl_fi_mst_intercompany_processing_queue.guid);
      console.log("docGuids", docGuids);
      if (docGuids && docGuids.length > 0) {
        let dto = {
          queueGuids : docGuids,
        };
  
        try {
          this.subs.sink = this.queueService.performManualIntercompanyTxn(dto, this.apiVisa)
            .pipe(
              catchError((e) => {
                let errorJson = {
                  message: e.error.code.toString(),
                };
                console.log("Error:", e.error.code);
                this.viewColFacade.showFailedToast(errorJson);
                return of(null); // returning an observable to avoid breaking the stream
              })
            )
            .subscribe((data) => {
              console.log("data", data);
              if (data && data.code === "OK_RESPONSE") {
                this.viewColFacade.showSuccessToast(
                  "Intercompany Transaction Successful"
                );
               this.refreshListing();
              }
            });
        } catch (error) {
          console.log("err", error);
        }
      } else {
        let error = {
          message: "Queues not selected."
        }
        this.viewColFacade.showFailedToast(error);
      }
    }

    setCriteria(columnName, value) {
        return { columnName, operator: "=", value };
    }

  onRowClicked(event:any){}

    getRowStyle = params => {
        if (params.node.footer || params.node.group) {
            return { fontWeight: 'bold' };
        }
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }
}