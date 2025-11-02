import {
    Component,
    ComponentFactoryResolver,
    OnDestroy,
    OnInit,
    ViewChild,
  } from "@angular/core";
  import { containerAnim } from "projects/shared-utilities/modules/layout/animations/animations";
  import { containerTemplate } from "projects/shared-utilities/modules/layout/container";
  import { FirstColumnDirective } from "projects/shared-utilities/utilities/first-column.directive";
  import { SecondColumnDirective } from "projects/shared-utilities/utilities/second-column.directive";
  import { ViewColumn } from "projects/shared-utilities/view-column";
  import { ViewColumnComponent } from "projects/shared-utilities/view-column.component";
  import { SubSink } from "subsink2";
  import { BranchSettingsFacade } from "../../../facades/branch-settings.facade";
  import { BranchSettingsPagesService } from "../../../services/branch-settings-pages.service";
  
  @Component({
    template: containerTemplate,
    animations: containerAnim,
    providers: [BranchSettingsPagesService],
  })
  export class BranchSettingsContainerComponent implements OnInit, OnDestroy {
    // Directives for the first and second drawers
    @ViewChild(FirstColumnDirective, { static: true })
    firstColumnHost: FirstColumnDirective;
    @ViewChild(SecondColumnDirective, { static: true })
    secondColumnHost: SecondColumnDirective;
  
    leftDrawer: ViewColumn[];
    rightDrawer: ViewColumn[];
  
    breadCrumbs: ViewColumn[];
  
    firstCol: ViewColumn;
    secondCol: ViewColumn;
  
    mobileView = window.matchMedia("(max-width: 768px)");
  
    private subSink = new SubSink();
  
    constructor(
      private viewColFacade: BranchSettingsFacade,
      private componentFactoryResolver: ComponentFactoryResolver,
      private pagesService: BranchSettingsPagesService
    ) {}
  
    ngOnInit() {
      // Cache the Applet Module view
      this.subSink.sink = this.viewColFacade.branchSettingsCache$.subscribe((a) =>
        a
          ? this.viewColFacade.setViewColState(a)
          : this.viewColFacade.setViewColState(this.pagesService.pages)
      );
  
      // Configure the view size for when we choose to see either one or two columns
      this.mobileView.matches
        ? this.viewColFacade.toggleColumn(true)
        : this.viewColFacade.toggleColumn(false);
      this.mobileView.addEventListener("change", (_) => {
        this.mobileView.matches
          ? this.viewColFacade.toggleColumn(true)
          : this.viewColFacade.toggleColumn(false);
      });
  
      // Configure the views
      this.subSink.sink = this.viewColFacade.firstCol$.subscribe((resolve) => {
        this.firstCol = resolve;
        this.loadComponent(resolve, this.firstColumnHost);
      });
      this.subSink.sink = this.viewColFacade.secondCol$.subscribe((resolve) => {
        this.secondCol = resolve;
        this.loadComponent(resolve, this.secondColumnHost);
      });
  
      this.subSink.sink = this.viewColFacade.leftDrawer$.subscribe(
        (resolve) => (this.leftDrawer = resolve)
      );
      this.subSink.sink = this.viewColFacade.rightDrawer$.subscribe(
        (resolve) => (this.rightDrawer = resolve)
      );
  
      this.subSink.sink = this.viewColFacade.breadCrumbs$.subscribe(
        (resolve) => (this.breadCrumbs = resolve)
      );
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
      const compRef =
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
      this.viewColFacade.saveBranchSettingsState();
      this.subSink.unsubscribe();
    }
  }