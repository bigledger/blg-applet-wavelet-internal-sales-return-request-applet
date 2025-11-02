import { AfterViewChecked, Component, Input, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { EditLineItemDetailsDocLinkFromComponent } from './from/from.component';
import { EditLineItemDetailsDocLinkToComponent } from './to/to.component';


@Component({
  selector: 'app-edit-item-details-doc-link',
  templateUrl: './doc-link.component.html',
  styleUrls: ['./doc-link.component.scss']
})
export class EditLineItemDetailsDocLinkComponent implements AfterViewChecked {

  @Input() selectedIndex;
  @ViewChild(MatTabGroup) matTab: MatTabGroup;
  @ViewChild(EditLineItemDetailsDocLinkFromComponent) from: EditLineItemDetailsDocLinkFromComponent;
  @ViewChild(EditLineItemDetailsDocLinkToComponent) to: EditLineItemDetailsDocLinkToComponent;

  ngAfterViewChecked() {
    this.matTab.realignInkBar();
  }

}
