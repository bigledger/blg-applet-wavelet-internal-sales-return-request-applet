const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/mlm-admin-applet/runtime.js',
    './dist/mlm-admin-applet/polyfills-es5.js',
    './dist/mlm-admin-applet/scripts.js',
    './dist/mlm-admin-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/mlm-admin-applet');
  await concat(files, './elements/wavelet-erp/applets/mlm-admin-applet/mlm-admin-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();
