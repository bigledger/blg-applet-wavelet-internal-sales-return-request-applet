import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityTokenService } from 'blg-akaun-ts-lib';
import { AppConfig } from 'projects/shared-utilities/visa';
import { mainPath } from './app.routing';
import { menuItems } from './models/menu-items';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  readonly appletName = 'Internal Sales Return Applet';
  readonly menuItems = menuItems;
  readonly mainPath = mainPath;

  constructor(
    private router: Router,
    private tokenService: IdentityTokenService) {
  }

  async ngOnInit() {
    await this.tokenService.getRefreshToken([{
      tenantCode: sessionStorage.getItem('tenantCode'),
      appletCode: sessionStorage.getItem('appletCode')
    }], AppConfig.apiVisa).toPromise().then(resolve => {
      sessionStorage.setItem('appletToken', resolve.data[0].token);
      AppConfig.setAppletToken();
    });
    this.router.initialNavigation();
  }
}


