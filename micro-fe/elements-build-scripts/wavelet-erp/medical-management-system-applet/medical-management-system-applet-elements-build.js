const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/medical-management-system-applet/runtime.js',
    './dist/medical-management-system-applet/polyfills-es5.js',
    './dist/medical-management-system-applet/scripts.js',
    './dist/medical-management-system-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/medical-management-system-applet');
  await concat(files, './elements/wavelet-erp/applets/medical-management-system-applet/medical-management-system-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();
