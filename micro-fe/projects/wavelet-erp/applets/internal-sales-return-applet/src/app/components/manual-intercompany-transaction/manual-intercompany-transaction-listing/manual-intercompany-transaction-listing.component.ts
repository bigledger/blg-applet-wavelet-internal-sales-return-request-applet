import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { ViewColumnComponent } from "projects/shared-utilities/view-column.component";
import { SearchQueryModel } from "projects/shared-utilities/models/query.model";
import { Observable, zip, of, iif, forkJoin, combineLatest } from 'rxjs';
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
import { ViewColumnFacade } from "../../../facades/view-column.facade";
import {
  WarehouseLayoutNodeContainerLinkModel,
  WarehouseLayoutNodeContainerLinkService,
  WarehouseContainerService,
  WarehouseLayoutNodeHdrService,
    bl_wms_grn_hdr_RowClass
  } from "blg-akaun-ts-lib";
import { AppConfig } from 'projects/shared-utilities/visa';
import { AppletSettings } from '../../../models/applet-settings.model';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';

interface LocalState {
    deactivateAdd: boolean;
    deactivateList: boolean;
    selectedRow: any
}

@Component({
    selector: "manual-intercompany-transaction-listing",
    templateUrl: "./manual-intercompany-transaction-listing.component.html",
    styleUrls: ["./manual-intercompany-transaction-listing.component.css"],
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [ComponentStore],
})

export class ManualIntercompanyTransactionListingComponent extends ViewColumnComponent {

    protected readonly index = 0;
    private localState: LocalState;
    protected subs = new SubSink();
    appletSettings: AppletSettings;
    orientation: boolean = false;
    
    appletSettings$ = combineLatest([
      this.sessionStore.select(SessionSelectors.selectMasterSettings),
      this.sessionStore.select(SessionSelectors.selectPersonalSettings)
    ]).pipe(map(([a, b]) => ({...a, ...b})));

    readonly localState$ = this.viewColFacade.selectLocalState(this.index);
    readonly deactivateAdd$ = this.componentStore.select(
      (state) => state.deactivateAdd
    );

    constructor(
        private viewColFacade: ViewColumnFacade,
        private readonly componentStore: ComponentStore<LocalState>,
        private readonly sessionStore: Store<SessionStates>
    ) {
        super();
    }

    ngOnInit(): void {
        this.subs.sink = this.localState$.subscribe(a => {
            this.localState = a;
            this.componentStore.setState(a);
        });

        this.subs.sink = this.appletSettings$.subscribe(resolve => {
          this.appletSettings = resolve;
        })
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    showPanels(): boolean {
      if(this.appletSettings?.VERTICAL_ORIENTATION){
        if(this.appletSettings?.DEFAULT_ORIENTATION === 'HORIZONTAL' || this.appletSettings?.DEFAULT_ORIENTATION === null){
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
}