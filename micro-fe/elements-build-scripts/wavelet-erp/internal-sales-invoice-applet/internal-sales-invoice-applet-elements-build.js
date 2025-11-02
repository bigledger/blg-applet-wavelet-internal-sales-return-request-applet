const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-sales-invoice-applet/runtime.js',
    './dist/internal-sales-invoice-applet/polyfills-es5.js',
    './dist/internal-sales-invoice-applet/scripts.js',
    './dist/internal-sales-invoice-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-sales-invoice-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-sales-invoice-applet/internal-sales-invoice-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();