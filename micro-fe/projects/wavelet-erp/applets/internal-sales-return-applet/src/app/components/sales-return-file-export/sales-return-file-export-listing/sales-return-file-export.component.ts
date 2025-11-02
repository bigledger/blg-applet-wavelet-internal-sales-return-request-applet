import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  GenericDocFileExportService, GenericDocFileExportContainerModel, Pagination, GenericDocSearchCriteriaDtoModel,
} from 'blg-akaun-ts-lib';
import * as moment from 'moment';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { PaginationComponent } from 'projects/shared-utilities/utilities/pagination/pagination.component';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink2';
import { ToastrService } from 'ngx-toastr';
import { ViewColumnFacade } from '../../../facades/view-column.facade';
import { SalesReturnFileExportState } from '../../../state-controllers/sales-return-file-export-controller/store/states/sales-return-file-export.states';
import { SalesReturnFileExportActions } from '../../../state-controllers/sales-return-file-export-controller/store/actions';
import { DownloadDeleteButtonRendererComponent } from 'projects/shared-utilities/utilities/download-delete-button-renderer/download-delete-button-renderer.component';
import { Optional } from 'typescript-optional';

interface LocalState {
  deactivateAdd: boolean;
  deactivateList: boolean;
}

@Component({
  selector: 'app-sales-return-file-export-listing',
  templateUrl: './sales-return-file-export.component.html',
  styleUrls: ['./sales-return-file-export.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class SalesReturnFileExportListingComponent extends ViewColumnComponent implements OnInit, OnDestroy {

  private subs = new SubSink();

  protected readonly index = 0;
  private localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateAdd$ = this.componentStore.select(state => state.deactivateAdd);
  readonly appletSettings$ = this.sessionStore.select(SessionSelectors.selectMasterSettings);

  frameworkComponents: { buttonRenderer: any; };
  toggleColumn$: Observable<boolean>;
  gridApi;
  rowData = [];
  SQLGuids: string[] = null;
  pagination = new Pagination();
  defaultSelectionGuid;
  conditionList: GenericDocSearchCriteriaDtoModel;
  apiVisa = AppConfig.apiVisa;
  form: FormGroup;

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true,
  };

  columnsDefs = [
    { headerName: 'Report Name', field: 'bl_fi_generic_doc_file_export.file_name', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Doc Type', field: 'bl_fi_generic_doc_file_export.doc_type', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Status', field: 'bl_fi_generic_doc_file_export.process_status', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Error Message', field: 'bl_fi_generic_doc_file_export.error_message', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Created Date', field: 'bl_fi_generic_doc_file_export.created_date', cellStyle: () => ({ 'text-align': 'left' }),
      valueFormatter: (params) => moment(params.value).format('YYYY-MM-DD')
    },
    { headerName: 'Updated Date', field: 'bl_fi_generic_doc_file_export.updated_date', cellStyle: () => ({ 'text-align': 'left' }),
      valueFormatter: (params) => moment(params.value).format('YYYY-MM-DD')
    },
    {
      headerName: "Actions",
      field: "action",
      width: 60,
      cellStyle: () => ({ "text-align": "left" }),
      floatingFilter: false,
      valueGetter: (params) => params.data.bl_fi_generic_doc_file_export.file_guid,
      cellRenderer: "buttonRenderer",
      cellRendererParams: {
        onClick: this.onDownload.bind(this),
      },
    }
  ];

  @ViewChild(PaginationComponent) paginationComp: PaginationComponent;
  constructor(
    private reportService: GenericDocFileExportService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private viewColFacade: ViewColumnFacade,
    private readonly store: Store<SalesReturnFileExportState>,
    private readonly sessionStore: Store<SessionStates>,
    private readonly componentStore: ComponentStore<LocalState>,
  ) {
    super();
    this.frameworkComponents = {
      buttonRenderer: DownloadDeleteButtonRendererComponent
    };
  }

  ngOnInit() {
    this.toggleColumn$ = this.viewColFacade.toggleColumn$;
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });

    this.form = this.fb.group({
      date_txn_from: [''],
      date_txn_to: [''],
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.setGridData();
  }

  setGridData(){
    const apiVisa = AppConfig.apiVisa;
    const datasource = {
      getRows: (grid) => {
        const sortModel = grid.request.sortModel;
        const filterModel = grid.request.filterModel;
        this.pagination.offset = this.SQLGuids ? 0 : grid.request.startRow;
        this.pagination.limit = this.SQLGuids
          ? grid.request.endRow - grid.request.startRow
          : grid.request.endRow;
        this.pagination.conditionalCriteria = [
          { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
          { columnName: 'orderBy', operator: '=', value: 'updated_date' },
          { columnName: 'order', operator: '=', value: 'DESC' },
          { columnName: 'doc_type', operator: '=', value: 'INTERNAL_SALES_RETURN' },
          {
            columnName: 'guids',
            operator: '=',
            value: this.SQLGuids
              ? this.SQLGuids.slice(
                grid.request.startRow,
                grid.request.endRow
              ).toString()
              : '',
          },
        ];
        this.subs.sink = this.reportService
          .getByCriteria(this.pagination, apiVisa)
          .subscribe(
            (a) => {
              grid.success({
                rowData: a.data,
                rowCount: a.totalRecords,
              });
              this.store.dispatch(
                SalesReturnFileExportActions.loadSalesReturnFileExportSuccess({ totalRecords: a.totalRecords })
              );
            },
            (err) => {
              grid.fail();
              this.store.dispatch(
                SalesReturnFileExportActions.loadSalesReturnFileExportFailed({ error: err.message })
              );
            }
          );
      },
    };
    this.gridApi.setServerSideDatasource(datasource);
  }

  onNext() {
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState, deactivateAdd: true, deactivateList: true
    });
    this.viewColFacade.onNextAndReset(this.index, 1);
  }

  onRowClicked(entity: GenericDocFileExportContainerModel) {
    this.store.dispatch(
      SalesReturnFileExportActions.selectGuid({
        guid: entity.bl_fi_generic_doc_file_export.guid.toString(),
      })
    );
    this.store.dispatch(SalesReturnFileExportActions.createSalesReturnFileExportContainerDraftInit({ salesReturnFileExport: entity }));
    if (!this.localState.deactivateList) {
      this.viewColFacade.updateInstance(this.index, {
        ...this.localState,
        deactivateAdd: false,
        deactivateList: true,
      });
      this.viewColFacade.onNextAndReset(this.index, 2);
    }
  }

  onToggle(e: boolean) {
    this.viewColFacade.toggleColumn(e);
  }

  onReset() {
    this.viewColFacade.resetIndex(0);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  generateCSV(){
    this.conditionList = {};

    const date_txn_from = this.form.get('date_txn_from').value;
    if (date_txn_from !== '' && date_txn_from !== null) {
      const selectedDate = new Date(date_txn_from);
      const adjustedDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
      adjustedDate.setMilliseconds(1);
      const formattedDate = adjustedDate;
      this.conditionList.date_txn_from = formattedDate;
    }

    const date_txn_to = this.form.get('date_txn_to').value;
    if (date_txn_to !== '' && date_txn_to !== null){
      const selectedDate = new Date(date_txn_to);
      const adjustedDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
      adjustedDate.setUTCHours(23, 59, 59, 999);
      const formattedDate = adjustedDate;
      this.conditionList.date_txn_to = formattedDate;
    }
    
    this.subs.sink = this.reportService.generateGenericDocFile("internal-sales-returns",this.conditionList,this.apiVisa)
      .subscribe(
        (data) => {
          this.toaster.success(
            'The report is being generated.',
            'Success',
            {
              tapToDismiss: true,
              progressBar: true,
              timeOut: 1300
            }
          );
          this.gridApi.refreshServerSideStore();
          this.onReset();
        },
        (error) => {
          this.toaster.error(
            error.message,
            'Error',
            {
              tapToDismiss: true,
              progressBar: true,
              timeOut: 1300
            }
          );
        }
      );
    this.form.reset();
    this.conditionList = {};
  }

  onDownload(e) {
    const attachment = e.rowData.bl_fi_generic_doc_file_export;
    if(e.type === "Download"){
      this.subs.sink = this.reportService.downloadReport(attachment.guid, AppConfig.apiVisa)
      .subscribe((fileBlob: Blob) => {
        const fileUrl = URL.createObjectURL(fileBlob);
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = attachment.file_name;
        link.click();
        URL.revokeObjectURL(fileUrl);
      });
    } else {
      this.store.dispatch(SalesReturnFileExportActions.deleteSalesReturnFileExportInit({ guid: attachment.guid.toString() }));
      this.setGridData();
      this.gridApi.refreshServerSideStore();
      this.onReset();
    }
  }
}
