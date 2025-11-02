const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-packing-order-applet/runtime.js',
    './dist/internal-packing-order-applet/polyfills-es5.js',
    './dist/internal-packing-order-applet/scripts.js',
    './dist/internal-packing-order-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-packing-order-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-packing-order-applet/internal-packing-order-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();