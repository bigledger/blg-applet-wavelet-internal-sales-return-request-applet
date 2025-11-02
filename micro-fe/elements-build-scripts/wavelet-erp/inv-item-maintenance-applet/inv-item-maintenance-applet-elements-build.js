const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/inv-item-maintenance-applet/runtime.js',
    './dist/inv-item-maintenance-applet/polyfills-es5.js',
    './dist/inv-item-maintenance-applet/scripts.js',
    './dist/inv-item-maintenance-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/inv-item-maintenance-applet');
  await concat(files, './elements/wavelet-erp/applets/inv-item-maintenance-applet/inv-item-maintenance-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();