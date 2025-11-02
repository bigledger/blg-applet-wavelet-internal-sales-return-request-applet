const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-purchase-invoice-applet/runtime.js',
    './dist/internal-purchase-invoice-applet/polyfills-es5.js',
    './dist/internal-purchase-invoice-applet/scripts.js',
    './dist/internal-purchase-invoice-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-purchase-invoice-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-purchase-invoice-applet/internal-purchase-invoice-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();