const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/multi-po-applet/runtime.js',
    './dist/multi-po-applet/polyfills-es5.js',
    './dist/multi-po-applet/scripts.js',
    './dist/multi-po-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/multi-po-applet');
  await concat(files, './elements/wavelet-erp/applets/multi-po-applet/multi-po-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();