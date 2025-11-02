import { Routes } from '@angular/router';
import { DefaultLaunchpadPanelComponent } from './default-launchpad-panel/default-launchpad-panel.component';
import { CelmonzeLaunchpadPanelComponent } from './celmonze-launchpad-panel/celmonze-launchpad-panel.component';
import {LaunchpadContainerComponent} from './launchpad-container.component';

export const LaunchpadAppletRoutes: Routes = [
  {
    path: 'container',
    component: LaunchpadContainerComponent,
    children: [
      { path: 'default-panel', component:  DefaultLaunchpadPanelComponent},
      { path: 'celmonze-panel', component:  CelmonzeLaunchpadPanelComponent},
      { path: '**', redirectTo: 'default-panel' },
    ],
  },
  { path: '**', redirectTo: 'container' }
];
