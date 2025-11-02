import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { PrintableFormatService } from 'blg-akaun-ts-lib';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { EMPTY, iif, of } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { Attachment } from '../../../../models/attachment.model';
import { PrintableFormatActions } from '../../../../state-controllers/printable-format-controller/store/actions';
import { PrintableFormatSelectors } from '../../../../state-controllers/printable-format-controller/store/selectors';
import { PrintableFormatStates } from '../../../../state-controllers/printable-format-controller/store/states';

interface LocalState {
  deactivateReturn: boolean;
  deactivateAdd: boolean;
  deactivateList: boolean;
  selectedIndex: number;
  deleteConfirmation: boolean;
}

@Component({
  selector: 'app-edit-printable-format',
  templateUrl: './edit-printable-format.component.html',
  styleUrls: ['./edit-printable-format.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [ComponentStore]
})
export class EditPrintableFormatComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Edit Printable Format';
  protected readonly index = 2;
  protected localState: LocalState;


  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);
  readonly deleteConfirmation$ = this.componentStore.select(state => state.deleteConfirmation);

  prevIndex: number;
  protected prevLocalState: any;
  deleteConfirmation: boolean;
  public form: FormGroup;
  byteSize = ['Bytes', 'KB', 'MB'];
  attachment: Attachment;

  printableData$ = this.store.select(PrintableFormatSelectors.selectPrintableFormat)

  constructor(
    private viewColFacade: ViewColumnFacade,
    private readonly componentStore: ComponentStore<LocalState>,
    private readonly printableFormatService: PrintableFormatService,
    protected readonly store: Store<PrintableFormatStates>) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.subs.sink = this.deleteConfirmation$.pipe(
      mergeMap(a => {
        return iif(() => a, of(a).pipe(delay(3000)), of(EMPTY));
      })
    ).subscribe(resolve => {
      if (resolve === true) {
        this.componentStore.patchState({ deleteConfirmation: false });
        this.deleteConfirmation = false;
      }
    });

    this.form = new FormGroup({
      formatCode: new FormControl('', Validators.required),
      formatName: new FormControl('', Validators.required)
    });

    this.subs.sink = this.printableData$.subscribe((resolved: any) => {
      this.form.patchValue({
        formatCode: resolved.bl_prt_printable_format_hdr.code,
        formatName: resolved.bl_prt_printable_format_hdr.name,
      });

      const propertyJson = <any>resolved.bl_prt_printable_format_hdr.property_json

      this.attachment = {
        "file": resolved.file ? resolved.file : null,
        "fileSRC": propertyJson.fileSRC ? propertyJson.fileSRC : null,
        "fileAttributes": propertyJson.fileAttributes ? propertyJson.fileAttributes : null
      }
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

  onSave() {
    const data = {
      "attachment": this.attachment,
      "formatCode": this.form.value.formatCode,
      "formatName": this.form.value.formatName,
    }
    this.store.dispatch(PrintableFormatActions.editPrintableFormatInit({ draftData: data }));
  }

  onDeleteFile() {
    this.attachment = null
  }

  disableSave() {
    return !this.attachment || !this.attachment.fileAttributes?.fileName.endsWith('.jrxml') || this.form.invalid
  }

  onDelete() {
    if (this.deleteConfirmation) {
      this.store.dispatch(PrintableFormatActions.deletePrintableFormatInit());
      this.deleteConfirmation = false;
      this.componentStore.patchState({ deleteConfirmation: false });
    } else {
      this.deleteConfirmation = true;
      this.componentStore.patchState({ deleteConfirmation: true });
    }
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
