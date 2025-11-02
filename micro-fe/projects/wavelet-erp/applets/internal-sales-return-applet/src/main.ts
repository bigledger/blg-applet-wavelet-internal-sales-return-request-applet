import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { LicenseManager } from 'ag-grid-enterprise';
import { environment } from 'src/environments/environment';
import { AppModule } from './app/app.module';

LicenseManager.setLicenseKey
  ("Using_this_{AG_Grid}_Enterprise_key_{AG-077658}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{WAVELET_SOLUTIONS_SDN._BHD.}_is_granted_a_{Single_Application}_Developer_License_for_the_application_{akaun.com}_only_for_{1}_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_working_on_{akaun.com}_need_to_be_licensed___{akaun.com}_has_not_been_granted_a_Deployment_License_Add-on___This_key_works_with_{AG_Grid}_Enterprise_versions_released_before_{22_April_2026}____[v3]_[01]_MTc3NjgxMjQwMDAwMA==9d96cc35fd4ac54815eb67e4d123eaa7")
if (environment.production) {
  enableProdMode();
  console.log = function () {};
} else {
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
