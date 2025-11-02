import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { containerAnim } from "projects/shared-utilities/modules/layout/animations/animations";
import { containerTemplate } from "projects/shared-utilities/modules/layout/container";
import { PermissionStates } from "projects/shared-utilities/modules/permission/permission-controller";
import { UserPermInquirySelectors } from "projects/shared-utilities/modules/permission/user-permissions-inquiry-controller/selectors";
import { SessionSelectors } from "projects/shared-utilities/modules/session/session-controller/selectors";
import { SessionStates } from "projects/shared-utilities/modules/session/session-controller/states";
import { FirstColumnDirective } from "projects/shared-utilities/utilities/first-column.directive";
import { PaginationClientSideV3Component } from "projects/shared-utilities/utilities/pagination-client-side-v3/pagination-client-side-v3.component";
import { SecondColumnDirective } from "projects/shared-utilities/utilities/second-column.directive";
import { ViewColumn } from "projects/shared-utilities/view-column";
import { ViewColumnComponent } from "projects/shared-utilities/view-column.component";
import { AppConfig } from "projects/shared-utilities/visa";
import { combineLatest } from 'rxjs';
import { map } from "rxjs/operators";
import { SubSink } from "subsink2";
import { ViewColumnFacade } from "../../facades/view-column.facade";
import { SalesReturnPagesService } from "../../services/sales-return-pages.service";
import { Column1ViewModelActions } from "../../state-controllers/sales-return-view-model-controller/store/actions";
import { ColumnViewModelStates } from "../../state-controllers/sales-return-view-model-controller/store/states";

@Component({
  template: containerTemplate,
  animations: containerAnim,
  providers: [SalesReturnPagesService],
})
export class SalesReturnContainerComponent implements OnInit, OnDestroy {
  userPermissionTarget$ = this.permissionStore.select(
    UserPermInquirySelectors.selectUserPermInquiry
  );
  @ViewChild(FirstColumnDirective, { static: true })
  firstColumnHost: FirstColumnDirective;
  @ViewChild(SecondColumnDirective, { static: true })
  secondColumnHost: SecondColumnDirective;

  private subs = new SubSink();

  leftDrawer: ViewColumn[];
  rightDrawer: ViewColumn[];
  breadCrumbs: ViewColumn[];
  firstCol: ViewColumn;
  secondCol: ViewColumn;

  mobileView = window.matchMedia("(max-width: 768px)");
 
  appletSettings$ = combineLatest([
    this.sessionStore.select(SessionSelectors.selectMasterSettings),
    this.sessionStore.select(SessionSelectors.selectPersonalSettings)
  ]).pipe(map(([a, b]) => ({ ...a, ...b })));


  constructor(
    private viewColFacade: ViewColumnFacade,
    private componentFactoryResolver: ComponentFactoryResolver,
    private pagesService: SalesReturnPagesService,
    private readonly sessionStore: Store<SessionStates>,
    private readonly permissionStore: Store<PermissionStates>,
    public readonly viewModelStore: Store<ColumnViewModelStates>
  ) { }

  ngOnInit() {
    this.subs.sink = this.viewColFacade.internalSalesReturnCache$.subscribe(
      (a) =>
        a
          ? this.viewColFacade.setViewColState(a)
          : this.viewColFacade.setViewColState(this.pagesService.pages)
    );
    this.mobileView.matches
      ? this.viewColFacade.toggleColumn(true)
      : this.viewColFacade.toggleColumn(false);
    this.mobileView.addEventListener("change", (e) => {
      this.mobileView.matches
        ? this.viewColFacade.toggleColumn(true)
        : this.viewColFacade.toggleColumn(false);
    });

    this.subs.sink = this.viewColFacade.firstCol$.subscribe((resolve) => {
      this.firstCol = resolve;
      this.loadComponent(resolve, this.firstColumnHost);
    });
    this.subs.sink = this.viewColFacade.secondCol$.subscribe((resolve) => {
      this.secondCol = resolve;
      this.loadComponent(resolve, this.secondColumnHost);
    });
    this.subs.sink = this.viewColFacade.leftDrawer$.subscribe(
      (resolve) => (this.leftDrawer = resolve)
    );
    this.subs.sink = this.viewColFacade.rightDrawer$.subscribe(
      (resolve) => (this.rightDrawer = resolve)
    );

    this.subs.sink = this.viewColFacade.breadCrumbs$.subscribe(
      (resolve) => (this.breadCrumbs = resolve)
    );

    this.subs.sink = this.appletSettings$.subscribe({
      next: (resolve) => {
        if (!this.mobileView.matches) {
          if (resolve?.VERTICAL_ORIENTATION) {
            if (resolve.DEFAULT_TOGGLE_COLUMN === "DOUBLE" || resolve.DEFAULT_ORIENTATION === "HORIZONTAL") {
              this.viewColFacade.toggleColumn(false);
            } else {
              this.viewColFacade.toggleColumn(true);
            }
          } else {
            if (resolve.DEFAULT_TOGGLE_COLUMN === "SINGLE" || resolve.DEFAULT_ORIENTATION === "VERTICAL") {
              this.viewColFacade.toggleColumn(true);
            } else {
              this.viewColFacade.toggleColumn(false);
            }
          }
        }
      }
    });
  }

  loadComponent(
    comp: ViewColumn,
    host: FirstColumnDirective | SecondColumnDirective
  ) {
    const viewContainerRef = host.viewContainerRef;
    viewContainerRef.clear();
    if (!comp) {
      return;
    }
    const compFactory = this.componentFactoryResolver.resolveComponentFactory(
      comp.component
    );
    viewContainerRef.createComponent<ViewColumnComponent>(compFactory);
  }

  goBackIndex(i: number) {
    this.viewColFacade.goBackIndex(i);
  }

  goForwardIndex(i: number) {
    this.viewColFacade.goForwardIndex(i);
  }

  goToIndex(i: number) {
    this.viewColFacade.goToIndex(i);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.viewColFacade.saveInternalSalesReturnState();
  }
}
