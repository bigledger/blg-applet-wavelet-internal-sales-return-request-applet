import { Routes } from "@angular/router";
import { DefaultSettingsComponent } from "./components/settings-container/default-settings/default-settings.component";
import { FieldConfigurationComponent } from "projects/shared-utilities/modules/permission/field-configuration/field-configuration/field-configuration.component";
import { WebhookComponent } from "projects/shared-utilities/modules/settings/webhook/webhook.component";
import { SidebarComponent } from "projects/shared-utilities/modules/personalization/sidebar/sidebar.component";
import { FourOhFourComponent } from "projects/shared-utilities/utilities/four-oh-four/four-oh-four.component";
import { SettingsContainerComponent } from "./components/settings-container/settings-container.component";
import { PersonalizationContainerComponent } from "./components/personalization-container/personalization-container.component";
import { PersonalDefaultSettingsComponent } from "./components/personalization-container/personal-default-settings/personal-default-settings.component";
import { FeatureVisibilityComponent } from "projects/shared-utilities/modules/settings/feature-visibility/feature-visibility.component";
import { PermissionSetContainerComponent } from "projects/shared-utilities/modules/permission/permission-container/permission-set/permission-set-container.component";
import { UserPermissionContainerComponent } from "projects/shared-utilities/modules/permission/permission-container/user-permission/user-permission-container.component";
import { TeamPermissionContainerComponent } from "projects/shared-utilities/modules/permission/permission-container/team-permission/team-permission-container.component";
import { RolePermissionContainerComponent } from "projects/shared-utilities/modules/permission/permission-container/role-permission/role-permission-container.component";
import { PermissionResolver } from "./resolver/permission.resolver";
import { SalesReturnContainerComponent } from "./components/sales-return-container/sales-return-container.component";
import { LineItemsContainerComponent } from "./components/line-items-container/line-items-container.component";
import { PrintableFormatSettingsContainerComponent } from "./components/settings-container/printable-format-settings-container/printable-format-settings-container.component";
import { ClientSidePermissionSetContainerComponent } from "projects/shared-utilities/modules/permission/permission-container/client-side-permission/client-side-permission-container.component";
import { WorkflowSettingsContainerComponent } from "./components/settings-container/workflow-settings-container/workflow-settings-container.component";
import { PermissionWizardContainerComponent } from "projects/shared-utilities/modules/permission/permission-container/permission-wizard/permission-wizard-container.component";
import { ReasonSettingsContainerComponent } from "./components/settings-container/reason-settings-container/reason-settings.container.component";
import { ManualIntercompanyTransactionComponent } from "./components/manual-intercompany-transaction/manual-intercompany-transaction.component";
import { SalesReturnFileExportListingComponent } from "./components/sales-return-file-export/sales-return-file-export-listing/sales-return-file-export.component";
// import { SalesReturnContainerComponent } from './components/sales-return-container/sales-return-container.component';
// import { LineItemsContainerComponent } from './components/line-items-container/line-items-container.component';
import { ReleaseNotesComponent } from './components/settings-container/release-notes/release-notes.component';
import { AppletLogComponent } from './components/settings-container/applet-log/applet-log.component';
import { BranchSettingsContainerComponent } from './components/settings-container/branch-settings/branch-settings-container.component';
import { FileImportContainerComponent } from './components/file-import-container/file-import-container.component';

export const mainPath = "applets/tnt/wavelet/erp/internal-sales-return-applet";

export const AppRoutes: Routes = [
  {
    path: mainPath,
    children: [
      {
        path: "internal-sales-return",
        component: SalesReturnContainerComponent,
      },
      {
        path: "line-items",
        component: LineItemsContainerComponent,
      },
      {
        path: 'intercompany',
        component: ManualIntercompanyTransactionComponent
      },
      {
        path: 'file-export',
        component: SalesReturnFileExportListingComponent
      },
      {
        path: 'file-import',
        component: FileImportContainerComponent
      },
      {
        path: "settings",
        component: SettingsContainerComponent,
        children: [
          {
            path: "default-selection",
            component: DefaultSettingsComponent,
          },
          {
            path: "field-settings",
            component: FieldConfigurationComponent,
          },
          {
            path: 'return-reasons-settings',
            component: ReasonSettingsContainerComponent
          },
          {
            path: "printable-format-settings",
            component: PrintableFormatSettingsContainerComponent,
          },
          {
            path: "workflow-settings",
            component: WorkflowSettingsContainerComponent,
          },
          {
            path: "webhook",
            component: WebhookComponent,
          },

          {
            path: "feature-visibility",
            component: FeatureVisibilityComponent,
          },
          {
            path: "client-side-permission-listing",
            component: ClientSidePermissionSetContainerComponent,
          },
          {
            path: "permission-wizard-listing",
            component: PermissionWizardContainerComponent,
            resolve: { targetServices: PermissionResolver },
          },
          {
            path: "permission-set-listing",
            component: PermissionSetContainerComponent,
            resolve: {
              targetServices: PermissionResolver,
            },
          },
          {
            path: "user-permission-listing",
            component: UserPermissionContainerComponent,
            resolve: { targetServices: PermissionResolver }
          },
          {
            path: "team-permission-listing",
            component: TeamPermissionContainerComponent,
          },
          {
            path: "role-permission-listing",
            component: RolePermissionContainerComponent,
          },
          {
            path: 'release-notes',
            component: ReleaseNotesComponent
          },
          {
            path: 'applet-log',
            component: AppletLogComponent
          },
          {
            path: "",
            redirectTo: "feature-visibility",
            pathMatch: "full",
          },
          {
            path: 'branch-settings',
            component: BranchSettingsContainerComponent
          },
        ],
      },
      {
        path: "personalization",
        component: PersonalizationContainerComponent,
        children: [
          {
            path: "personal-default-selection",
            component: PersonalDefaultSettingsComponent,
          },
          {
            path: "sidebar",
            component: SidebarComponent,
          },
        ],
      },
      {
        path: "404",
        component: FourOhFourComponent,
      },
      {
        path: "",
        redirectTo: `internal-sales-return`,
        pathMatch: "full",
      },
      {
        path: "**",
        redirectTo: `404`,
        pathMatch: "full",
      },
    ],
  },
  {
    path: "404",
    component: FourOhFourComponent,
  },
  {
    path: "**",
    redirectTo: `${mainPath}`,
    pathMatch: "full",
  },
];
