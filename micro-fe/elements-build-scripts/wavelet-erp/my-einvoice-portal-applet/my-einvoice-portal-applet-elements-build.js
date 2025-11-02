const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/my-einvoice-portal-applet/runtime.js',
    './dist/my-einvoice-portal-applet/polyfills-es5.js',
    './dist/my-einvoice-portal-applet/scripts.js',
    './dist/my-einvoice-portal-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/my-einvoice-portal-applet');
  await concat(files, './elements/wavelet-erp/applets/my-einvoice-portal-applet/my-einvoice-portal-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();
