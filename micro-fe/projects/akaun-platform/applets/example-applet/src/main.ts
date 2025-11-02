import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import {LicenseManager} from 'ag-grid-enterprise';
import { environment } from 'src/environments/environment';

LicenseManager.setLicenseKey
("CompanyName=Wavelet Solutions Sdn Bhd,LicensedApplication=akaun.com,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-014474,ExpiryDate=23_April_2022_[v2]_MTY1MDY2ODQwMDAwMA==f198d99dd369ea9140e03c13379ef7b8")

if (environment.production) {
  enableProdMode();
} else {
  sessionStorage.setItem('appletGuid', 'd9fd529d-3194-41ce-9bd1-c6cc07640340')
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
