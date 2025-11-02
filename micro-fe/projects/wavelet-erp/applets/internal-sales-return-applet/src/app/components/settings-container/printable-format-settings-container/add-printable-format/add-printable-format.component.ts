import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { Attachment } from '../../../../models/attachment.model';
import { PrintableFormatActions } from '../../../../state-controllers/printable-format-controller/store/actions';
import { PrintableFormatStates } from '../../../../state-controllers/printable-format-controller/store/states';

interface LocalState {
  deactivateReturn: boolean;
}

@Component({
  selector: 'app-add-printable-format',
  templateUrl: './add-printable-format.component.html',
  styleUrls: ['./add-printable-format.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [ComponentStore]
})
export class AddPrintableFormatComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Add Printable Format';
  protected readonly index = 1;
  protected localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);

  prevIndex: number;
  protected prevLocalState: any;

  public form: FormGroup;
  byteSize = ['Bytes', 'KB', 'MB'];
  attachment: Attachment;

  constructor(
    private viewColFacade: ViewColumnFacade,
    private readonly componentStore: ComponentStore<LocalState>,
    protected readonly store: Store<PrintableFormatStates>) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });

    this.form = new FormGroup({
      formatCode: new FormControl('', Validators.required),
      formatName: new FormControl('', Validators.required)
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
        this.attachment = attachment
      });
    });
  }

  onAdd() {
    const data = {
      "attachment": this.attachment,
      "formatCode": this.form.value.formatCode,
      "formatName": this.form.value.formatName
    }
    this.store.dispatch(PrintableFormatActions.createPrintableFormatInit({ draftData: data }));
  }

  onDeleteFile() {
    this.attachment = null
  }

  disableAdd() {
    return !this.attachment || !this.attachment.fileAttributes.fileName.endsWith('.jrxml') || this.form.invalid
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
