import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppletContainerModel, bl_applet_ext_RowClass } from 'blg-akaun-ts-lib';
import { AppConfig } from 'projects/shared-utilities/visa';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink2';

@Component({
  selector: 'app-personal-default-settings',
  templateUrl: './personal-default-settings.component.html',
  styleUrls: ['./personal-default-settings.component.css'],
})
export class PersonalDefaultSettingsComponent implements OnInit, OnDestroy {

  @Input() appletSettings$: Observable<AppletContainerModel>;

  @Output() save = new EventEmitter<AppletContainerModel>();

  private subs = new SubSink();

  apiVisa = AppConfig.apiVisa;

  branch = new FormControl();
  location = new FormControl();

  appletContainer: AppletContainerModel;

  constructor() { }

  ngOnInit() {
    // this.subs.sink = this.appletSettings$.subscribe({next: resolve => {
    //   if (resolve) {
    //     this.appletContainer = resolve;
    //     const branch = resolve.bl_applet_exts.find(x => x.param_code === 'APPLET_SETTINGS').value_json.DEFAULT_BRANCH;
    //     const location = resolve.bl_applet_exts.find(x => x.param_code === 'APPLET_SETTINGS').value_json.DEFAULT_LOCATION;
    //     this.branch.patchValue(branch);
    //     this.location.patchValue(location);
    //   }
    // }});
    this.subs.sink = this.branch.valueChanges.subscribe({next: resolve => {
      const exist = this.appletContainer.bl_applet_exts.find(x => x.param_code === 'APPLET_SETTINGS');
      if (exist) {
        this.appletContainer.bl_applet_exts.find(x => x.param_code === 'APPLET_SETTINGS').value_json = {
          ...this.appletContainer.bl_applet_exts.find(x => x.param_code === 'APPLET_SETTINGS').value_json,
          DEFAULT_BRANCH: resolve
        };
      } else {
        const appletExt = new bl_applet_ext_RowClass();
        appletExt.param_code = 'APPLET_SETTINGS';
        appletExt.param_name = 'APPLET_SETTINGS';
        appletExt.param_type = 'JSON';
        appletExt.value_json = {
          DEFAULT_BRANCH: resolve
        };
        this.appletContainer.bl_applet_exts.push(appletExt);
      }
    }});
    this.subs.sink = this.location.valueChanges.subscribe({next: resolve => {
      const exist = this.appletContainer.bl_applet_exts.find(x => x.param_code === 'APPLET_SETTINGS');
      if (exist) {
        this.appletContainer.bl_applet_exts.find(x => x.param_code === 'APPLET_SETTINGS').value_json = {
          ...this.appletContainer.bl_applet_exts.find(x => x.param_code === 'APPLET_SETTINGS').value_json,
          DEFAULT_LOCATION: resolve
        };
      } else {
        const appletExt = new bl_applet_ext_RowClass();
        appletExt.param_code = 'APPLET_SETTINGS';
        appletExt.param_name = 'APPLET_SETTINGS';
        appletExt.param_type = 'JSON';
        appletExt.value_json = {
          DEFAULT_LOCATION: resolve
        };
        this.appletContainer.bl_applet_exts.push(appletExt);
      }
    }});
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
