const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/purchase-report-applet/runtime.js',
    './dist/purchase-report-applet/polyfills.js',
    './dist/purchase-report-applet/scripts.js',
    './dist/purchase-report-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/purchase-report-applet');
  await concat(files, './elements/wavelet-erp/applets/purchase-report-applet/purchase-report-applet-elements.js');
  
})();