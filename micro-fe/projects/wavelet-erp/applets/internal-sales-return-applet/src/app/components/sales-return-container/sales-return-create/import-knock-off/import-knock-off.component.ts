import { Component, OnInit, Input } from '@angular/core';
import { SubSink } from "subsink2";
import { Store } from "@ngrx/store";
import { SessionSelectors } from "projects/shared-utilities/modules/session/session-controller/selectors";
import { AppletSettings } from "../../../../models/applet-settings.model";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { SessionStates } from "projects/shared-utilities/modules/session/session-controller/states";

@Component({
  selector: 'app-import-knock-off',
  templateUrl: './import-knock-off.component.html',
  styleUrls: ['./import-knock-off.component.scss']
})
export class ImportKnockOffComponent implements OnInit {

  protected subs = new SubSink();
  
  @Input() orientation: boolean = false;

  panels = [
    { title: 'Sales Order', content: 'sales-order' },
    { title: 'Delivery Order', content: 'delivery-order' },
    { title: 'Sales Quotation', content: 'sales-quotation' },
    { title: 'Job Sheet', content: 'job-sheet' },
    { title: 'Sales Order Draft', content: 'sales-order-draft' }
  ];

  expandedPanelIndex: number = 0;
  
  constructor(
    public sessionStore: Store<SessionStates>) { }

  ngOnInit(): void {
    
  }

  onPanelOpened(index: number): void {
    this.expandedPanelIndex = index;
  }

  showPanels(): boolean {
    return this.orientation;
  }

}
