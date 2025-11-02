const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/seller-admin-applet/runtime.js',
    './dist/seller-admin-applet/polyfills-es5.js',
    './dist/seller-admin-applet/scripts.js',
    './dist/seller-admin-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/seller-admin-applet');
  await concat(files, './elements/wavelet-erp/applets/seller-admin-applet/seller-admin-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();
