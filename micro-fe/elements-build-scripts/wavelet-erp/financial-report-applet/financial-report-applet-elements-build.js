const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/financial-report-applet/runtime.js',
    './dist/financial-report-applet/polyfills.js',
    './dist/financial-report-applet/scripts.js',
    './dist/financial-report-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/financial-report-applet');
  await concat(files, './elements/wavelet-erp/applets/financial-report-applet/financial-report-applet-elements.js');

})();
