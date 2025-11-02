import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ComponentStore } from '@ngrx/component-store';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../facades/view-column.facade';
import { GenericCreateMainComponent } from './generic-create-main/generic-order-create-main.component';

interface LocalState {
  deactivateAdd: boolean;
  deactivateReturn: boolean;
  deactivateCustomer: boolean;
  deactivateSalesAgent: boolean;
  deactivateShippingInfo: boolean;
  deactivateBillingInfo: boolean;
  deactivateList: boolean;
  selectedIndex: number;
}

@Component({
  selector: 'app-generic-create',
  templateUrl: './generic-create.component.html',
  styleUrls: ['./generic-create.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class GenericCreateComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Generic Create';
  protected index = 1;
  protected localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateAdd$ = this.componentStore.select(state => state.deactivateAdd);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);
  readonly deactivateCustomer$ = this.componentStore.select(state => state.deactivateCustomer);
  readonly deactivateSalesAgent$ = this.componentStore.select(state => state.deactivateSalesAgent);
  readonly deactivateShippingInfo$ = this.componentStore.select(state => state.deactivateShippingInfo);
  readonly deactivateBillingInfo$ = this.componentStore.select(state => state.deactivateBillingInfo);
  readonly deactivateList$ = this.componentStore.select(state => state.deactivateList);
  readonly selectedIndex$ = this.componentStore.select(state => state.selectedIndex);

  toggleColumn$ = this.viewColFacade.toggleColumn$;

  prevIndex: number;
  protected prevLocalState: any;

  @ViewChild(MatTabGroup, { static: true } ) matTab: MatTabGroup;
  @ViewChild(GenericCreateMainComponent, { static: true } ) mainTab: GenericCreateMainComponent;

  constructor(
    private viewColFacade: ViewColumnFacade,
    private readonly componentStore: ComponentStore<LocalState>) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.subs.sink = this.localState$.subscribe( a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
  }

  onShippingInfo() {
    if (!this.localState.deactivateShippingInfo) {
      this.viewColFacade.updateInstance<LocalState>(this.index, {
        ...this.localState,
        deactivateReturn: true,
        deactivateShippingInfo: true,
        deactivateBillingInfo: false
      });
      this.viewColFacade.onNextAndReset(this.index, 7);
    }
  }

  onBillingInfo() {
    if (!this.localState.deactivateBillingInfo) {
      this.viewColFacade.updateInstance<LocalState>(this.index, {
        ...this.localState,
        deactivateReturn: true,
        deactivateShippingInfo: false,
        deactivateBillingInfo: true
      });
      this.viewColFacade.onNextAndReset(this.index, 7);
    }
  }

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  onNextAdd() {
    if (!this.localState.deactivateAdd) {
      this.viewColFacade.updateInstance<LocalState>(this.index, {
        ...this.localState,
        deactivateReturn: true,
        deactivateAdd: true
      });
      this.viewColFacade.onNextAndReset(this.index, 4);
    }
    // this.store.dispatch(InternalPackingOrderActions.selectPackingOrderEntity({entity}));
  }

  onNextList(entity) {
    if (entity) {
      // this.store.dispatch(InternalPackingOrderActions.selectPackingOrderEntity({entity}));
      if (!this.localState.deactivateList) {
        this.viewColFacade.updateInstance<LocalState>(this.index, {
          ...this.localState,
          deactivateReturn: true,
          deactivateList: true
        });
        this.viewColFacade.onNextAndReset(this.index, 3);
      }
    }
  }

  onSave() {
    console.log(this.mainTab.form.value);
  }

  ngOnDestroy() {
    if (this.matTab) {
      this.viewColFacade.updateInstance<LocalState>(this.index, {...this.localState, selectedIndex: this.matTab.selectedIndex});
    }
    this.subs.unsubscribe();
  }

}
