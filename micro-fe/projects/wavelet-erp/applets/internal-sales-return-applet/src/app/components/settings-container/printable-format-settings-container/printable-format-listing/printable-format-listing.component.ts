import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { Pagination, PrintableFormatContainerModel, PrintableFormatService, TenantUserProfileService } from 'blg-akaun-ts-lib';
import * as moment from 'moment';
import { pageFiltering, pageSorting } from 'projects/shared-utilities/listing.utils';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { forkJoin, iif, Observable, of, zip } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { AppletConstants } from '../../../../models/constants/applet-constants';
import { PrintableFormatActions } from '../../../../state-controllers/printable-format-controller/store/actions';
import { PrintableFormatSelectors } from '../../../../state-controllers/printable-format-controller/store/selectors';
import { PrintableFormatStates } from '../../../../state-controllers/printable-format-controller/store/states';

interface LocalState {
  deactivateAdd: boolean;
  deactivateList: boolean;
}

@Component({
  selector: 'app-printable-format-listing',
  templateUrl: './printable-format-listing.component.html',
  styleUrls: ['./printable-format-listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class PrintableFormatListingComponent extends ViewColumnComponent {

  private subs = new SubSink();

  protected readonly index = 0;
  private localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateAdd$ = this.componentStore.select(state => state.deactivateAdd);
  readonly appletSettings$ = this.sessionStore.select(SessionSelectors.selectMasterSettings);

  toggleColumn$: Observable<boolean>;
  gridApi;
  rowData = [];
  SQLGuids: string[] = null;
  pagination = new Pagination();
  defaultSelectionGuid;

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
    { headerName: 'Default Selection', field: 'default_selection', checkboxSelection: true },
    { headerName: 'Format Code', field: 'bl_prt_printable_format_hdr.code', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Format Name', field: 'bl_prt_printable_format_hdr.name', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'File Name', field: 'bl_prt_printable_format_hdr.property_json.fileAttributes.fileName', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'File Size', field: 'bl_prt_printable_format_hdr.property_json.fileAttributes.size', cellStyle: () => ({ 'text-align': 'left' }) },
    {
      headerName: 'Uploaded Date', field: 'bl_prt_printable_format_hdr.updated_date', type: 'rightAligned',
      valueFormatter: (params) => moment(params.value).format('YYYY-MM-DD')
    },
    { headerName: 'Uploaded By', field: 'uploaded_by_name', cellStyle: () => ({ 'text-align': 'left' }) },
  ];

  constructor(
    private printableFormatService: PrintableFormatService,
    private profileService: TenantUserProfileService,
    private viewColFacade: ViewColumnFacade,
    private readonly printableStore: Store<PrintableFormatStates>,
    private readonly sessionStore: Store<SessionStates>,
    private readonly componentStore: ComponentStore<LocalState>
  ) {
    super()
  }

  ngOnInit() {
    this.toggleColumn$ = this.viewColFacade.toggleColumn$;
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.subs.sink = this.appletSettings$.subscribe(settings => {
      this.defaultSelectionGuid = settings?.PRINTABLE;
    })
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.setGridData()
  }

  setGridData() {
    const apiVisa = AppConfig.apiVisa;
    const datasource = {
      getRows: grid => {
        this.printableStore.dispatch(PrintableFormatActions.loadPrintableFormatInit({ request: grid.request }));
        const filter = pageFiltering(grid.request.filterModel);
        const sortOn = pageSorting(grid.request.sortModel);
        this.pagination.offset = this.SQLGuids ? 0 : grid.request.startRow;
        this.pagination.limit = grid.request.endRow - grid.request.startRow;
        this.pagination.conditionalCriteria = [
          { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
          { columnName: 'txn_type', operator: '=', value: AppletConstants.docType },
        ];

        this.subs.sink = this.printableFormatService.getByCriteria(this.pagination, apiVisa)
          .pipe(
            mergeMap(b => {
              const source: Observable<any>[] = []
              b.data.forEach(printableFormatContainer => {
                source.push(
                  zip(
                    this.profileService.getProfileName(AppConfig.apiVisa, printableFormatContainer.bl_prt_printable_format_hdr.updated_by_subject_guid?.toString()).pipe(
                      catchError((err) => of(err))),
                    this.printableFormatService.getFile(printableFormatContainer.bl_prt_printable_format_exts[0].guid?.toString(), AppConfig.apiVisa).pipe(
                      catchError((err) => of(err))),
                  ).pipe(
                    map(([b_a, b_b]) => {
                      const hdrPropertyJson = <any>printableFormatContainer.bl_prt_printable_format_hdr.property_json;
                      printableFormatContainer = Object.assign({
                        uploaded_by_name: b_a.error ? null : b_a.data,
                        file: b_b.error ? null : new File([b_b], hdrPropertyJson.fileAttributes?.fileName ? hdrPropertyJson.fileAttributes.fileName : null),
                      }, printableFormatContainer);
                      return printableFormatContainer;
                    }
                    )
                  ))
              })
              return iif(() => b.data.length > 0,
                forkJoin(source).pipe(map((b_inner) => {
                  b.data = b_inner;
                  return b
                })),
                of(b)
              );
            })
          ).subscribe(
            (resolved: any) => {
              this.printableStore.dispatch(PrintableFormatActions.loadPrintableFormatSuccess({ totalRecords: resolved.totalRecords }));
              const data = sortOn(resolved.data).filter(entity => filter.by(entity));
              const totalRecords = filter.isFiltering ? resolved.totalRecords : data.length;
              grid.success({
                rowData: data,
                rowCount: totalRecords
              });
              this.gridApi.forEachNode(a => {
                if (a.data && a.data.bl_prt_printable_format_hdr?.guid === this.defaultSelectionGuid) {
                  a.setSelected(true);
                }
              });
            }, err => {
              this.printableStore.dispatch(PrintableFormatActions.loadPrintableFormatFailed({ error: err.message }));
              grid.fail();
            });
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
    this.subs.sink = this.printableStore.select(PrintableFormatSelectors.selectAgGrid).subscribe(a => {
      if (a) {
        this.gridApi.refreshServerSideStore({ purge: true });
        this.printableStore.dispatch(PrintableFormatActions.resetAgGrid());
      }
    });
  }

  onNext() {
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState, deactivateAdd: true, deactivateList: true
    });
    this.viewColFacade.onNextAndReset(this.index, 1);
  }

  onRowClicked(entity: PrintableFormatContainerModel) {
    if (entity && !this.localState.deactivateList) {
      console.log(entity)
      const printableFormat = { ...entity };
      delete printableFormat['uploaded_by_name'];
      this.printableStore.dispatch(PrintableFormatActions.selectPrintableFormatForEdit({ printableFormat }));
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
      const selectedGuid = event.api.getSelectedRows()[0].bl_prt_printable_format_hdr.guid.toString();
      this.printableStore.dispatch(PrintableFormatActions.selectDefaultPrintableFormat({ defaultPrintableFormatGuid: selectedGuid }))
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}