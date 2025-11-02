import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LayoutComponent} from './layout/layout.component';
import {LandingPageComponent} from './layout/landing-page/landing-page.component';
import {AuthGuard} from './guards/auth.guard';

const AppRoutes: Routes = [
  // DONT ADD ANY ROUTE BEFORE THE EMPTY ROUTE, IT IS USED IN app.component AND LAUNCHPAD container
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
        redirectTo: 'launchpad-applet',
        pathMatch: 'full',
      },
      // {
      //   path: 'example-applet',
      //   loadChildren: () => import('./modules/example-applet/example-applet.module').then(m => m.ExampleAppletModule),
      // },
      // {
      //   path: 'applet-loader',
      //   loadChildren: () => import('./modules/applet-loader/applet-loader.module').then(m => m.AppletLoaderModule),
      // },
      {
        path: 'launchpad-applet',
        loadChildren: () => import('./modules/launchpad-container/launchpad-container.module').then(m => m.LaunchpadContainerModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'applet-loader',
        loadChildren: () => import('./modules/applet-loader/applet-loader.module').then(m => m.AppletLoaderModule),
        data: {appletLoader: true}
      },
    ],
    // pathMatch: 'full',
  },
  {
    path: 'refresh',
    component: LayoutComponent,
  },
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(AppRoutes, {useHash: true})],

  exports: [RouterModule]
})
export class AppRoutingModule {
}
