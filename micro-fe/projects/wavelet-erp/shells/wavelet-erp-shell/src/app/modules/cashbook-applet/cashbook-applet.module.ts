import {CUSTOM_ELEMENTS_SCHEMA, NgModule, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LoadMFScriptService} from 'blg-akaun-ts-lib';
import '@elements/wavelet-erp/applets/cashbook-applet/test/cashbook-applet-elements';
import { CashbookAppletComponent } from './cashbook-applet.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '**',
        component: CashbookAppletComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    CashbookAppletComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  bootstrap: [CashbookAppletComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CashbookAppletModule implements OnInit {

  constructor(private loadMFScriptService: LoadMFScriptService) {
    console.log('DeveloperMaintenanceModule 1 loaded locally');
    // this.loadMFScriptService.loadScript('https://akaun-applets.s3-ap-southeast-1.amazonaws.com/bigledger/akaun-platform/developer-maintenance-applet/developer-maintenance-applet-elements.js');
    console.log('DeveloperMaintenanceModule 2');

  }
  ngOnInit() {
    console.log('DeveloperMaintenanceModule 3');
  }
}
