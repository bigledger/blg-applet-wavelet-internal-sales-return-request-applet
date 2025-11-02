import {CUSTOM_ELEMENTS_SCHEMA, NgModule, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AppletLoaderComponent} from './applet-loader.component';
import {LoadMFScriptService} from 'blg-akaun-ts-lib';
// import '@elements/akaun-platform/applets/developer-maintenance-applet/developer-maintenance-applet-elements';
// import '@elements/akaun-platform/applets/example-applet/example-applet-elements';
import {DynamicComponent} from './dynmic-component/dynamic.component';
import {SharedModule} from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '**',
        component: AppletLoaderComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    AppletLoaderComponent,
    DynamicComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    DynamicComponent,
  ],
  bootstrap: [AppletLoaderComponent],
  entryComponents: [
    DynamicComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppletLoaderModule implements OnInit {

  const;

  constructor(private loadMFScriptService: LoadMFScriptService) {
    console.log('DeveloperMaintenanceModule 1 loaded locally');
    // this.loadMFScriptService.loadScript('https://akaun-applets.s3-ap-southeast-1.amazonaws.com/bigledger/akaun-platform/developer-maintenance-applet/developer-maintenance-applet-elements.js');
    console.log('DeveloperMaintenanceModule 2');

  }

  ngOnInit() {
    console.log('DeveloperMaintenanceModule 3');
  }
}
