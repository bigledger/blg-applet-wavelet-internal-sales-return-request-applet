const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/myBilling-applet/runtime.js',
    './dist/myBilling-applet/polyfills-es5.js',
    './dist/myBilling-applet/scripts.js',
    './dist/myBilling-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/myBilling-applet');
  await concat(files, './elements/wavelet-erp/applets/myBilling-applet/myBilling-applet-elements.js');
  await fs.copyFile(
    './dist/myBilling-applet/styles.css',
    './elements/wavelet-erp/applets/myBilling-applet/styles.css'
  )
})();
