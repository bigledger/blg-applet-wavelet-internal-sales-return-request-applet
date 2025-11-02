import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {map, mergeMap, switchMap, tap, toArray} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {ApiVisa, AppletHeaderService, SubQueryService, UserProfileService} from 'blg-akaun-ts-lib';
import {UserAuthService} from '../../../../services/user-auth-service';
import {IamDexieService} from '../../../../services/appletDexie.service';
import {TenantService} from '../../../../services/tenant.service';

@Component({
  selector: 'app-default-launchpad-panel',
  templateUrl: './default-launchpad-panel.component.html',
  styleUrls: ['./default-launchpad-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DefaultLaunchpadPanelComponent implements OnInit {
  searchInput;
  apiVisa: ApiVisa = {tenantCode: 'akaun_master', jwt_secret: localStorage.getItem('authToken')};
  installedApplets$: Observable<any>;
  installedApplets = [];

  // TODO add this to the lib
  constructor(private  userProfileService: UserProfileService,
              private   appletService: AppletHeaderService,
              private subQueryService: SubQueryService, private userAuthService: UserAuthService,
              private iamDexieService: IamDexieService,
              private tenantService: TenantService,
  private router: Router,
  ) {
    userAuthService.isLoginSubject.next(true);
  }

  ngOnInit() {
    console.log('default launchpad panel===========');
  //  this.iamDexieService.initialiseDB('applet_settings'); // Initialise the table
/*    let query = 'SELECT hdr.guid as neededguid FROM bl_applet_hdr as hdr inner join bl_applet_login_subject_link as loginApplets on hdr.guid = loginApplets.applet_hdr_guid\n' +
      ' where loginApplets.app_login_guid =  \'' + localStorage.getItem('guid')  + '\' AND loginApplets.status = \'ACTIVE\' ';

    this.subQueryService.post({'subquery': query, 'table': 'bl_applet_hdr'}, this.apiVisa).pipe(
      switchMap((guidList: any) => guidList.data),
      mergeMap((guid: any ) => this.appletService.getByGuid(guid, this.apiVisa)),
      map((appletHdrResp: any) => appletHdrResp.data.appletHdr),
      tap((appletHdrResp: any) => appletHdrResp.data),
      toArray()
    ).subscribe((data) => {
      console.log(data);
      this.installedApplets.push({
        guid: '',
        code: null,
        applet_type: 'DEFAULT',
        name: 'Applet Store',
        description: 'Applet',
        provider_guid: null,
        property_json: {
          id: 4,
          routerLink: '/app-store-applet/home',
          name: 'Applet Store',
          project: 'Applets',
          faIcon: 'calendar-check',
          faIconSecondary: '',
          programmer: 'Hassan',
          programmerAvatar: 'assets/core/avatars/hassan.jpg',
          programmer2: '',
          programmer2Avatar: '',
          remarks: '',
          notification: 0,
          background: 'bg-primary',
        },
        status: 'ACTIVE',
        revision: null,
        vrsn: null,
      });
      this.installedApplets.push({
        guid: '',
        code: 'akaun_organisation_applet',
        applet_type: 'DEFAULT',
        name: 'Organisation Applet',
        description: 'Applet',
        provider_guid: null,
        property_json: {
          id: 4,
          routerLink: '/organisation-applet/pricebook-listing',
          tenantCode: 'tnt_hassan_code',
          name: 'Organisation Applet',
          project: 'Applets',
          faIcon: 'calendar-check',
          faIconSecondary: '',
          programmer: 'Hassan',
          programmerAvatar: 'assets/core/avatars/hassan.jpg',
          programmer2: '',
          programmer2Avatar: '',
          remarks: '',
          notification: 0,
          background: 'bg-primary',
        },
        status: 'ACTIVE',
        revision: null,
        vrsn: null,
      });

      this.installedApplets.push(...data);
    });*/
    //   .subscribe((appletObjList: any) => {
    //   console.log('subscribe: ', appletObjList);
    // });

    this.installedApplets.push({
      guid: '',
      code: 'akaun_organisation_applet',
      applet_type: 'DEFAULT',
      name: 'Organisation Applet Senheng',
      description: 'Applet',
      provider_guid: null,
      property_json: {
        id: 4,
        routerLink: '/example-applet/pricebook-listing',
        tenantCode: 'samira',
        name: 'Organisation Applet',
        project: 'Applets',
        faIcon: 'calendar-check',
        faIconSecondary: '',
        programmer: 'Hassan',
        programmerAvatar: 'assets/core/avatars/hassan.jpg',
        programmer2: '',
        programmer2Avatar: '',
        remarks: '',
        notification: 0,
        background: 'bg-primary',
      },
      status: 'ACTIVE',
      revision: null,
      vrsn: null,
    });
    this.installedApplets.push({
      guid: '',
      code: 'akaun_organisation_applet',
      applet_type: 'DEFAULT',
      name: 'Organisation Applet hassan',
      description: 'Applet',
      provider_guid: null,
      property_json: {
        id: 4,
        routerLink: '/example-applet/pricebook-listing',
        tenantCode: 'tnt_hassan_code',
        name: 'Organisation Applet',
        project: 'Applets',
        faIcon: 'calendar-check',
        faIconSecondary: '',
        programmer: 'Hassan',
        programmerAvatar: 'assets/core/avatars/hassan.jpg',
        programmer2: '',
        programmer2Avatar: '',
        remarks: '',
        notification: 0,
        background: 'bg-primary',
      },
      status: 'ACTIVE',
      revision: null,
      vrsn: null,
    });
    console.log('this.installedApplets==========', this.installedApplets);
  }

  routeToApplet(code: any, data: any, tenantCode: any) {
    // localStorage.setItem(code + '_tenantCode', tenantCode);
    // this.iamDexieService.add(tenantCode, code);
    // this.iamDexieService.put(tenantCode, code);
    // this.iamDexieService.get(code).then((value: any) =>  {
    //   this.tenantService.setCode(value);
    //   TenantService.tenantCode = value;
    // });
    this.router.navigate([data], {queryParams: {'tenantCode': tenantCode}});
  }
}
