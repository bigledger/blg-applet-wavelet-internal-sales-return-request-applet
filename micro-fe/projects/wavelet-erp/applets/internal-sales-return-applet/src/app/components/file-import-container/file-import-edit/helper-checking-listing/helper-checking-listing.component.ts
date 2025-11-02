import { Component, ViewChild, AfterViewChecked } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Store } from "@ngrx/store";
import {
  Pagination,
  SalesReturnFileImportHelperContainerModel,
  SalesReturnFileImportHelperService,
} from "blg-akaun-ts-lib";
import moment from "moment";
import {
  pageFiltering,
  pageSorting,
} from "projects/shared-utilities/listing.utils";
import { PaginationComponent } from "projects/shared-utilities/utilities/pagination/pagination.component";
import { ViewColumnComponent } from "projects/shared-utilities/view-column.component";
import { AppConfig } from "projects/shared-utilities/visa";
import { Observable } from "rxjs";
import { SubSink } from "subsink2";
import { ViewColumnFacade } from "../../../../facades/view-column.facade";
import { FileImportSelectors } from "../../../../state-controllers/file-import-controller/store/selectors";
import { FileImportStates } from "../../../../state-controllers/file-import-controller/store/states";
import { ListingInputModel } from 'projects/shared-utilities/models/listing-input.model';
import { ListingService } from 'projects/shared-utilities/services/listing-service';
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';
import { PaginationV2Component } from 'projects/shared-utilities/utilities/pagination-v2/pagination-v2.component';
import { ToastrService } from 'ngx-toastr';
import { SearchQueryModel } from 'projects/shared-utilities/models/query.model';
import { ExportStatusBarComponent } from 'projects/shared-utilities/utilities/status-bar/export-status-bar.component';
import { GridOptions } from "ag-grid-enterprise";
import { MatTabGroup } from '@angular/material/tabs';
import { AppletSettings } from "../../../../models/applet-settings.model";
import { of, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';

interface LocalState {
  deactivateAdd: boolean;
  deactivateList: boolean;
  selectedRow: any;
  deactivateReturn: boolean;
  selectedIndex: number;
}

@Component({
  selector: "app-helper-checking-listing",
  templateUrl: "./helper-checking-listing.component.html",
  styleUrls: ["./helper-checking-listing.component.css"],
})
export class HelperCheckingListingComponent implements AfterViewChecked {
  protected compName = "Helper Checking Listing";
  protected readonly index = 3;
  private localState: LocalState;
  columnsDefs: any;
  searchQuery: SearchQueryModel;
  totalRecords = 0;
  limit = 50;
  // searchModel = helpercheckingSearchModel;
  orientation: boolean = false;
  @ViewChild(MatTabGroup) matTab: MatTabGroup;
  activeTabIndex: number = 0;
  expandedPanelIndex: number = 0;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateAdd$ = this.componentStore.select(
    (state) => state.localState.deactivateAdd
  );
  readonly deactivateList$ = this.componentStore.select(
    (state) => state.localState.deactivateList
  );
  readonly selectedIndex$ = this.componentStore.select(
    (state) => state.localState.selectedIndex
  );

  toggleColumn$: Observable<boolean>;
  apiVisa = AppConfig.apiVisa;

  private subSink = new SubSink();

  appletSettings: AppletSettings;
  appletSettings$ = combineLatest([
    this.sessionStore.select(SessionSelectors.selectMasterSettings),
    this.sessionStore.select(SessionSelectors.selectPersonalSettings)
  ]).pipe(map(([a, b]) => ({...a, ...b})));

  constructor(
    protected toastr: ToastrService,
    protected listingService: ListingService,
    private readonly store: Store<FileImportStates>,
    private readonly componentStore: ComponentStore<{ localState: LocalState }>,
    public sessionStore: Store<SessionStates>,
    private viewColFacade: ViewColumnFacade,
  ) {
  }

  ngOnInit() {
    this.toggleColumn$ = this.viewColFacade.toggleColumn$;

    this.localState$.subscribe((a) => {
      this.localState = a;
      this.componentStore.setState({ localState: a });
    });

    this.subSink.sink = this.appletSettings$.subscribe({
      next: (resolve: AppletSettings) => {
        this.appletSettings = resolve
      }
    });
  }

  showPanels(): boolean {
    if(this.appletSettings?.VERTICAL_ORIENTATION){
      if(this.appletSettings?.DEFAULT_ORIENTATION === 'HORIZONTAL'){
        this.orientation = false;
      } else {
        this.orientation = true;
      }
    } else {
      if(this.appletSettings?.DEFAULT_ORIENTATION === 'VERTICAL'){
        this.orientation = true;
      } else {
        this.orientation = false;
      }
    }
    return this.orientation;
  }

  panels = [
    { title: 'Error', content: 'error' },
    { title: 'All', content: 'all' }
  ];
  
  isTabSelected(tabLabel: string): boolean {
    return this.activeTabIndex === this.getTabIndexByLabel(tabLabel);
  }

  onTabChanged(event: any): void {
    this.activeTabIndex = event.index;
  }

  onPanelOpened(index: number): void {
    this.activeTabIndex = index;
  }

  getTabIndexByLabel(label: string): number {
    return label === 'All' ? 1 : 0;
  }

  ngAfterViewChecked() {
    if (this.matTab) {
      this.matTab.realignInkBar();
    }
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }
}
