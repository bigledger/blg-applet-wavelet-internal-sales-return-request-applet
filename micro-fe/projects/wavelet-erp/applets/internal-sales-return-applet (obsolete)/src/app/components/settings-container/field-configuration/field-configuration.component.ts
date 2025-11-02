import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppletContainerModel, bl_applet_ext_RowClass } from 'blg-akaun-ts-lib';
import { AppConfig } from 'projects/shared-utilities/visa';
import { Observable } from 'rxjs';
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
