import {Routes} from '@angular/router';
import { DefaultSettingsComponent } from './components/settings-container/default-settings/default-settings.component';
import { FieldConfigurationComponent } from './components/settings-container/field-configuration/field-configuration.component';
import { WebhookComponent } from 'projects/shared-utilities/modules/settings/webhook/webhook.component';
import { SidebarComponent } from 'projects/shared-utilities/modules/personalization/sidebar/sidebar.component';
import { FourOhFourComponent } from 'projects/shared-utilities/utilities/four-oh-four/four-oh-four.component';
import { SettingsContainerComponent } from './components/settings-container/settings-container.component';
import { PersonalizationContainerComponent } from './components/personalization-container/personalization-container.component';
import { PersonalDefaultSettingsComponent } from './components/personalization-container/personal-default-settings/personal-default-settings.component';
import { PermissionSetContainerComponent } from 'projects/shared-utilities/modules/permission/permission-container/permission-set/permission-set-container.component';
import { UserPermissionContainerComponent } from 'projects/shared-utilities/modules/permission/permission-container/user-permission/user-permission-container.component';
import { TeamPermissionContainerComponent } from 'projects/shared-utilities/modules/permission/permission-container/team-permission/team-permission-container.component';
import { RolePermissionContainerComponent } from 'projects/shared-utilities/modules/permission/permission-container/role-permission/role-permission-container.component';
import { CompanyContainerComponent } from './components/company-container/company-container.component';
import { GenericContainerComponent } from './components/generic-container/generic-container.component';
import { PermissionResolver } from './resolver/permission.resolver';
import { ClientSidePermissionSetContainerComponent } from 'projects/shared-utilities/modules/permission/permission-container/client-side-permission/client-side-permission-container.component';

export const mainPath = 'applets/akaun/dev/example-applet';

export const AppRoutes: Routes = [
  {
    path: mainPath,
    children: [
      {
        path: 'company',
        component: CompanyContainerComponent
      },
      {
        path: 'generic',
        component: GenericContainerComponent
      },
      {
        path: 'settings',
        component: SettingsContainerComponent,
        children: [
          {
            path: 'default-selection',
            component: DefaultSettingsComponent
          },
          {
            path: 'field-settings',
            component: FieldConfigurationComponent
          },
          {
            path: 'webhook',
            component: WebhookComponent
          },
          {
            path: 'client-side-permission-listing',
            component: ClientSidePermissionSetContainerComponent
          },
          {
            path: 'permission-set-listing',
            component: PermissionSetContainerComponent,
            resolve: {
              targetServices: PermissionResolver
            }
          },
          {
            path: 'user-permission-listing',
            component: UserPermissionContainerComponent
          },
          {
            path: 'team-permission-listing',
            component: TeamPermissionContainerComponent
          },
          {
            path: 'role-permission-listing',
            component: RolePermissionContainerComponent
          },
          {
            path: '',
            redirectTo: 'client-side-permission-listing',
            pathMatch: 'full'
          },
        ]
      },
      {
        path: 'personalization',
        component: PersonalizationContainerComponent,
        children: [
          {
            path: 'personal-default-selection',
            component: PersonalDefaultSettingsComponent
          },
          {
            path: 'sidebar',
            component: SidebarComponent
          },
        ]
      },
      {
        path: '404',
        component: FourOhFourComponent
      },
      {
        path: '',
        redirectTo: `company`,
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: `404`,
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '404',
    component: FourOhFourComponent
  },
  {
    path: '**',
    redirectTo: `${mainPath}`,
    pathMatch: 'full'
  },
];


