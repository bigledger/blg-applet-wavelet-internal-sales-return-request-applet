import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink2';

@Component({
  selector: 'app-field-configuration',
  templateUrl: './field-configuration.component.html',
  styleUrls: ['./field-configuration.component.css']
})
export class FieldConfigurationComponent implements OnInit, OnDestroy {

  private subs = new SubSink();

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
