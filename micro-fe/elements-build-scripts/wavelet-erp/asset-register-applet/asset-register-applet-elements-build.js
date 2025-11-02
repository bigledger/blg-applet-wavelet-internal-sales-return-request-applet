const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/asset-register-applet/runtime.js',
    './dist/asset-register-applet/polyfills-es5.js',
    './dist/asset-register-applet/scripts.js',
    './dist/asset-register-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/asset-register-applet');
  await concat(files, './elements/wavelet-erp/applets/asset-register-applet/asset-register-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();