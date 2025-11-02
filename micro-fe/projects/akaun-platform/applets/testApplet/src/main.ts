import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import {LicenseManager} from 'ag-grid-enterprise';
import { environment } from 'src/environments/environment';

LicenseManager.setLicenseKey
("CompanyName=Wavelet Solutions Sdn Bhd,LicensedApplication=akaun.com,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-014474,ExpiryDate=23_April_2022_[v2]_MTY1MDY2ODQwMDAwMA==f198d99dd369ea9140e03c13379ef7b8")
sessionStorage.setItem('appletGuid', 'b4157fd4-bb45-4261-989c-87b8c203a5e4');
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
