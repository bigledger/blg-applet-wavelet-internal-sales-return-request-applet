const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/claim-applet/runtime.js',
    './dist/claim-applet/polyfills-es5.js',
    './dist/claim-applet/scripts.js',
    './dist/claim-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/claim-applet');
  await concat(files, './elements/wavelet-erp/applets/claim-applet/claim-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();
