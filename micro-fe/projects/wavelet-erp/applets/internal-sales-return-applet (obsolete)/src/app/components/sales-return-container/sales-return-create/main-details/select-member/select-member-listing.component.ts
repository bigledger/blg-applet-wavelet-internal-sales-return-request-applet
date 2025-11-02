import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ComponentStore } from '@ngrx/component-store';
import { MembershipCardContainerModel, Pagination, MembershipCardService, SubQueryService } from 'blg-akaun-ts-lib';
import { ViewColumnFacade } from '../../../../../facades/view-column.facade';
import { AppConfig } from 'projects/shared-utilities/visa';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { SubSink } from 'subsink2';
import { SalesReturnStates } from '../../../../../state-controllers/sales-return-controller/store/states';
import { SalesReturnActions } from '../../../../../state-controllers/sales-return-controller/store/actions';
import { memberSearchModel } from '../../../../../models/advanced-search-models/member.model';
import { PaginationComponent } from 'projects/shared-utilities/utilities/pagination/pagination.component';
import { pageFiltering, pageSorting } from 'projects/shared-utilities/listing.utils';
import { SearchQueryModel } from 'projects/shared-utilities/models/query.model';

interface LocalState {
  deactivateReturn: boolean;
}

@Component({
  selector: 'app-sales-return-main-select-member',
  templateUrl: './select-member-listing.component.html',
  styleUrls: ['./select-member-listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class MainSelectMemberListingComponent extends ViewColumnComponent {
  
  protected subs = new SubSink();
  
  protected compName = 'Main Select Member Listing';
  protected readonly index = 18;
  protected localState: LocalState;
  protected prevLocalState: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);

  searchModel = memberSearchModel;
  prevIndex: number;
  SQLGuids: string[] = null;
  pagination = new Pagination();
  gridApi;

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: {suppressFilterButton: true},
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true
  };

  columnsDefs = [
    { headerName: 'Member ID', field: 'bl_crm_membership_hdr.card_no', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Member Name', field: 'bl_crm_membership_hdr.name', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Member Number', field: 'bl_crm_membership_hdr.phone', cellStyle: () => ({ 'text-align': 'left'}) },
  ];

  @ViewChild(PaginationComponent) paginationComp: PaginationComponent;

  constructor(
    private viewColFacade: ViewColumnFacade,
    private readonly store: Store<SalesReturnStates>,
    private membercardService: MembershipCardService,
    private subQueryService: SubQueryService,
    private readonly componentStore: ComponentStore<LocalState>) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
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
          { columnName: 'hdr_guids', operator: '=',
            value: this.SQLGuids ? this.SQLGuids.slice(grid.request.startRow, grid.request.endRow).toString() : ''
          }
        ];
        this.subs.sink = this.membercardService.getByCriteria(this.pagination, apiVisa).subscribe(resolved => {
          const data = sortOn(resolved.data).filter(entity => filter.by(entity));
          const totalRecords = filter.isFiltering ? (this.SQLGuids ? this.SQLGuids.length : resolved.totalRecords) : data.length;
          grid.success({
            rowData: data,
            rowCount: totalRecords
          });
        }, err => {
          grid.fail();
        });
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
  }

  onReturn() {
    this.viewColFacade.updateInstance<LocalState>(this.prevIndex, {
      ...this.prevLocalState,
      deactivateReturn: false,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  onRowClicked(member: MembershipCardContainerModel) {
    if (member) {
      console.log("member", member);
        this.store.dispatch(SalesReturnActions.selectMember({ 
            guid: member.bl_crm_membership_hdr.guid.toString(),
            cardNo: member.bl_crm_membership_hdr.card_no.toString(),
            name: member.bl_crm_membership_hdr.name.toString()
        }));
    }
  }

  onSearch(e: SearchQueryModel) {
    if (!e.isEmpty) {
      const sql = {
        subquery: e.queryString,
        table: e.table
      };
      this.subs.sink = this.subQueryService.post(sql, AppConfig.apiVisa).subscribe({ next: resolve => {
        this.SQLGuids = resolve.data;
        this.paginationComp.firstPage();
        this.gridApi.refreshServerSideStore();
      }});
    } else {
      this.SQLGuids = null;
      this.paginationComp.firstPage();
      this.gridApi.refreshServerSideStore();
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}