const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/my-peppol-admin-applet/runtime.js',
    './dist/my-peppol-admin-applet/polyfills-es5.js',
    './dist/my-peppol-admin-applet/scripts.js',
    './dist/my-peppol-admin-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/my-peppol-admin-applet');
  await concat(files, './elements/wavelet-erp/applets/my-peppol-admin-applet/my-peppol-admin-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();
