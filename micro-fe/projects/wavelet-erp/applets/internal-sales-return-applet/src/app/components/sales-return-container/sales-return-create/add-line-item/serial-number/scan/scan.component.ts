import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ComponentStore } from '@ngrx/component-store';
import * as $ from 'jquery';
import Quagga from 'quagga';
import { SubSink } from 'subsink2';

interface LocalState {
  quaggaStatus: 'idle' | 'initializing' | 'ready';
}

@Component({
  selector: 'app-serial-number-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css'],
  providers: [ComponentStore]
})
export class SerialNumberScanComponent implements OnInit, OnDestroy {

  @Output() serialNumber = new EventEmitter<string>();

  private subs = new SubSink();

  readonly quaggaStatus$ = this.componentStore.select(state => state.quaggaStatus);

  form: FormGroup;
  delimiter: string;
  invalid: boolean;

  constructor(
    private readonly componentStore: ComponentStore<LocalState>) {
    this.componentStore.setState({
      quaggaStatus: 'idle',
    });
  }

  ngOnInit() {
    this.form = new FormGroup({
      serialNumber: new FormControl(),
      delimiter: new FormControl(null),
      from: new FormControl(),
      to: new FormControl(),
      readers: new FormControl('code_128_reader'),
    });
  }

  onScan() {
    this.componentStore.patchState(state => ({ ...state, quaggaStatus: 'initializing' }));
    this.form.controls['readers'].disable();
    Quagga.init({
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: document.querySelector('#camera')
      },
      decoder: {
        readers: [this.form.getRawValue().readers]
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
      this.componentStore.patchState(state => ({ ...state, quaggaStatus: 'ready' }));
      Quagga.start();
    });
    Quagga.onDetected((data) => {
      this.componentStore.patchState(state => ({
        ...state,
      }));
      this.serialNumber.emit(data.codeResult.code);
      $('#camera').hide();
      this.componentStore.patchState(state => ({ ...state, quaggaStatus: 'idle' }));
      Quagga.stop();
      this.form.controls['readers'].enable();
    });
  }

  onStop() {
    $('#camera').hide();
    this.componentStore.patchState(state => ({ ...state, quaggaStatus: 'idle' }));
    Quagga.stop();
    this.form.controls['readers'].enable();
  }

  onDelimiterSelected(event) {
    this.delimiter = event;
  }

  onAdd(fromScanner?: string) {
    // input from scanner
    if (fromScanner) this.addToList(fromScanner);

    const input = this.form.controls['serialNumber'].value;
    if (input && !fromScanner) {
      if (this.delimiter) {
        input.split(this.delimiter).forEach(sn => this.addToList(sn));
      } else {
        this.addToList(input);
      }
    }
    this.form.controls['serialNumber'].reset();
  }

  onAddRange() {
    const from = this.form.controls['from'].value;
    const to = this.form.controls['to'].value;
    const regex = /\d*$/;
    if (from && to && from.split(regex)[0] === to.split(regex)[0] && from.match(regex) && to.match(regex)) {
      const first = parseInt(from.match(regex)[0]);
      const last = parseInt(to.match(regex)[0]);
      if (first && last && last > first && last - first < 2000) {
        Array.from(Array(last - first + 1), (_, a) => from.split(regex)[0] + (first + a)).forEach(
          sn => this.addToList(sn)
        );
      }
    }
  }

  addToList(sn: string) {
    this.serialNumber.emit(sn.trim());
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}