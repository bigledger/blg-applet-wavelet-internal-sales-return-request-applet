const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/claim-cycle-applet/runtime.js',
    './dist/claim-cycle-applet/polyfills-es5.js',
    './dist/claim-cycle-applet/scripts.js',
    './dist/claim-cycle-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/claim-cycle-applet');
  await concat(files, './elements/wavelet-erp/applets/claim-cycle-applet/claim-cycle-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();
