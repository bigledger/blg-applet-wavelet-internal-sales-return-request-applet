import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SubSink } from 'subsink2';
import Quagga from 'quagga';
import * as $ from 'jquery';
import { ComponentStore } from '@ngrx/component-store';

interface LocalState {
  quaggaStatus: 'idle' | 'initializing' | 'ready';
}

@Component({
  selector: 'app-edit-serial-number-scan',
  templateUrl: './serial-number-scan.component.html',
  styleUrls: ['./serial-number-scan.component.scss'],
  providers: [ComponentStore]
})
export class EditLineItemSerialNumberScanComponent implements OnInit, OnDestroy {

  @Output() serialNumber = new EventEmitter<string>();

  private subs = new SubSink();

  readonly quaggaStatus$ = this.componentStore.select(state => state.quaggaStatus);

  form: FormGroup;

  constructor(
    private readonly componentStore: ComponentStore<LocalState>
  ) {
    this.componentStore.setState({
      quaggaStatus: 'idle',
    });
  }

  ngOnInit() {
    this.form = new FormGroup({
      serialNumber: new FormControl(),
      readers: new FormControl('code_128_reader'),
    });
  }

  onScan() {
    this.componentStore.patchState(state => ({...state, quaggaStatus: 'initializing'}));
    this.form.controls['readers'].disable();
    Quagga.init({
      inputStream : {
        name : 'Live',
        type : 'LiveStream',
        target: document.querySelector('#camera')
      },
      decoder : {
        readers : [this.form.getRawValue().readers]
      }
    }, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        $('video').css({
          'width': '100%',
          'border': 'mediumslateblue 4px solid',
          'border-radius': '10px'
        });
        $('canvas').remove();
        $('#camera').show();
        this.componentStore.patchState(state => ({...state, quaggaStatus: 'ready'}));
        Quagga.start();
    });
    Quagga.onDetected((data) => {
      this.componentStore.patchState(state => ({
        ...state,
      }));
      this.serialNumber.emit(data.codeResult.code);
      $('#camera').hide();
      this.componentStore.patchState(state => ({...state, quaggaStatus: 'idle'}));
      Quagga.stop();
      this.form.controls['readers'].enable();
    });
  }

  onStop() {
    $('#camera').hide();
    this.componentStore.patchState(state => ({...state, quaggaStatus: 'idle'}));
    Quagga.stop();
    this.form.controls['readers'].enable();
  }

  onAdd() {
    this.serialNumber.emit(this.form.controls['serialNumber'].value);
    this.form.controls['serialNumber'].reset();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
