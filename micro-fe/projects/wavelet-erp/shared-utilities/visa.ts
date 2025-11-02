import {ApiVisa} from 'blg-akaun-ts-lib';
import { environment } from 'src/environments/environment';

export class AppConfig {
  static readonly ApiVisa: ApiVisa = {
    tenantCode: sessionStorage.getItem('tenantCode'),
    applet_code: '1234567890',
    api_domain_url: environment.api_domain,
    jwt_secret: localStorage.getItem('authToken')
  };
}
