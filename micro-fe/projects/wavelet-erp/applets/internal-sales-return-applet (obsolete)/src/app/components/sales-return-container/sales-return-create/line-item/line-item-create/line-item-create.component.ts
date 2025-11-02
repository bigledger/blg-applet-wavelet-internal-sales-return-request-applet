import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { ViewColumnFacade } from '../../../../../facades/view-column.facade';
import { ComponentStore } from '@ngrx/component-store';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';
import { MatTabGroup } from '@angular/material/tabs';
import { ItemActions } from '../../../../../state-controllers/sales-return-controller/store/actions';
import { SalesReturnActions } from '../../../../../state-controllers/sales-return-controller/store/actions';
import { SalesReturnStates } from '../../../../../state-controllers/sales-return-controller/store/states';

interface LocalState {
  deactivateReturn: boolean;
  deactivateList: boolean;
  selectedIndex: number;
  purchaseOrderEdit: boolean;
  selectedItem: any;
}

@Component({
  selector: 'app-sales-return-line-item-create',
  templateUrl: './line-item-create.component.html',
  styleUrls: ['./line-item-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class LineItemCreateComponent extends ViewColumnComponent {

  protected subs = new SubSink();
  
  protected compName = 'Line Item Create';
  protected readonly index = 7;
  protected localState: LocalState;
  protected prevLocalState: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);
  readonly selectedIndex$ = this.componentStore.select(state => (state.selectedIndex));

  prevIndex: number;
  apiVisa = AppConfig.apiVisa;

  @ViewChild(MatTabGroup) matTab: MatTabGroup;

  constructor(
    private viewColFacade: ViewColumnFacade,
    protected readonly store: Store<SalesReturnStates>,
    protected readonly componentStore: ComponentStore<LocalState>) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    // if (this.prevIndex === 2) {
    //   console.log('here')
    //   this.componentStore.patchState({ purchaseOrderEdit: true });
    //   console.log(this.localState);
    // }
    // else 
    //   this.componentStore.patchState({ purchaseOrderEdit: false });
  }

  onSubmit() {

  }

  saveSerialNumber(serial: string) {
    this.store.dispatch(ItemActions.selectSerial({ serial }));
  }

  goToAddLineItem(lineItem: any) {
    this.store.dispatch(SalesReturnActions.selectLineItem({ lineItem }));
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState, 
      deactivateList: false,
      deactivateReturn: true,
      selectedItem: lineItem.item_guid
    });
    this.viewColFacade.onNextAndReset(this.index, 8);
  }

  onReturn() {
    this.viewColFacade.updateInstance<LocalState>(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateReturn: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  ngOnDestroy() {
    if (this.matTab) {
      this.viewColFacade.updateInstance<LocalState>(this.index, {
        ...this.localState, selectedIndex: this.matTab.selectedIndex
      });
    }
    this.subs.unsubscribe();  
  }

}