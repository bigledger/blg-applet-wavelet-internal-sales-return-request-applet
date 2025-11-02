import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { MembershipCardContainerModel, MembershipCardService, Pagination, SubQueryService } from 'blg-akaun-ts-lib';
import { pageFiltering, pageSorting } from 'projects/shared-utilities/listing.utils';
import { SearchQueryModel } from 'projects/shared-utilities/models/query.model';
import { PaginationComponent } from 'projects/shared-utilities/utilities/pagination/pagination.component';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../../facades/view-column.facade';
import { memberSearchModel } from '../../../../../models/advanced-search-models/member.model';
import { InternalSalesReturnStates } from '../../../../../state-controllers/internal-sales-return-controller/store/states';
import { InternalSalesReturnActions } from '../../../../../state-controllers/internal-sales-return-controller/store/actions';

interface LocalState {
  deactivateAdd: boolean;
  deactivateList: boolean;
  deactivateReturn: boolean;
  selectedRow: any;
}

@Component({
  selector: 'app-internal-sales-return-select-member',
  templateUrl: './select-member.component.html',
  styleUrls: ['./select-member.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class MainDetailsSelectMemberComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Select Member';
  protected readonly index = 3;
  protected localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateAdd$ = this.componentStore.select(state => state.deactivateAdd);
  readonly deactivateList$ = this.componentStore.select(state => state.deactivateList);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);

  prevIndex: number;
  protected prevLocalState: any;

  // change search model
  searchModel = memberSearchModel;

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true
  };

  gridApi;

  columnsDefs = [
    {
      headerName: 'Member card ID', field: 'bl_crm_membership_hdr.card_no', cellStyle: () => ({ 'text-align': 'left' })
      , floatingFilter: true
    },
    {
      headerName: 'Member Name', field: 'bl_crm_membership_hdr.name', cellStyle: () => ({ 'text-align': 'left' })
      , floatingFilter: true
    },
    {
      headerName: 'Mobile Number', field: 'bl_crm_membership_hdr.phone', cellStyle: () => ({ 'text-align': 'left' })
      , floatingFilter: true
    },
  ];

  SQLGuids: string[] = null;
  pagination = new Pagination();

  @ViewChild(PaginationComponent) paginationComp: PaginationComponent;

  constructor(
    protected viewColFacade: ViewColumnFacade,
    private sqlService: SubQueryService,
    protected memberService: MembershipCardService,
    protected store: Store<InternalSalesReturnStates>,
    protected readonly componentStore: ComponentStore<LocalState>) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => { this.prevIndex = resolve });
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
  }

  onAdd() {
    // TODO: add simple customer creation
    this.viewColFacade.gotoFourOhFour();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.setGridData();
  }

  setGridData() {
    const apiVisa = AppConfig.apiVisa;
    const datasource = {
      getRows: grid => {
        const filter = pageFiltering(grid.request.filterModel);
        const sortOn = pageSorting(grid.request.sortModel);
        this.pagination.offset = this.SQLGuids ? 0 : grid.request.startRow;
        this.pagination.limit = grid.request.endRow - grid.request.startRow;
        this.pagination.conditionalCriteria = [
          { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
          { columnName: 'orderBy', operator: '=', value: 'updated_date' },
          { columnName: 'order', operator: '=', value: 'DESC' },
          {
            columnName: 'guids', operator: '=',
            value: this.SQLGuids ? this.SQLGuids.slice(grid.request.startRow, grid.request.endRow).toString() : ''
          }
        ];
        this.subs.sink = this.memberService.getByCriteria(this.pagination, apiVisa).subscribe(resolved => {
          const data = sortOn(resolved.data).filter(entity => filter.by(entity));
          const totalRecords = filter.isFiltering ? resolved.totalRecords : data.length;
          grid.success({
            rowData: data,
            rowCount: totalRecords
          });
          // this.gridApi.forEachNode(a => {
          //   if (a.data.bl_crm_membership_hdr.guid === this.localState.selectedRow) {
          //     a.setSelected(true);
          //   }
          // });
        }, err => {
          grid.fail();
        });

      }
    };
    this.gridApi.setServerSideDatasource(datasource);
  }

  onSearch(e: SearchQueryModel) {
    if (!e.isEmpty) {
      const sql = {
        subquery: e.queryString,
        table: e.table
      };
      this.subs.sink = this.sqlService.post(sql, AppConfig.apiVisa).subscribe(
        {
          next: resolve => {
            this.SQLGuids = resolve.data;
            this.paginationComp.firstPage();
            this.gridApi.refreshServerSideStore();
          }
        }
      );
    } else {
      this.SQLGuids = null;
      this.paginationComp.firstPage();
      this.gridApi.refreshServerSideStore();
    }
  }

  onToggle(e: boolean) {
    this.viewColFacade.toggleColumn(e);
  }

  onRowClicked(member: MembershipCardContainerModel) {
    if (member) {
      this.viewColFacade.selectMember(member);
    }
  }

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateReturn: false,
      deactivateMember: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
