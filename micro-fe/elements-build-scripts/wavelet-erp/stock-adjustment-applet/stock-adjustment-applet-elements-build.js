const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/stock-adjustment-applet/runtime.js',
    './dist/stock-adjustment-applet/polyfills-es5.js',
    './dist/stock-adjustment-applet/scripts.js',
    './dist/stock-adjustment-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/stock-adjustment-applet');
  await concat(files, './elements/wavelet-erp/applets/stock-adjustment-applet/stock-adjustment-applet-elements.js');
  // await fs.copyFile(
  //   './dist/akaun-platform/applets/developer-maintenance-applet/styles.css',
  //   './elements/akaun-platform/applets/developer-maintenance-applet/styles.css'
  // );
})();
