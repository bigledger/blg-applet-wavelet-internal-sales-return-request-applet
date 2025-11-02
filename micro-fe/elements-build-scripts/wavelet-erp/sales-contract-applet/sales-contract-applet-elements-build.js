const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/sales-contract-applet/runtime.js',
    './dist/sales-contract-applet/polyfills-es5.js',
    './dist/sales-contract-applet/scripts.js',
    './dist/sales-contract-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/sales-contract-applet');
  await concat(files, './elements/wavelet-erp/applets/sales-contract-applet/sales-contract-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();