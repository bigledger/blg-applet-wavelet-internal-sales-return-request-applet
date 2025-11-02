import { AfterViewChecked, Component, Input, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Observable } from 'rxjs';
import { bl_fi_generic_doc_line_RowClass } from 'blg-akaun-ts-lib';
import { HeaderDocLinkCopyFromComponent } from './copy-from/copy-from.component';
import { HeaderDocLinkCopyToComponent } from './copy-to/copy-to.component';


@Component({
  selector: 'app-sales-return-header-doc-link',
  templateUrl: './header-doc-link.component.html',
  styleUrls: ['./header-doc-link.component.scss']
})
export class HeaderDocLinkComponent implements AfterViewChecked {

  @Input() pns$: Observable<bl_fi_generic_doc_line_RowClass[]>;
  @Input() selectedIndex;
  @ViewChild(MatTabGroup) matTab: MatTabGroup;
  @ViewChild(HeaderDocLinkCopyFromComponent) from: HeaderDocLinkCopyFromComponent;
  @ViewChild(HeaderDocLinkCopyToComponent) to: HeaderDocLinkCopyToComponent;

  ngAfterViewChecked() {
    this.matTab.realignInkBar();
  }

}