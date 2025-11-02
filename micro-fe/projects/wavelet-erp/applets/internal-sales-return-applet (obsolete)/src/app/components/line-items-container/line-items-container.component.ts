import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ViewColumnFacade } from '../../facades/view-column.facade';
import { LineItemsPagesService } from '../../services/line-items-pages.service';
import { containerAnim } from 'projects/shared-utilities/modules/layout/animations/animations';
import { containerTemplate } from 'projects/shared-utilities/modules/layout/container';
import { ViewColumn } from 'projects/shared-utilities/view-column';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { FirstColumnDirective } from 'projects/shared-utilities/utilities/first-column.directive';
import { SecondColumnDirective } from 'projects/shared-utilities/utilities/second-column.directive';
import { SubSink } from 'subsink2';

@Component({
  template: containerTemplate,
  animations: containerAnim,
  providers: [LineItemsPagesService],
})
export class LineItemsContainerComponent implements OnInit, OnDestroy {

  @ViewChild(FirstColumnDirective, {static: true}) firstColumnHost: FirstColumnDirective;
  @ViewChild(SecondColumnDirective, {static: true}) secondColumnHost: SecondColumnDirective;

  leftDrawer: ViewColumn[];
  rightDrawer: ViewColumn[];

  breadCrumbs: ViewColumn[];

  firstCol: ViewColumn;
  secondCol: ViewColumn;

  mobileView = window.matchMedia('(max-width: 768px)');

  private subs = new SubSink();

  constructor(
    private viewColFacade: ViewColumnFacade,
    private componentFactoryResolver: ComponentFactoryResolver,
    private pagesService: LineItemsPagesService) {
  }

  ngOnInit() {
    this.subs.sink = this.viewColFacade.lineItemsCache$.subscribe(a => {
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
    this.subs.unsubscribe();
    this.viewColFacade.saveLineItemsState();
  }

}
