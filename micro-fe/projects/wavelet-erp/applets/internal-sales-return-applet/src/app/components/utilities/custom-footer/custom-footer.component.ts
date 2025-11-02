import { ChangeDetectorRef, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { IStatusPanelAngularComp } from 'ag-grid-angular';
import { IStatusPanelParams } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { InternalSalesReturnSelectors } from '../../../state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnStates } from '../../../state-controllers/internal-sales-return-controller/store/states';

@Component({
  selector: 'app-custom-footer',
  template: "<div>Total Records: {{ totalRecords$ | async }}</div>",
})
export class CustomFooterComponent implements IStatusPanelAngularComp {

  totalRecords$: Observable<number>;
  private params: IStatusPanelParams;

  constructor(
    private cdRef: ChangeDetectorRef,
    private readonly store: Store<InternalSalesReturnStates>
  ) {}

  agInit(params: IStatusPanelParams): void {
    this.params = params;

    this.totalRecords$ = this.store.select(
      InternalSalesReturnSelectors.selectTotalRecords
    );
  }
}
