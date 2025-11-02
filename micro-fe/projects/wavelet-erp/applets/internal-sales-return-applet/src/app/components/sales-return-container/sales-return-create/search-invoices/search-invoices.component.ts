import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatTabGroup } from "@angular/material/tabs";
import { AppletSettings } from '../../../../models/applet-settings.model';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { SubSink } from 'subsink2';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: "app-search-invoices",
  templateUrl: "./search-invoices.component.html",
  styleUrls: ["./search-invoices.component.css"],
})
export class SearchInvoicesComponent implements OnInit {
  protected subs = new SubSink();

  @Input() selectedIndex;
  @Input() orientation: boolean = false;

  @ViewChild(MatTabGroup) matTab: MatTabGroup;

  postingStatus;

  constructor(
    private readonly sessionStore: Store<SessionStates>) {}

  panels = [
    { title: 'Search By Customer', content: 'search-by-customer' },
    { title: 'Search By Invoice', content: 'search-by-invoice' },
    { title: 'Search By Cashbill', content: 'search-by-cashbill' },
    //{ title: 'Search By Serial Number', content: 'search-by-serial-number' }
  ];
  expandedPanelIndex: number = 0;

  ngOnInit(): void {

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
