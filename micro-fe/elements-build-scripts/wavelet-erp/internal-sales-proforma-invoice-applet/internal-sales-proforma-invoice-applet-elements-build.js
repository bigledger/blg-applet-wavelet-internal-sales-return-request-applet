const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-sales-proforma-invoice-applet/runtime.js',
    './dist/internal-sales-proforma-invoice-applet/polyfills-es5.js',
    './dist/internal-sales-proforma-invoice-applet/scripts.js',
    './dist/internal-sales-proforma-invoice-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-sales-proforma-invoice-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-sales-proforma-invoice-applet/internal-sales-proforma-invoice-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();
