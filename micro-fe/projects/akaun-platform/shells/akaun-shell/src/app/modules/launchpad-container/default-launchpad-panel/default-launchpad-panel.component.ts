import {Compiler, Component, Injector, OnInit, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Route, Router} from '@angular/router';
import {
  ApiVisa,
  AppletHeaderService,
  GetUserAppletLinksModel,
  SubQueryService,
  UserAppletLinksService,
  UserProfileService
} from 'blg-akaun-ts-lib';
import {UserAuthService} from '../../../../services/user-auth-service';
import {IamDexieService} from '../../../../services/appletDexie.service';
import {TenantService} from '../../../../services/tenant.service';
import {AppletLoaderModule} from '../../applet-loader/applet-loader.module';
import {StorgeEnum} from '../../../models/storge.enum';
import {environment} from '../../../../environments/environment';
import {map, tap} from 'rxjs/operators';
import 'rxjs-compat/add/operator/map';

@Component({
  selector: 'app-default-launchpad-panel',
  templateUrl: './default-launchpad-panel.component.html',
  styleUrls: ['./default-launchpad-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DefaultLaunchpadPanelComponent implements OnInit {
  searchInput;
  apiVisa: ApiVisa = {api_domain_url: environment.api_domain, tenantCode: 'akaun_master', jwt_secret: localStorage.getItem('authToken')};
  installedApplets$: Observable<any>;
  installedApplets = [];
  installedApplets1: any[] = [];

  // TODO add this to the lib
  constructor(private  userProfileService: UserProfileService,
              private   appletService: AppletHeaderService,
              private userAppletLinksService: UserAppletLinksService,
              private injector: Injector,
              private subQueryService: SubQueryService, private userAuthService: UserAuthService,
              private iamDexieService: IamDexieService,
              private compiler: Compiler,
              private tenantService: TenantService,
              private router: Router,
  ) {
    userAuthService.isLoginSubject.next(true);
  }

  ngOnInit() {
    sessionStorage.clear();
    // https://api-test.akaun.com/core2/platform/dm/akaun-ng/user-applet-links
    const appletTest = {
      applet: {
        applet_name: 'Example Applet',
        routerlink: 'applets/akaun/dev/example-applet',
        applet_mf_html_tag: '<example-applet-elements-XXXXXXXX></example-applet-elements-XXXXXXXX>',
        es_module_url: 'https://akaun-applets.s3-ap-southeast-1.amazonaws.com/bigledger/akaun-template/example-applet/staging/example-applet-elements.js'
      },
      catalog: {
        catalog_code: 'az7',
        catalog_name: 'az7'
      },
      tenant: {
        tenant_code: 'tnt_hassan_code',
        tenant_name: 'hassna'
      }
    };

    const appletTest1 = {
      applet: {
        applet_name: 'Example Applet',
        routerlink: 'applets/akaun/dev/example-applet',
        applet_mf_html_tag: '<example-applet-elements-XXXXXXXX></example-applet-elements-XXXXXXXX>',
        es_module_url: 'https://akaun-applets.s3-ap-southeast-1.amazonaws.com/bigledger/akaun-template/example-applet/staging/example-applet-elements.js'
      },
      catalog: {
        catalog_code: 'az7',
        catalog_name: 'az7'
      },
      tenant: {
        tenant_code: 'celllabs_test',
        tenant_name: 'celllabs_test'
      }
    };

    const appletTest3 = {
      applet: {
        applet_name: 'Developer Applet New',
        routerlink: 'developer-applet',
        applet_mf_html_tag: '<developer-maintenance-applet-elements-XXXXXXXX></developer-maintenance-applet-elements-XXXXXXXX>',
        es_module_url: 'https://akaun-applets.s3-ap-southeast-1.amazonaws.com/bigledger/akaun-platform/akaun-developer-applet/staging/akaun-developer-applet-elements.js'
      },
      catalog: {
        catalog_code: 'az7',
        catalog_name: 'az7'
      },
      tenant: {
        tenant_code: 'akaun_master',
        tenant_name: 'akaun_master'
      }
    };

    const appletTest4 = {
      applet: {
        applet_name: 'Membership Applet',
        routerlink: 'membership-admin-console',
        applet_mf_html_tag: '<membership-admin-console-element-XXXXXXXX></membership-admin-console-element-XXXXXXXX>',
        es_module_url: 'https://akaun-applets.s3-ap-southeast-1.amazonaws.com/bigledger/akaun-platform/membership-admin-console-applet/staging/membership-admin-console-applet-elements.js'
      },
      catalog: {
        catalog_code: 'az7',
        catalog_name: 'az7'
      },
      tenant: {
        tenant_code: 'tnt_hassan_code',
        tenant_name: 'tnt_hassan_code'
      }
    };

    const appletTest5 = {
      applet: {
        applet_name: 'Membership Applet',
        routerlink: 'membership-admin-console',
        applet_mf_html_tag: '<membership-admin-console-element-XXXXXXXX></membership-admin-console-element-XXXXXXXX>',
        es_module_url: 'https://akaun-applets.s3-ap-southeast-1.amazonaws.com/bigledger/akaun-platform/membership-admin-console-applet/staging/membership-admin-console-applet-elements.js'
      },
      catalog: {
        catalog_code: 'az7',
        catalog_name: 'az7'
      },
      tenant: {
        tenant_code: 'celllabs_test',
        tenant_name: 'celllabs_test'
      }
    };

    console.log('===============appletTest============', appletTest);
    this.installedApplets1.push(appletTest);
    this.installedApplets1.push(appletTest1);
    this.installedApplets1.push(appletTest3);
    this.installedApplets1.push(appletTest4);
    this.installedApplets1.push(appletTest5);


    this.installedApplets$ = this.userAppletLinksService.get(this.apiVisa).pipe(
      map((list: any) => list.data.filter(userAppletLink => userAppletLink.status === 'ACTIVE')),
    );
  }


  createDynamic(index, applet: GetUserAppletLinksModel) {
    console.log('this.installedApplets =111==========', applet);
    const tenantCode = <string>applet.tenant.tenant_code;
    const es_module_url = <string>applet.applet.es_module_url;
    let appletMFTag = <string>applet.applet.applet_mf_html_tag;
    const routerLink = <string>applet.applet.routerlink;

    const num = Math.floor(Math.random() * 90000000) + 10000000;
    console.log('', num);
    appletMFTag = appletMFTag.replace('XXXXXXXX', num.toString());

      const appRoutes = [...this.router.config];
      appRoutes[0].children.forEach((appletRoute) => {
        if (appletRoute.data && appletRoute.data.appletLoader) {
          appletRoute.path = routerLink;
        }
      });

      this.router.resetConfig(appRoutes);
      sessionStorage.setItem(StorgeEnum.randomNumber, num.toString());
      sessionStorage.setItem(StorgeEnum.routerLink, routerLink);
      sessionStorage.setItem(StorgeEnum.es_module_url, es_module_url);
      sessionStorage.setItem(StorgeEnum.appletMFTag, appletMFTag);
      sessionStorage.setItem(StorgeEnum.tenantCode, tenantCode);

      this.router.navigate([routerLink]);
  }
}
