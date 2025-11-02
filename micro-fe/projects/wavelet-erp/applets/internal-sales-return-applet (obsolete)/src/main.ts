import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import {LicenseManager} from 'ag-grid-enterprise';
import { environment } from 'src/environments/environment';

LicenseManager.setLicenseKey
("CompanyName=Wavelet Solutions Sdn Bhd,LicensedApplication=akaun.com,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-014474,ExpiryDate=23_April_2022_[v2]_MTY1MDY2ODQwMDAwMA==f198d99dd369ea9140e03c13379ef7b8")

if (environment.production) {
  enableProdMode();
}
else {
  // sessionStorage.setItem('appletCode', 'salesReturnApplet');
  // sessionStorage.setItem('appletName', 'Internal Sales Return Applet');
  // sessionStorage.setItem('appletGuid', 'b52903e0-fb71-4095-99b4-dda97eda60ec');

  sessionStorage.setItem('appletCode', 'InternalSalesReturnApplet');
  sessionStorage.setItem('appletName', 'Internal Sales Return');
  sessionStorage.setItem('appletGuid', 'c8312bf9-7e36-4b7f-a778-5937f10b189c');
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
