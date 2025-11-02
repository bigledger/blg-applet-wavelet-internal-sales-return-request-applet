const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-sales-invoice-no-stock-out-applet/runtime.js',
    './dist/internal-sales-invoice-no-stock-out-applet/polyfills-es5.js',
    './dist/internal-sales-invoice-no-stock-out-applet/scripts.js',
    './dist/internal-sales-invoice-no-stock-out-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-sales-invoice-no-stock-out-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-sales-invoice-no-stock-out-applet/internal-sales-invoice-no-stock-out-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();