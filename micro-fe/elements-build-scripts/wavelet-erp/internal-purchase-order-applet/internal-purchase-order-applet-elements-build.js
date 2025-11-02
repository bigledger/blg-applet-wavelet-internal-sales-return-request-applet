const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-purchase-order-applet/runtime.js',
    './dist/internal-purchase-order-applet/polyfills-es5.js',
    './dist/internal-purchase-order-applet/scripts.js',
    './dist/internal-purchase-order-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-purchase-order-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-purchase-order-applet/internal-purchase-order-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();
