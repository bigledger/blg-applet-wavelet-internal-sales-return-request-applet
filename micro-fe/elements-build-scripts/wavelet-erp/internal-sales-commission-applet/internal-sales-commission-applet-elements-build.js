const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-sales-commission-applet/runtime.js',
    './dist/internal-sales-commission-applet/polyfills-es5.js',
    './dist/internal-sales-commission-applet/scripts.js',
    './dist/internal-sales-commission-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-sales-commission-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-sales-commission-applet/internal-sales-commission-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();