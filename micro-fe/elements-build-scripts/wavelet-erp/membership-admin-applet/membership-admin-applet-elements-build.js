const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/wavelet-erp/applets/membership-admin-applet/runtime.js',
    './dist/wavelet-erp/applets/membership-admin-applet/polyfills.js',
    './dist/wavelet-erp/applets/membership-admin-applet/scripts.js',
    './dist/wavelet-erp/applets/membership-admin-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/membership-admin-applet');
  await concat(files, './elements/wavelet-erp/applets/membership-admin-applet/membership-admin-applet-elements.js');
  await fs.copyFile(
    './dist/wavelet-erp/applets/membership-admin-applet/styles.css',
    './elements/wavelet-erp/applets/membership-admin-applet/styles.css'
  )
})();
