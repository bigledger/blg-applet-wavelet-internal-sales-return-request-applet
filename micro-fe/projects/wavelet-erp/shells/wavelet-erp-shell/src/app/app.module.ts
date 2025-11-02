import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule, OnDestroy} from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DemoMaterialModule} from './demo-material-module';
import {FormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {HttpClientModule} from '@angular/common/http';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {ToastrModule} from 'ngx-toastr';
import {LayoutComponent} from './layout/layout.component';
import {SpinnerComponent} from './shared/spinner.component';
import {AppHeaderComponent} from './layout/header/header.component';
import {AppSidebarComponent} from './layout/sidebar/sidebar.component';
import {SharedModule} from './shared/shared.module';
import {AppRoutingModule} from './app.routing';
import {AppBlankComponent} from './layout/blank/blank.component';
import {AkaunShellDexieService} from './core/akaun-shell-dexie.service';
import {LandingPageComponent} from './layout/landing-page/landing-page.component';
import {AkaunShellService} from './shared/services/akaun-shell.service';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true
};

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LayoutComponent,
    SpinnerComponent,
    AppHeaderComponent,
    AppSidebarComponent,
    AppBlankComponent,
    // SignUpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule,
    FlexLayoutModule,
    HttpClientModule,
    PerfectScrollbarModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
    ToastrModule.forRoot(
      {
        timeOut: 10000,
        positionClass: 'toast-top-center',
        preventDuplicates: true
      }
    ),
    // RouterModule.forRoot(AppRoutes, {useHash: true})
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    AkaunShellService,
  ],
  bootstrap: [AppComponent]
  , schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
