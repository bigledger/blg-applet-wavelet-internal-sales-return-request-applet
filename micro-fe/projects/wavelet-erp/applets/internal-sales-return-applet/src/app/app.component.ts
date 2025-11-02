import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import {
  ClientSidePermissionRoleLinksBackofficeService,
  ClientSidePermissionService,
  ClientSidePermissionTeamLinkService,
  ClientSideTenantPermissionService,
  IdentityTokenService,
  LinkSubjectToTeamService,
  Pagination,
  TenantUserRoleService,
} from "blg-akaun-ts-lib";
import { ClientSidePermissionsActions } from "projects/shared-utilities/modules/permission/client-side-permissions-controller/actions";
import { ClientSidePermissionsSelectors } from "projects/shared-utilities/modules/permission/client-side-permissions-controller/selectors";
import { ClientSideViewModel } from "projects/shared-utilities/modules/permission/client-side-permissions-controller/states/client-side-permission.states";
import { PermissionStates } from 'projects/shared-utilities/modules/permission/permission-controller';
import { UserPermInquriyActions } from 'projects/shared-utilities/modules/permission/user-permissions-inquiry-controller/actions';
import { SessionStates } from "projects/shared-utilities/modules/session/session-controller/states";
import { AppConfig } from "projects/shared-utilities/visa";
import { from, of } from "rxjs";
import { catchError, map, mergeMap, toArray } from "rxjs/operators";
import { mainPath } from "./app.routing";
import { menuItems } from "./models/menu-items";
import { SubSink } from "subsink2"
import { SessionSelectors } from "projects/shared-utilities/modules/session/session-controller/selectors";
import { AppletSettings } from './models/applet-settings.model';
import { combineLatest } from 'rxjs';


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  // readonly appletName = 'Internal-sales-return-applet';
  // readonly menuItems = menuItems;
  // readonly mainPath = mainPath;

  // constructor(
  //   private router: Router) {
  // }

  // ngOnInit() {
  //   this.router.initialNavigation();
  // }
  readonly appletName = "Internal-sales-return-applet";
  menuItems = menuItems;
  readonly mainPath = mainPath;

  protected subs = new SubSink();

  SHOW_INTERCOMPANY_MENU = false;
  SHOW_FILE_EXPORT_MENU = false;

  constructor(
    private router: Router,
    private readonly sessionStore: Store<SessionStates>,
    private tokenService: IdentityTokenService,
    private linkSubjectToRoleService: TenantUserRoleService,
    private clientSidePermissionRoleLinkService: ClientSidePermissionRoleLinksBackofficeService,
    private clientSidePermissionService: ClientSideTenantPermissionService,
    private readonly permissionStore: Store<PermissionStates>,
  ) {}

  masterSettings$ = this.sessionStore.select(
    SessionSelectors.selectMasterSettings
  );

  clientSidePermissionSettings: any;
  clientSidePermissions$ = this.permissionStore.select(
    ClientSidePermissionsSelectors.selectAll
  );

  appletSettings: AppletSettings;

  async ngOnInit() {

    this.subs.sink = combineLatest([ this.clientSidePermissions$, this.masterSettings$ ]).subscribe({
      next: ([permissions, appletSettings]) => {
        permissions.forEach((permission) => {
          if (permission.perm_code === "SHOW_INTERCOMPANY_MENU") {
            this.SHOW_INTERCOMPANY_MENU = true;
          }
          if (permission.perm_code === "SHOW_FILE_EXPORT_MENU") {
            this.SHOW_FILE_EXPORT_MENU = true;
          }
        });
        this.appletSettings = appletSettings;

        const originalIndices = new Map<string, number>();

        // Helper function to add or remove menu items based on a condition
        const updateMenuItem = (state: string, hide: boolean) => {
          const itemIndex = menuItems.findIndex(item => item.state === state);
          const menuItem = menuItems[itemIndex];

          if (hide) {
            // Remove the item if the condition is true
            this.menuItems = this.menuItems.filter(item => item.state !== state);
          } else {
            // Add the item back at the original index if it's not present
            if (menuItem && !this.menuItems.some(item => item.state === state)) {
              this.menuItems.splice(itemIndex, 0, menuItem);
            }
          }
        };

        updateMenuItem( "intercompany", !this.SHOW_INTERCOMPANY_MENU && this.appletSettings.HIDE_INTERCOMPANY_MENU );
        updateMenuItem( "file-export", !this.SHOW_FILE_EXPORT_MENU && this.appletSettings.HIDE_FILE_EXPORT_MENU );
      },
    });

    let dto = {
      app_permission_dto: [
        {
          permDfn: "TNT_API_DOC_INTERNAL_SALES_RETURN_READ_TGT_GUID",
        },
        {
          permDfn: "TNT_API_DOC_INTERNAL_SALES_RETURN_CREATE_TGT_GUID",
        },
        {
          permDfn: "TNT_API_DOC_INTERNAL_SALES_RETURN_UPDATE_TGT_GUID",
        },
        {
          permDfn: "TNT_API_DOC_INTERNAL_SALES_RETURN_DELIVERY_BRANCH_READ",
        },
        {
          permDfn: "TNT_TENANT_ADMIN",
        },
        {
          permDfn: "TNT_TENANT_OWNER",
        },
      ],
      applet_guid : sessionStorage.getItem("appletGuid")
    };
    this.permissionStore.dispatch(
      UserPermInquriyActions.loadUserPermissionInquiryInit({
        request: dto,
      })
    );

    await this.tokenService
      .getRefreshToken(
        [
          {
            tenantCode: sessionStorage.getItem("tenantCode"),
            appletCode: sessionStorage.getItem("appletCode"),
          },
        ],
        AppConfig.apiVisa
      )
      .toPromise()
      .then((resolve) => {
        sessionStorage.setItem("appletToken", resolve.data[0].token);
        AppConfig.setAppletToken();
      });

    await this.linkSubjectToRoleService
      .getByCriteria(
        new Pagination(0, 1000, [
          {
            columnName: "app_subject_guid",
            operator: "=",
            value: sessionStorage
              .getItem("appletLoginSubjectLinkGuid")
              .toString(),
          },
        ]),
        AppConfig.apiVisa
      )
      .pipe(
        map((response) => response.data),
        mergeMap((links) =>
          from(links).pipe(
            mergeMap((teamGuid) => {
              return this.clientSidePermissionRoleLinkService
                .getByCriteria(
                  new Pagination(0, 1000, [
                    {
                      columnName: "role_guid",
                      operator: "=",
                      value:
                        teamGuid.link_subject_to_role.app_mst_role_guid.toString(),
                    },
                    {
                      columnName: "applet_guid",
                      operator: "=",
                      value: sessionStorage.getItem("appletGuid"),
                    },
                  ]),
                  AppConfig.apiVisa
                )
                .pipe(
                  map((result) => result.data),
                  mergeMap((links) =>
                    from(links).pipe(
                      mergeMap((link) => {
                        console.log("Link", link);
                        return this.clientSidePermissionService
                          .getByGuid(
                            link.bl_applet_client_side_perm_to_role_link.client_perm_guid.toString(),
                            AppConfig.apiVisa
                          )
                          .pipe(map((result) => result.data));
                      })
                    )
                  )
                );
            })
          )
        ),
        toArray(),
        map((a) =>
          a.map(
            (p) =>
              <ClientSideViewModel>{
                guid: p.bl_applet_client_side_perm_dfn.guid,
                perm_code: p.bl_applet_client_side_perm_dfn.perm_code,
              }
          )
        ),
        map((permissions) => {
          ClientSidePermissionsActions.clientSidePermissionsSuccess({
            permissions,
          });
        }),
        catchError((error) =>
          of(
            ClientSidePermissionsActions.clientSidePermissionsFailed({ error })
          )
        )
      )
      .toPromise();

    this.router.initialNavigation();
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }
}
