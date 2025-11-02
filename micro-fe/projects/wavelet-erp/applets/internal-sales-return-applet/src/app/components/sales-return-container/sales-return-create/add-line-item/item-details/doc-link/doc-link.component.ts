import { AfterViewChecked, Component, Input, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ItemDetailsDocLinkFromComponent } from './from/from.component';
import { ItemDetailsDocLinkToComponent } from './to/to.component';


@Component({
  selector: 'app-item-details-doc-link',
  templateUrl: './doc-link.component.html',
  styleUrls: ['./doc-link.component.scss']
})
export class ItemDetailsDocLinkComponent implements AfterViewChecked {

  @Input() selectedIndex;
  @ViewChild(MatTabGroup) matTab: MatTabGroup;
  @ViewChild(ItemDetailsDocLinkFromComponent) from: ItemDetailsDocLinkFromComponent;
  @ViewChild(ItemDetailsDocLinkToComponent) to: ItemDetailsDocLinkToComponent;

  ngAfterViewChecked() {
    this.matTab.realignInkBar();
  }

}
