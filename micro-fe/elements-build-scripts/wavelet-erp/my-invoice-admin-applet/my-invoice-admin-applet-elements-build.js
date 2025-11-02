const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/my-invoice-admin-applet/runtime.js',
    './dist/my-invoice-admin-applet/polyfills-es5.js',
    './dist/my-invoice-admin-applet/scripts.js',
    './dist/my-invoice-admin-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/my-invoice-admin-applet');
  await concat(files, './elements/wavelet-erp/applets/my-invoice-admin-applet/my-invoice-admin-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();
