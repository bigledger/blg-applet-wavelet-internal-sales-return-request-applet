import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ViewColumnFacade } from '../../facades/view-column.facade';
import { SalesReturnPagesService } from '../../services/sales-return-pages.service';
import { SubSink } from 'subsink2';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { ViewColumn } from 'projects/shared-utilities/view-column';
import { containerTemplate } from 'projects/shared-utilities/modules/layout/container';
import { containerAnim } from 'projects/shared-utilities/modules/layout/animations/animations';
import { FirstColumnDirective } from 'projects/shared-utilities/utilities/first-column.directive';
import { SecondColumnDirective } from 'projects/shared-utilities/utilities/second-column.directive';

@Component({
  template: containerTemplate,
  animations: containerAnim,
  providers: [SalesReturnPagesService]
})
export class SalesReturnContainerComponent implements OnInit, OnDestroy {

  @ViewChild(FirstColumnDirective, {static: true}) firstColumnHost: FirstColumnDirective;
  @ViewChild(SecondColumnDirective, {static: true}) secondColumnHost: SecondColumnDirective;

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
    private pagesService: SalesReturnPagesService) {
  }

  ngOnInit() {
    this.subs.sink = this.viewColFacade.salesReturnCache$.subscribe(a =>
      a ? this.viewColFacade.setViewColState(a) : this.viewColFacade.setViewColState(this.pagesService.pages)
    );
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
    this.viewColFacade.savePRState();
  }

}