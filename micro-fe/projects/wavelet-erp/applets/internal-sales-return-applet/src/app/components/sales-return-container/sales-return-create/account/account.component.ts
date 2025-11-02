import { AfterViewChecked, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { bl_fi_generic_doc_hdr_RowClass } from 'blg-akaun-ts-lib';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { AccountEntityDetailsComponent } from './account-entity-details/account-entity-details.component';
import { AccountBillingAddressComponent } from './account-billing-address/account-billing-address.component';
import { AccountShippingAddressComponent } from './account-shipping-address/account-shipping-address.component';
import { Store } from '@ngrx/store';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';


@Component({
  selector: 'app-internal-sales-return-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements AfterViewChecked {

  @Input() draft$: Observable<bl_fi_generic_doc_hdr_RowClass>;
  @Input() selectedIndex;
  @Input() orientation: boolean = false;

  @Output() selectEntity = new EventEmitter();
  @Output() selectBilling = new EventEmitter();
  @Output() selectShipping = new EventEmitter();
  @Output() updateShipTo = new EventEmitter();
  @Output() updateShippingAddress = new EventEmitter();
  @Output() updateBillTo = new EventEmitter();
  @Output() updateBillingAddress = new EventEmitter();
  @Output() accountStatusChange = new EventEmitter<string>();

  @ViewChild(MatTabGroup) matTab: MatTabGroup;
  @ViewChild(AccountEntityDetailsComponent) entity: AccountEntityDetailsComponent;
  @ViewChild(AccountBillingAddressComponent) bill: AccountBillingAddressComponent;
  @ViewChild(AccountShippingAddressComponent) ship: AccountShippingAddressComponent;

  appletSettings;
  appletSettings$ = combineLatest([
    this.sessionStore.select(SessionSelectors.selectMasterSettings),
    this.sessionStore.select(SessionSelectors.selectPersonalSettings)
  ]).pipe(map(([a, b]) => ({...a, ...b})));

  panels = [
    { title: 'Entity Details', content: 'entity-details' },
    { title: 'Bill To', content: 'bill-to' },
    { title: 'Ship To', content: 'ship-to' },
    { title: 'Intercompany', content: 'intercompany' }
  ];
  expandedPanelIndex: number = 0;

  constructor(protected readonly sessionStore: Store<SessionStates>) { }

  ngOnInIt(){
    this.entity.form.statusChanges.subscribe((status) => {
      this.accountStatusChange.emit(status);
    });

    if (this.appletSettings$) {
      this.appletSettings$.subscribe(data => {
        this.appletSettings = data;
      });
    }
  }

  ngAfterViewChecked() {
    if (this.matTab){
      this.matTab.realignInkBar();
    }
  }

  onAccountStatusChange(status) {
    this.accountStatusChange.emit(status);
  }

  showPanels(): boolean {
    return this.orientation;
  }

  onPanelOpened(index: number): void {
    this.expandedPanelIndex = index;
  }
}

