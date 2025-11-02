const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/peppol-ap-admin-applet/runtime.js',
    './dist/peppol-ap-admin-applet/polyfills-es5.js',
    './dist/peppol-ap-admin-applet/scripts.js',
    './dist/peppol-ap-admin-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/peppol-ap-admin-applet');
  await concat(files, './elements/wavelet-erp/applets/peppol-ap-admin-applet/peppol-ap-admin-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();
