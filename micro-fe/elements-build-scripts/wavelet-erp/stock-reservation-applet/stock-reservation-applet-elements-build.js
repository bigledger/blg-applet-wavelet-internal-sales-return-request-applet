const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/stock-reservation-applet/runtime.js',
    './dist/stock-reservation-applet/polyfills-es5.js',
    './dist/stock-reservation-applet/scripts.js',
    './dist/stock-reservation-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/stock-reservation-applet');
  await concat(files, './elements/wavelet-erp/applets/stock-reservation-applet/stock-reservation-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();