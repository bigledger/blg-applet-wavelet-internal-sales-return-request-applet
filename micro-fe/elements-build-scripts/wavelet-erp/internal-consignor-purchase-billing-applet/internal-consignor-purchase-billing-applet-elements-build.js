const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-consignor-purchase-billing-applet/runtime.js',
    './dist/internal-consignor-purchase-billing-applet/polyfills-es5.js',
    './dist/internal-consignor-purchase-billing-applet/scripts.js',
    './dist/internal-consignor-purchase-billing-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-consignor-purchase-billing-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-consignor-purchase-billing-applet/internal-consignor-purchase-billing-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();
