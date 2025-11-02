import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LayoutComponent} from './layout/layout.component';
import {LandingPageComponent} from './layout/landing-page/landing-page.component';
import {AuthGuard} from './guards/auth.guard';
import {AKAUN_GROUP_MAINTENANCE_APPLET} from '../../../../../AppletsRouters';
import {AKAUN_GRN_APPLET} from '../../../../../AppletsRouters';

const AppRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        component: LandingPageComponent,
      },
      {
        path: '',
        redirectTo: 'delivery-installation-applet',
        pathMatch: 'full',
      },
      {
        path: 'example-applet',
        loadChildren: () => import('./modules/example-applet/example-applet.module').then(m => m.ExampleAppletModule),
      },
      {
        path: 'cashbook-applet',
        loadChildren: () => import('./modules/cashbook-applet/cashbook-applet.module').then(m => m.CashbookAppletModule),
      },
      {
        path: 'delivery-installation-applet',
        loadChildren: () => import('./modules/delivery-installation-applet/delivery-installation-applet.module').then(m => m.DeliveryInstallationAppletModule),
      },
      {
        path: 'launchpad-applet',
        loadChildren: () => import('./modules/launchpad-container/launchpad-container.module').then(m => m.LaunchpadContainerModule),
        canActivate: [AuthGuard]
      }
    ],
    // pathMatch: 'full',
  },
  {
    path: 'refresh',
    component: LayoutComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(AppRoutes, {useHash: true})],

  exports: [RouterModule]
})
export class AppRoutingModule {
}
