import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { BranchPricingSchemeHdrLinkService, BranchService, Pagination, PricingSchemeContainerModel, PricingSchemeService } from 'blg-akaun-ts-lib';
import moment from 'moment';
import { pageFiltering, pageSorting } from 'projects/shared-utilities/listing.utils';
import { PaginationComponent } from 'projects/shared-utilities/utilities/pagination/pagination.component';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { BranchSettingsStates } from 'projects/wavelet-erp/applets/pos-general-applet/src/app/state-controllers/branch-settings-controller/states';
import { forkJoin, from, iif, of } from 'rxjs';
import { catchError, concatMap, map, mergeMap, tap, toArray } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../../../facades/view-column.facade';
import { BranchSettingsSelectors } from '../../../../../../state-controllers/branch-settings-controller/selectors';

interface LocalState {
    deactivateAdd: boolean;
    deactivateList: boolean;
    selectedRowIndex: number;
  }
  
@Component({
    selector: 'app-branch-pricing-scheme-listing',
    templateUrl: './listing.component.html',
    styleUrls: ['./listing.component.css'],
    encapsulation: ViewEncapsulation.None,
})

  
export class BranchPricingSchemeListingComponent  extends ViewColumnComponent {
    protected subs = new SubSink();
    protected readonly index = 0;
    protected localState: LocalState;
    rowData = [];
    gridApi;
    searchValue: any;
    @ViewChild(PaginationComponent) paginationComp: PaginationComponent;
    branchGuid;
    pagination = new Pagination();
    SQLGuids: string[] = null;
    branchMap: {guid: string, code: string, name: string}[] = [];
    apiVisa = AppConfig.apiVisa;
    columnsDefs;
    constructor(
      private pricingSchemeService: PricingSchemeService,
      private branchService: BranchService,
      private branchSettingsStore: Store<BranchSettingsStates>,
      private branchPricingService: BranchPricingSchemeHdrLinkService,
      private viewColFacade: ViewColumnFacade,
      private readonly componentStore: ComponentStore<LocalState>) {
      super();
      this.columnsDefs = [
        {headerName: 'Pricing Scheme', field: 'bl_fi_mst_branch_pricing_scheme_hdr_link.branch_name', cellStyle: () => ({'text-align': 'left'})},
        {headerName: 'Priority', field: 'bl_fi_mst_branch_pricing_scheme_hdr_link.level_value', cellStyle: () => ({'text-align': 'left'})},
        {headerName: 'Creation Date', field: 'bl_fi_mst_branch_pricing_scheme_hdr_link.created_date',
        valueFormatter: params => moment(params.value).format('YYYY-MM-DD')},
     
    
      ];
    }

    ngOnInit(): void {
      this.subs.sink = this.branchSettingsStore.select(BranchSettingsSelectors.selectBranch).subscribe(b=>{
        this.branchGuid = b.bl_fi_mst_branch.guid;
      })
    }
    
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridApi.closeToolPanel();
      this.gridApi.showNoRowsOverlay();
      const datasource = {
        getRows: grid => {
          this.pagination.offset = this.SQLGuids ? 0 : grid.request.startRow;
          this.pagination.limit =  this.paginationComp.rowPerPage; // this.SQLGuids ? grid.request.endRow - grid.request.startRow : grid.request.endRow;
          this.pagination.conditionalCriteria = [
            {columnName: 'calcTotalRecords', operator: '=', value: 'true'},
            {
              columnName: 'guid_branch',
              operator: '=',
              value: this.branchGuid
            }
          ];
  
          const sortModel = grid.request.sortModel;
          const filterModel = grid.request.filterModel;
          const sortOn = pageSorting(sortModel);
          const filter = pageFiltering(filterModel);
  
          this.subs.sink = this.branchPricingService.getByCriteria(this.pagination, this.apiVisa).pipe(
            mergeMap(a => from(a.data).pipe(
              concatMap(a_a => forkJoin([
                  iif(() => !!this.branchMap.find(s => s.guid === a_a.bl_fi_mst_branch_pricing_scheme_hdr_link.guid_pricing_scheme_hdr.toString()),
                    of(this.branchMap.find(s => s.guid === a_a.bl_fi_mst_branch_pricing_scheme_hdr_link.guid_pricing_scheme_hdr.toString())).pipe(
                      map(a_a_a => {
                        const container = new PricingSchemeContainerModel();
                        container.bl_fi_mst_pricing_scheme_hdr.guid = a_a_a.guid;
                        container.bl_fi_mst_pricing_scheme_hdr.code = a_a_a.code;
                        container.bl_fi_mst_pricing_scheme_hdr.name = a_a_a.name;
                        return container;
                      })
                    ),
                    this.pricingSchemeService.getByGuid(a_a.bl_fi_mst_branch_pricing_scheme_hdr_link.guid_pricing_scheme_hdr.toString(), this.apiVisa).pipe(
                      tap(a_a_b => this.branchMap.push({guid: a_a_b.data.bl_fi_mst_pricing_scheme_hdr.guid.toString(),
                        code: a_a_b.data.bl_fi_mst_pricing_scheme_hdr.code.toString(),
                        name: a_a_b.data.bl_fi_mst_pricing_scheme_hdr.name.toString()})),
                      map(a_a_c => a_a_c.data),
                      catchError((err) => of(err))
                    )
                  ),
                  
                ]
                ).pipe(
                map(([b_a]) => {
                 
                  Object.assign(a_a.bl_fi_mst_branch_pricing_scheme_hdr_link,
                    {
                      branch_name: b_a.error ? b_a.error.code : b_a.bl_fi_mst_pricing_scheme_hdr.code + ' | ' + b_a.bl_fi_mst_pricing_scheme_hdr.name,
                    });
                  return a_a;
                })
                )
              ),
              toArray(),
              map(b => {
                a.data = b;
                return a;
              })
              )
            )
          ).subscribe(resolved => {
            //console.log('resolved',resolved)
            const data = sortOn(resolved.data).filter(entity => filter.by(entity));
          //  console.log('data',data)
            const totalRecords = filter.isFiltering ? resolved.totalRecords : data.length;
          //  console.log('totalRecords',totalRecords)
            grid.success({
              rowData: data,
              rowCount: this.SQLGuids ? this.SQLGuids.length : resolved.totalRecords
            });
          }, err => {
          //  console.log('err',err)
            grid.fail();
          });
        }
      };
  
      this.gridApi.setServerSideDatasource(datasource);
    }

    onAdd() {
      this.viewColFacade.onNext(4)
    }

    onRowClicked(e){
      //this.store.dispatch(PosActions.selectBranchPricingScheme({pricingScheme:e}));
      this.viewColFacade.updateInstance(5, {
        data: e,
      });
      this.viewColFacade.onNext(5)

    }

    quickSearch() {
      this.gridApi.setQuickFilter(this.searchValue);
    }
  }