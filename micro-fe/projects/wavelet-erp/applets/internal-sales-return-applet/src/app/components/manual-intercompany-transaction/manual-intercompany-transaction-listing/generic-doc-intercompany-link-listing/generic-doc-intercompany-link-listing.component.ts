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
  GenericDocIntercompanyLinkContainer,
  GenericDocIntercompanyLinkService,
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
    selector: "generic-doc-intercompany-link-listing",
    templateUrl: "./generic-doc-intercompany-link-listing.component.html",
    styleUrls: ["./generic-doc-intercompany-link-listing.component.css"],
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [ComponentStore],
})

export class GenericDocumentIntercompanyLinkListingComponent extends ViewColumnComponent {

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
      { headerName: 'Source Doc Type', field: 'bl_fi_generic_doc_intercompany_link.src_gendoc_server_doc_type', cellStyle: () => ({ 'text-align': 'left' }),
        valueFormatter: (params) => params.value ? DocumentShortCodesClass.serverDocTypeToShortCodeMapper(params.value) : ""
      },
      { headerName: 'Source Doc No', field: 'bl_fi_generic_doc_intercompany_link.src_gendoc_server_doc_1', cellStyle: () => ({ 'text-align': 'left' }) },
      { headerName: 'Target Doc Type', field: 'bl_fi_generic_doc_intercompany_link.tgt_gendoc_server_doc_type', cellStyle: () => ({ 'text-align': 'left' }),
        valueFormatter: (params) => params.value ? DocumentShortCodesClass.serverDocTypeToShortCodeMapper(params.value) : ""
      },
      { headerName: 'Target Doc No', field: 'bl_fi_generic_doc_intercompany_link.tgt_gendoc_server_doc_1', cellStyle: () => ({ 'text-align': 'left' }) },        
      { headerName: 'Used Config', field: 'configCode', cellStyle: () => ({ 'text-align': 'left' }) },        
      { 
        headerName: 'Created Date', 
        field: "bl_fi_generic_doc_intercompany_link.created_date",
        cellStyle: () => ({ "text-align": "left" }),
        valueFormatter: (params) => moment(params.value).format("YYYY-MM-DD")
      },
      {   
        headerName: 'Last Update', 
        field: "bl_fi_generic_doc_intercompany_link.updated_date",
        cellStyle: () => ({ "text-align": "left" }),
        valueFormatter: (params) => moment(params.value).format("YYYY-MM-DD")
      },
      { headerName: 'Status', field: 'bl_fi_generic_doc_intercompany_link.status', cellStyle: () => ({ 'text-align': 'left' }) },
    ];


    @ViewChild(PaginationComponent) paginationComp: PaginationComponent;


    constructor(
        private viewColFacade: ViewColumnFacade,
        // public readonly viewModelStore: Store<ColumnViewModelStates>,
        private readonly componentStore: ComponentStore<LocalState>,
        private readonly linkService: GenericDocIntercompanyLinkService,
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
  
        this.subs.sink = this.linkService.getByCriteria(pagination, this.apiVisa)
        .pipe(
          mergeMap((resp) => {
            // console.log("queue resp", resp)
            const source: Observable<GenericDocIntercompanyLinkContainer>[] = [];
            resp.data.forEach((link) =>
              source.push(
                zip(
                  // generic doc
                  link.bl_fi_generic_doc_intercompany_link.branch_intercompany_settings_guid ?
                  this.configService
                    .getByGuid(
                      link.bl_fi_generic_doc_intercompany_link.branch_intercompany_settings_guid.toString(),
                      this.apiVisa
                    ).pipe(catchError((err) => of(err))) : of(null),
                      
                ).pipe(
                  map(([setting]) => {
                    // console.log("setting",setting)
                    link = Object.assign(
                      {
                        configCode: setting ? setting.data.bl_fi_mst_branch_intercompany_setting.config_code : "",
                      },        
                      link
                    );
                    return link;
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

    
    
    onSearch(e: any) {
      console.log("from advanced search", e)
      let pagination = new Pagination();
      pagination.conditionalCriteria = [
        { columnName: "order", operator: "=", value: "DESC" },
        { columnName: "orderBy", operator: "=", value: "updated_date"},
      ]
      if(e.wmsContainerGuids !== undefined && e.wmsContainerGuids !== null && e.wmsContainerGuids.length>0){
        pagination.conditionalCriteria.push(
          { columnName: "container_hdr_guids", operator: "=", value: e.wmsContainerGuids },
        )
      }
      if(e.wmsLayoutNodeGuids !== undefined && e.wmsLayoutNodeGuids !== null && e.wmsLayoutNodeGuids.length>0){
        pagination.conditionalCriteria.push(
          { columnName: "layout_node_hdr_guids", operator: "=", value: e.wmsLayoutNodeGuids },
        )
      }
      if(e.keyWordSearch !== undefined && e.keyWordSearch !== null){
        pagination.conditionalCriteria.push(
          { columnName: "search_word", operator: "=", value: e.keyWordSearch },
        )
      }
      this.retrieveData(pagination);
      
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