const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/month-end-processing-applet/runtime.js',
    './dist/month-end-processing-applet/polyfills.js',
    './dist/month-end-processing-applet/scripts.js',
    './dist/month-end-processing-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/month-end-processing-applet');
  await concat(files, './elements/wavelet-erp/applets/month-end-processing-applet/month-end-processing-applet-elements.js');

})();
