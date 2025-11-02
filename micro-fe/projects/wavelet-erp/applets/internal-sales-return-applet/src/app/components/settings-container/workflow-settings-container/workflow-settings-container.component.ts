import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Pagination } from 'blg-akaun-ts-lib';
import { containerAnim } from 'projects/shared-utilities/modules/layout/animations/animations';
import { containerTemplate } from 'projects/shared-utilities/modules/layout/container';
import { FirstColumnDirective } from 'projects/shared-utilities/utilities/first-column.directive';
import { SecondColumnDirective } from 'projects/shared-utilities/utilities/second-column.directive';
import { ViewColumn } from 'projects/shared-utilities/view-column';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../facades/view-column.facade';
import { WorkflowSettingsPagesService } from '../../../services/workflow-settings-pages.service';
import { WorkflowActions } from '../../../state-controllers/workflow-controller/store/actions';
import { WorkflowStates } from '../../../state-controllers/workflow-controller/store/states';

@Component({
  template: containerTemplate,
  animations: containerAnim,
  providers: [WorkflowSettingsPagesService]

})
export class WorkflowSettingsContainerComponent implements OnInit, OnDestroy {


  // Directives for the first and second drawers
  @ViewChild(FirstColumnDirective, { static: true }) firstColumnHost: FirstColumnDirective;
  @ViewChild(SecondColumnDirective, { static: true }) secondColumnHost: SecondColumnDirective;

  leftDrawer: ViewColumn[];
  rightDrawer: ViewColumn[];
  breadCrumbs: ViewColumn[];

  firstCol: ViewColumn;
  secondCol: ViewColumn;
  
  appletGuid = sessionStorage.getItem('appletGuid');
  mobileView = window.matchMedia('(max-width: 768px)');

  private subSink = new SubSink;

  constructor(
    private viewColFacade: ViewColumnFacade,
    private componentFactoryResolver: ComponentFactoryResolver,
    private readonly store: Store<WorkflowStates>,
    private pagesService: WorkflowSettingsPagesService) {
  }

  ngOnInit() {
    this.subSink.sink = this.viewColFacade.workflowSettingsCache$.subscribe(a =>
      a ? this.viewColFacade.setViewColState(a) : this.viewColFacade.setViewColState(this.pagesService.pages)
    );
    this.mobileView.matches ? this.viewColFacade.toggleColumn(true) : this.viewColFacade.toggleColumn(false);
    this.mobileView.addEventListener('change', (e) => {
      this.mobileView.matches ? this.viewColFacade.toggleColumn(true) : this.viewColFacade.toggleColumn(false);
    });

    this.subSink.sink = this.viewColFacade.firstCol$.subscribe( resolve => {
      this.firstCol = resolve;
      this.loadComponent(resolve, this.firstColumnHost);
    });
    this.subSink.sink = this.viewColFacade.secondCol$.subscribe( resolve => {
      this.secondCol = resolve;
      this.loadComponent(resolve, this.secondColumnHost);
    });
    this.subSink.sink = this.viewColFacade.leftDrawer$.subscribe( resolve => this.leftDrawer = resolve );
    this.subSink.sink = this.viewColFacade.rightDrawer$.subscribe( resolve => this.rightDrawer = resolve );

    this.subSink.sink = this.viewColFacade.breadCrumbs$.subscribe( resolve => this.breadCrumbs = resolve );
    this.store.dispatch(WorkflowActions.loadCompanyInit({pagination: new Pagination(0, 999,
      [
        { columnName: 'applet_guid', operator: '=', value: this.appletGuid.toString() },
        { columnName: 'orderBy', operator: '=', value: 'updated_date' },
        { columnName: 'order', operator: '=', value: 'DESC' },
      ])}));
  }

  loadComponent( comp: ViewColumn, host: FirstColumnDirective | SecondColumnDirective ) {
    const viewContainerRef = host.viewContainerRef;
    viewContainerRef.clear();
    if (!comp) {
      return;
    }
    const compFactory  = this.componentFactoryResolver.resolveComponentFactory(comp.component);
    const compRef = viewContainerRef.createComponent<ViewColumnComponent>(compFactory);
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
    this.subSink.unsubscribe();
    this.viewColFacade.saveLineItemsState();
  }

}
