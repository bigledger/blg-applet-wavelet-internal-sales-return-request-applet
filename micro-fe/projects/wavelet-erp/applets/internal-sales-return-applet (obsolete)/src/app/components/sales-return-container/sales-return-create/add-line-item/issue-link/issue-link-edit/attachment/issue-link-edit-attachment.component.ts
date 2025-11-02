import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { SubSink } from 'subsink2';

@Component({
  selector: 'app-issue-link-edit-attachment',
  templateUrl: './issue-link-edit-attachment.component.html',
  styleUrls: ['./issue-link-edit-attachment.component.scss']
})
export class IssueLinkEditAttachmentComponent implements OnInit, OnDestroy {

  protected subs = new SubSink();

  serialNumbers = [];
  
  @ViewChild(MatSelectionList, {static: true}) matList: MatSelectionList;

  constructor() { }

  ngOnInit() {
  }

  onChange(e: File) {
    // Object.values(e).forEach(file => {
    //   let size = file.size, sizeIncrement = 0;
    //   while (size >= 1024) {
    //     size /= 1024;
    //     sizeIncrement++;
    //   }
    //   const fileReader = new FileReader();

    //   fileReader.readAsDataURL(file);
    //   fileReader.addEventListener('loadend', (a) => {
    //     attachment = {
    //       file,
    //       fileSRC: file.type.includes('image') ? a.target.result : 'icon',
    //       fileAttributes: {
    //         fileName: file.name,
    //         size: `${sizeIncrement > 0 ? size.toFixed(2) : size} ${this.byteSize[sizeIncrement]}`
    //       }
    //     }
    //   });
    // });
  }

  onAdd() {
    // this.store.dispatch(AttachmentActions.uploadAttachmentsInit());
  }

  onSelectAll() {
    this.matList.selectedOptions.selected.length === this.matList.options.length ? this.matList.deselectAll() : this.matList.selectAll();
  }

  onDeleteFile(file) {
    // this.store.dispatch(AttachmentActions.removeAttachment({id: file.id}))
  }

  onRemove() {
    this.serialNumbers = this.serialNumbers.filter(s => !this.matList._value.includes(s))
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}