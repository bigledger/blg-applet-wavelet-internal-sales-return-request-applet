const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/stock-report-applet/runtime.js',
    './dist/stock-report-applet/polyfills.js',
    './dist/stock-report-applet/scripts.js',
    './dist/stock-report-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/stock-report-applet');
  await concat(files, './elements/wavelet-erp/applets/stock-report-applet/stock-report-applet-elements.js');
  
})();