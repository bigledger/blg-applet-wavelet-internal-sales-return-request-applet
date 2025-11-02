const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/sales-report-supplier-access-applet/runtime.js',
    './dist/sales-report-supplier-access-applet/polyfills.js',
    './dist/sales-report-supplier-access-applet/scripts.js',
    './dist/sales-report-supplier-access-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/sales-report-supplier-access-applet');
  await concat(files, './elements/wavelet-erp/applets/sales-report-supplier-access-applet/sales-report-supplier-access-applet-elements.js');
  
})();