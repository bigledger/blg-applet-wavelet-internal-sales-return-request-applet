import { AfterViewChecked, Component, Input, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { RelatedDocumentsCopyFromComponent } from './copy-from/copy-from.component';
import { RelatedDocumentsCopyToComponent } from './copy-to/copy-to.component';


@Component({
  selector: 'app-item-details-related-documents',
  templateUrl: './related-documents.component.html',
  styleUrls: ['./related-documents.component.scss']
})
export class ItemDetailsRelatedDocumentsComponent implements AfterViewChecked {

  @Input() selectedIndex;
  @ViewChild(MatTabGroup) matTab: MatTabGroup;
  @ViewChild(RelatedDocumentsCopyFromComponent) from: RelatedDocumentsCopyFromComponent;
  @ViewChild(RelatedDocumentsCopyToComponent) to: RelatedDocumentsCopyToComponent;

  ngAfterViewChecked() {
    this.matTab.realignInkBar();
  }

}
