const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/seller-applet/runtime.js',
    './dist/seller-applet/polyfills-es5.js',
    './dist/seller-applet/scripts.js',
    './dist/seller-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/seller-applet');
  await concat(files, './elements/wavelet-erp/applets/seller-applet/seller-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();