const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/delivery-installation-driver-applet/runtime.js',
    './dist/delivery-installation-driver-applet/polyfills-es5.js',
    './dist/delivery-installation-driver-applet/scripts.js',
    './dist/delivery-installation-driver-applet/main.js'
  ];
  await fs.ensureDir('./elements/wavelet-erp/applets/delivery-installation-driver-applet');
  await concat(files, './elements/wavelet-erp/applets/delivery-installation-driver-applet/delivery-installation-driver-applet-elements.js');
  await fs.copyFile(
    './dist/delivery-installation-driver-applet/styles.css',
    './elements/wavelet-erp/applets/delivery-installation-driver-applet/styles.css'
  )
})();