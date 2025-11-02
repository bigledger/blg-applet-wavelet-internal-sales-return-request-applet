import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ViewColumnFacade } from '../../facades/view-column.facade';
import { FileImportPagesService } from '../../services/file-import-pages.service';
import { SubSink } from 'subsink2';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { ViewColumn } from 'projects/shared-utilities/view-column';
import { containerTemplate } from 'projects/shared-utilities/modules/layout/container';
import { containerAnim } from 'projects/shared-utilities/modules/layout/animations/animations';
import { FirstColumnDirective } from 'projects/shared-utilities/utilities/first-column.directive';
import { SecondColumnDirective } from 'projects/shared-utilities/utilities/second-column.directive';
import { AppletSettings } from '../../models/applet-settings.model';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  template: containerTemplate,
  animations: containerAnim,
  providers: [FileImportPagesService]
})
export class FileImportContainerComponent implements OnInit, OnDestroy {

  @ViewChild(FirstColumnDirective, {static: true}) firstColumnHost: FirstColumnDirective;
  @ViewChild(SecondColumnDirective, {static: true}) secondColumnHost: SecondColumnDirective;

  appletSettings$ = combineLatest([
    this.sessionStore.select(SessionSelectors.selectMasterSettings),
    this.sessionStore.select(SessionSelectors.selectPersonalSettings)
  ]).pipe(map(([a, b]) => ({...a, ...b})));

  private subs = new SubSink();

  leftDrawer: ViewColumn[];
  rightDrawer: ViewColumn[];
  breadCrumbs: ViewColumn[];
  firstCol: ViewColumn;
  secondCol: ViewColumn;

  mobileView = window.matchMedia('(max-width: 768px)');

  constructor(
    private viewColFacade: ViewColumnFacade,
    private componentFactoryResolver: ComponentFactoryResolver,
    private pagesService: FileImportPagesService,
    private readonly sessionStore: Store<SessionStates>) {
  }

  ngOnInit() {
    this.subs.sink = this.viewColFacade.fileImportCache$.subscribe(a =>{
      a ? this.viewColFacade.setViewColState(a) : this.viewColFacade.setViewColState(this.pagesService.pages)
    });
    this.mobileView.matches ? this.viewColFacade.toggleColumn(true) : this.viewColFacade.toggleColumn(false);
    this.mobileView.addEventListener('change', (e) => {
      this.mobileView.matches ? this.viewColFacade.toggleColumn(true) : this.viewColFacade.toggleColumn(false);
    });

    this.subs.sink = this.viewColFacade.firstCol$.subscribe( resolve => {
      this.firstCol = resolve;
      this.loadComponent(resolve, this.firstColumnHost);
    });
    this.subs.sink = this.viewColFacade.secondCol$.subscribe( resolve => {
      this.secondCol = resolve;
      this.loadComponent(resolve, this.secondColumnHost);
    });
    this.subs.sink = this.viewColFacade.leftDrawer$.subscribe( resolve => this.leftDrawer = resolve );
    this.subs.sink = this.viewColFacade.rightDrawer$.subscribe( resolve => this.rightDrawer = resolve );

    this.subs.sink = this.viewColFacade.breadCrumbs$.subscribe( resolve => this.breadCrumbs = resolve );

    this.subs.sink = this.appletSettings$.subscribe({next: (resolve: AppletSettings) => {
      if(!this.mobileView.matches){
        if(resolve?.VERTICAL_ORIENTATION){
          if(resolve.DEFAULT_TOGGLE_COLUMN === "DOUBLE" || resolve.DEFAULT_ORIENTATION === "HORIZONTAL") {
            this.viewColFacade.toggleColumn(false);
          } else {
            this.viewColFacade.toggleColumn(true);
          }
        } else {
          this.viewColFacade.toggleColumn(true);
        }
      }
    }});
  }

  ngAfterViewInit() {

  }

  loadComponent( comp: ViewColumn, host: FirstColumnDirective | SecondColumnDirective ) {
    const viewContainerRef = host.viewContainerRef;
    viewContainerRef.clear();
    if (!comp) {
      return;
    }
    const compFactory  = this.componentFactoryResolver.resolveComponentFactory(comp.component);
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
    this.viewColFacade.saveFileImportState();
  }

}
