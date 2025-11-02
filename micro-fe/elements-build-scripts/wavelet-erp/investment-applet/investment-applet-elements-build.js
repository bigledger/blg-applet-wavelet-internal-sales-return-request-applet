const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/investment-applet/runtime.js',
    './dist/investment-applet/polyfills-es5.js',
    './dist/investment-applet/scripts.js',
    './dist/investment-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/investment-applet');
  await concat(files, './elements/wavelet-erp/applets/investment-applet/investment-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();