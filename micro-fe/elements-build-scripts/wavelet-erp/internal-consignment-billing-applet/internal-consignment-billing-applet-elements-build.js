const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-consignment-billing-applet/runtime.js',
    './dist/internal-consignment-billing-applet/polyfills-es5.js',
    './dist/internal-consignment-billing-applet/scripts.js',
    './dist/internal-consignment-billing-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-consignment-billing-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-consignment-billing-applet/internal-consignment-billing-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();