import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ComponentStore } from '@ngrx/component-store';
import { CompanyWorkflowGendocProcessContainerModel, Pagination, SubQueryService } from 'blg-akaun-ts-lib';
import { Observable, of } from 'rxjs';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { SubSink } from 'subsink2';
import { SearchQueryModel } from 'projects/shared-utilities/models/query.model';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { PaginationClientSideComponent } from 'projects/shared-utilities/utilities/pagination-client-side/pagination-client-side.component';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from 'projects/shared-utilities/visa';
import { WorkflowStates } from '../../../../state-controllers/workflow-controller/store/states';
import { WorkflowSelectors } from '../../../../state-controllers/workflow-controller/store/selectors';
import { WorkflowActions } from '../../../../state-controllers/workflow-controller/store/actions';
import moment from 'moment';
import { companyWorkflowSearchModel } from '../../../../models/advanced-search-models/company-workflow.model';


interface LocalState {
  deactivateAdd: boolean;
  deactivateList: boolean;
  rowIndexList: number;
  selectedRow: any;
}
@Component({
  selector: 'app-company-listing',
  templateUrl: './company-listing.component.html',
  styleUrls: ['./company-listing.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})

export class CompanyListingComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Company Listing';
  protected readonly index = 0;
  protected localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateAdd$ = this.componentStore.select(state => state.deactivateAdd);
  readonly deactivateList$ = this.componentStore.select(state => state.deactivateList);
  readonly rowIndexList$ = this.componentStore.select(state => state.rowIndexList);

  toggleColumn$: Observable<boolean>;
  searchModel = companyWorkflowSearchModel;

  appletGuid = sessionStorage.getItem('appletGuid');

  arraySize = [];
  arrayData = [];
  arrayPromise = [];

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true
  };

  gridApi;
  SQLGuids: string[] = null;
  pagination = new Pagination();
  companyListing$: Observable<CompanyWorkflowGendocProcessContainerModel[]>;

  columnsDefs = [
    {
      headerName: 'Company Code', field: 'companyCode', width: 110, suppressSizeToFit: true,
      cellStyle: () => ({ 'text-align': 'left' })
    },
    {
      headerName: 'Process Code ', field: 'processhdrcode', width: 110, suppressSizeToFit: true,
      cellStyle: () => ({ 'text-align': 'left' })
    },
    {
      headerName: 'Server Doc Type', field: 'bl_fi_comp_workflow_gendoc_process_template_hdr.server_doc_type', suppressSizeToFit: false,
      cellStyle: () => ({ 'text-align': 'left' })
    },
    {
      headerName: 'Creation Date', field: 'bl_fi_comp_workflow_gendoc_process_template_hdr.created_date', width: 110, suppressSizeToFit: true,
      cellStyle: () => ({ 'text-align': 'left' }), valueFormatter: params => moment(params.value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      headerName: 'Modified Date', field: 'bl_fi_comp_workflow_gendoc_process_template_hdr.updated_date', sort: 'desc', width: 110, suppressSizeToFit: true,
      cellStyle: () => ({ 'text-align': 'left' }), valueFormatter: params => moment(params.value).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  @ViewChild(PaginationClientSideComponent) paginationComp: PaginationClientSideComponent;
  selectedRowIndex: number;
  numOfRows: any;

  constructor(
    private viewColFacade: ViewColumnFacade,
    private store: Store<WorkflowStates>,
    private subQueryService: SubQueryService,
    private toastr: ToastrService,
    private readonly componentStore: ComponentStore<LocalState>) {
    super();
  }

  ngOnInit() {
    this.toggleColumn$ = this.viewColFacade.toggleColumn$;
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.subs.sink = this.store.select(WorkflowSelectors.selectAgGrid)
    .subscribe(a => {
      console.log("TESTTTT:111", a);
      if (a) {
        this.store.dispatch(
          WorkflowActions.loadCompanyInit({
            pagination: new Pagination(0, 50,
              [ 
                { columnName: 'applet_guid', operator: '=', value: this.appletGuid.toString()},
                { columnName: 'orderBy', operator: '=', value: 'updated_date' },
                { columnName: 'order', operator: '=', value: 'DESC' },
              ]),
          })
        );
        this.companyListing$ = this.store.select(WorkflowSelectors.selectListCompanyWorkflow); 
        this.companyListing$.subscribe(test => {
          this.store.dispatch(WorkflowActions.resetAgGrid());
        })
      }
    });
  }

  getNumberOfPages(e){
    console.log(e);
    this.numOfRows=e;
    if(e>50){
     this.store.dispatch(WorkflowActions.loadCompanyInit({pagination: new Pagination(0,e)}));
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.companyListing$ = this.store.select(WorkflowSelectors.selectListCompanyWorkflow);
  }

  onToggle(e: boolean) {
    this.viewColFacade.toggleColumn(e);
  }

  onRowClicked(entity: CompanyWorkflowGendocProcessContainerModel) {
   const genDoc = { ...entity };
    delete genDoc['createdBy'];
    delete genDoc['updatedBy'];
    delete genDoc['processCode'];
    delete genDoc['companyCode'];
    delete genDoc['processhdrcode'];
    // this.selectedRowIndex = entity.rowIndex;
    if (entity) {
      this.store.dispatch(WorkflowActions.selectCompanyWorkflow({companyWorkflow: genDoc }));
      if (!this.localState.deactivateList) {
        this.viewColFacade.updateInstance(this.index, {
          ...this.localState, deactivateAdd: true, deactivateList: true, rowIndexList: this.selectedRowIndex
        });
        this.viewColFacade.onNextAndReset(this.index, 2);
      }
    }
  }

  onSearch(e: SearchQueryModel) {
    if (!e.isEmpty) {
      const sql = {
        subquery: e.queryString,
        table: e.table
      };
      this.subs.sink = this.subQueryService.post(sql, AppConfig.apiVisa).subscribe({
        next: resolve => {
          this.SQLGuids = resolve.data;
          if(this.SQLGuids.length!==0 || this.SQLGuids.length<=50){
            console.log("this.SQLGuids",  this.SQLGuids);
            console.log("Executing SQL");
            this.pagination.conditionalCriteria = [
              {
                columnName: 'guids', operator: '=',
                value: this.SQLGuids.toString()
              },
              { columnName: 'applet_guid', operator: '=', value: this.appletGuid.toString()},
              { columnName: 'orderBy', operator: '=', value: 'updated_date' },
              { columnName: 'order', operator: '=', value: 'DESC' },
            ];
            console.log("this.pagination",  this.pagination);
            this.store.dispatch(WorkflowActions.loadCompanyInit({pagination: this.pagination}))
          }else
          {
            this.toastr.error("Result Set Too Large. Please Refine Search", "Error", {
              tapToDismiss: true,
              progressBar: true,
              timeOut: 2000,
            });
          }
        }
      });
    } else {
      console.log("Executing : NULL SQL");
      this.SQLGuids = null;
      this.store.dispatch(WorkflowActions.loadCompanyInit({pagination: new Pagination(0,50,
        [
          { columnName: 'applet_guid', operator: '=', value: this.appletGuid.toString()},
          { columnName: 'orderBy', operator: '=', value: 'updated_date' },
          { columnName: 'order', operator: '=', value: 'DESC' },
        ])}));
    }
  }

  onNext(){
    console.log("TODO Next Page");
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState, deactivateAdd: true, deactivateList: true
    });
    this.viewColFacade.onNextAndReset(this.index, 1);
  }

 
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
