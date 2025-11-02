const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/stock-replenishment-applet/runtime.js',
    './dist/stock-replenishment-applet/polyfills-es5.js',
    './dist/stock-replenishment-applet/scripts.js',
    './dist/stock-replenishment-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/stock-replenishment-applet');
  await concat(files, './elements/wavelet-erp/applets/stock-replenishment-applet/stock-replenishment-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();