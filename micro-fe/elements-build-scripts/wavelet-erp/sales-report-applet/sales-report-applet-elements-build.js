const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/sales-report-applet/runtime.js',
    './dist/sales-report-applet/polyfills.js',
    './dist/sales-report-applet/scripts.js',
    './dist/sales-report-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/sales-report-applet');
  await concat(files, './elements/wavelet-erp/applets/sales-report-applet/sales-report-applet-elements.js');
  
})();