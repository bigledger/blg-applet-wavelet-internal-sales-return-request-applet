import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {OauthComponent} from './oauth.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '**',
        component: OauthComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    OauthComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  bootstrap: [OauthComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class OauthModule { }
