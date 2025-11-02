const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/deposit-applet/runtime.js',
    './dist/deposit-applet/polyfills-es5.js',
    './dist/deposit-applet/scripts.js',
    './dist/deposit-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/deposit-applet');
  await concat(files, './elements/wavelet-erp/applets/deposit-applet/deposit-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();