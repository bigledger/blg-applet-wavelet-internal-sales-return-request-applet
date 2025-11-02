import { AfterViewChecked, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { bl_fi_generic_doc_line_RowClass } from 'blg-akaun-ts-lib';
import { Observable } from 'rxjs';
import { FromComponent } from './from/from.component';
import { ToComponent } from './to/to.component';
import { AppletSettings } from '../../../../models/applet-settings.model';

@Component({
  selector: 'app-header-doc-link',
  templateUrl: './header-doc-link.component.html',
  styleUrls: ['./header-doc-link.component.scss']
})
export class HeaderDocLinkComponent implements AfterViewChecked {

  @Input() pns$: Observable<bl_fi_generic_doc_line_RowClass[]>;
  @Input() selectedIndex;
  @Input() orientation: boolean = false;
  @ViewChild(MatTabGroup) matTab: MatTabGroup;
  @ViewChild(FromComponent) from: FromComponent;
  @ViewChild(ToComponent) to: ToComponent;

  panels = [
    { title: 'From', content: 'from' },
    { title: 'To', content: 'to' }
  ];
  expandedPanelIndex: number = 0;

  ngAfterViewChecked() {
    if(this.matTab) {
      this.matTab.realignInkBar();
    }
  }

  showPanels(): boolean {
    return this.orientation;
  }

  onPanelOpened(index: number): void {
    this.expandedPanelIndex = index;
  }
}
