import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { Store } from "@ngrx/store";
import { ComponentStore } from "@ngrx/component-store";
import {
  pageFiltering,
  pageSorting,
} from "projects/shared-utilities/listing.utils";
import { Observable, forkJoin, iif, of, zip } from "rxjs";
import { AppConfig } from "projects/shared-utilities/visa";
import { ViewColumnComponent } from "projects/shared-utilities/view-column.component";
import { SubSink } from "subsink2";
import { catchError, map, mergeMap } from "rxjs/operators";
import moment from "moment";
import { InternalSalesReturnActions } from '../../../../state-controllers/internal-sales-return-controller/store/actions';
import { InternalSalesReturnSelectors } from '../../../../state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnStates } from '../../../../state-controllers/internal-sales-return-controller/store/states';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';

@Component({
  selector: "app-e-invoice",
  templateUrl: "./e-invoice.component.html",
  styleUrls: ["./e-invoice.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore],
})
export class EInvoiceComponent extends ViewColumnComponent {
  
  protected subs = new SubSink();
  postingStatus;
  eInvoiceEnabled = false;
  hdr$ = this.store.select(InternalSalesReturnSelectors.selectInternalSalesReturns);
  @Input() orientation: boolean = false; 

  constructor(
    protected readonly store: Store<InternalSalesReturnStates>, protected readonly sessionStore: Store<SessionStates>
  ) {
    super();
  }

  panels = [
    { title: 'Progress', content: 'progress', show: { postingStatus: 'FINAL' }, condition: { eInvoiceEnabled: true } },
    { title: 'Submission', content: 'submission' },
    { title: 'Communication', content: 'communication' },
    { title: 'Cancellation', content: 'cancellation', show: { postingStatus: 'FINAL' }, condition: { eInvoiceEnabled: true }  }
  ];
  expandedPanelIndex: number = 0;

  ngOnInit() {
    this.subs.sink = this.hdr$.subscribe(resolve => {
      this.postingStatus = resolve.bl_fi_generic_doc_hdr.posting_status
    });
    this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectEInvoiceEnabled).subscribe(e => {
      this.eInvoiceEnabled = e;
    });
  }

  getFilteredPanels() {
    return this.panels.filter(panel => {
      const showPanels = !panel.show  || (panel?.show.postingStatus === this.postingStatus);
      const conditionPanels = !panel.condition || panel?.condition.eInvoiceEnabled === this.eInvoiceEnabled;
      return showPanels && conditionPanels;
    });
  }

  onPanelOpened(index: number): void {
    this.expandedPanelIndex = index;
  }

  showPanels(): boolean {
    return this.orientation;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
