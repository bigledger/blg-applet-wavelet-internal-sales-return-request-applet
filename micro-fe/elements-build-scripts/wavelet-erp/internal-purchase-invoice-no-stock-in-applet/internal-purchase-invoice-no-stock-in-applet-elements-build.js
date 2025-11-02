const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-purchase-invoice-no-stock-in-applet/runtime.js',
    './dist/internal-purchase-invoice-no-stock-in-applet/polyfills-es5.js',
    './dist/internal-purchase-invoice-no-stock-in-applet/scripts.js',
    './dist/internal-purchase-invoice-no-stock-in-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-purchase-invoice-no-stock-in-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-purchase-invoice-no-stock-in-applet/internal-purchase-invoice-no-stock-in-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();