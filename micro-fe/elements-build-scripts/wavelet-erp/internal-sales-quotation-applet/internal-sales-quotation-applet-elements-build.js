const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-sales-quotation-applet/runtime.js',
    './dist/internal-sales-quotation-applet/polyfills-es5.js',
    './dist/internal-sales-quotation-applet/scripts.js',
    './dist/internal-sales-quotation-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-sales-quotation-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-sales-quotation-applet/internal-sales-quotation-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();