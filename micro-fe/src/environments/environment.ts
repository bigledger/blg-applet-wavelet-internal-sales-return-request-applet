// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api_domain: 'https://api.senwave.cloud/',
  //api_domain: 'https://api.akaun.com/',
  // api_domain: 'http://localhost:5000/',
  // api_domain: 'https://api.senheng.my/',
  tenantCode: sessionStorage.setItem('tenantCode', 'senhenghq'),
  // appletCode: sessionStorage.setItem('appletCode', 'internalPackingOrderApplet'),
  // appletGuid: sessionStorage.setItem('appletGuid', 'e6d2e289-a3c4-43dc-9643-83182f48d57c'),
  // appletLoginSubjectLinkGuid: sessionStorage.setItem('appletLoginSubjectLinkGuid', 'b208e895-03c9-482c-bf88-28227f15e392'),
};
