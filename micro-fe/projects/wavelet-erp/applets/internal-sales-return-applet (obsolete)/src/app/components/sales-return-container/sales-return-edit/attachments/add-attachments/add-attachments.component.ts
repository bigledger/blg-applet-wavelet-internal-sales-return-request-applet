import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { SubSink } from 'subsink2';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { Store } from '@ngrx/store';
import { AttachmentSelectors } from '../../../../../state-controllers/draft-controller/store/selectors';
import { ViewColumnFacade } from '../../../../../facades/view-column.facade';
import { AttachmentState } from '../../../../../state-controllers/draft-controller/store/states/atachment.states';
import { Attachment } from '../../../../../models/attachment.model';
import { AttachmentActions } from '../../../../../state-controllers/draft-controller/store/actions';

interface LocalState {
  deactivateReturn: boolean;
}

@Component({
  selector: 'app-purchase-order-add-attachments',
  templateUrl: './add-attachments.component.html',
  styleUrls: ['./add-attachments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class AddAttachmentsComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Add Attachments';
  protected readonly index = 15;
  protected localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);

  prevIndex: number;
  protected prevLocalState: any;

  files$ =  this.store.select(AttachmentSelectors.selectAll);

  byteSize = ['Bytes', 'KB', 'MB'];

  constructor(
    private viewColFacade: ViewColumnFacade,
    private readonly store: Store<AttachmentState>,
    private readonly componentStore: ComponentStore<LocalState>) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.subs.sink = this.localState$.subscribe( a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
  }

  onChange(e: FileList) {
    let attachment: Attachment;
    Object.values(e).forEach(file => {
      let size = file.size, sizeIncrement = 0;
      while (size >= 1024) {
        size /= 1024;
        sizeIncrement++;
      }
      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);
      fileReader.addEventListener('loadend', (a) => {
        attachment = {
          file,
          fileSRC: file.type.includes('image') ? a.target.result : 'icon',
          fileAttributes: {
            fileName: file.name,
            size: `${sizeIncrement > 0 ? size.toFixed(2) : size} ${this.byteSize[sizeIncrement]}`
          }
        }
        this.store.dispatch(AttachmentActions.addAttachment({ attachment }))
      });
    });
  }

  onAdd() {
    this.store.dispatch(AttachmentActions.uploadAttachmentsInit());
  }

  onDeleteFile(file: Attachment) {
    this.store.dispatch(AttachmentActions.removeAttachment({ id: file.id }))
  }

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateReturn: false,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}