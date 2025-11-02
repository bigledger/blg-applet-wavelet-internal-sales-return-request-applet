import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule, GridModule} from '@angular/flex-layout';
import {LaunchpadAppletRoutes} from './launchpad-container.routing';

import {DefaultLaunchpadPanelComponent} from './default-launchpad-panel/default-launchpad-panel.component';
import {CelmonzeLaunchpadPanelComponent} from './celmonze-launchpad-panel/celmonze-launchpad-panel.component';
import {MaterialModule} from '../../shared/material.module';
import {LaunchpadContainerComponent} from './launchpad-container.component';
import {AppSidebarComponent} from './sidebar/sidebar.component';
import {MatSidenavModule, MatSlideToggleModule} from '@angular/material';
import {PipesModule} from '../../../pipes/pipes.module';
import {UserAuthService} from '../../../services/user-auth-service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(LaunchpadAppletRoutes),
        FormsModule,
        MaterialModule,
        MatSidenavModule,
        MatSlideToggleModule,
        ReactiveFormsModule,
        GridModule,
        FlexLayoutModule,
        PipesModule,
    ],
  declarations: [
    LaunchpadContainerComponent,
    DefaultLaunchpadPanelComponent,
    CelmonzeLaunchpadPanelComponent,
    AppSidebarComponent,
  ],
  providers: [UserAuthService],
  entryComponents: []
})

export class LaunchpadContainerModule {
}
