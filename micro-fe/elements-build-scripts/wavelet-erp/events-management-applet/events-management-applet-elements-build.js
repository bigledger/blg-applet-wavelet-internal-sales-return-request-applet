const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/events-management-applet/runtime.js',
    './dist/events-management-applet/polyfills-es5.js',
    './dist/events-management-applet/scripts.js',
    './dist/events-management-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/events-management-applet');
  await concat(files, './elements/wavelet-erp/applets/events-management-applet/events-management-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();