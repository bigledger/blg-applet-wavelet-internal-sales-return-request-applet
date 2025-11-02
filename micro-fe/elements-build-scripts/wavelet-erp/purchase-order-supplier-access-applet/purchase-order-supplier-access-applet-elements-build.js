const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/purchase-order-supplier-access-applet/runtime.js',
    './dist/purchase-order-supplier-access-applet/polyfills-es5.js',
    './dist/purchase-order-supplier-access-applet/scripts.js',
    './dist/purchase-order-supplier-access-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/purchase-order-supplier-access-applet');
  await concat(files, './elements/wavelet-erp/applets/purchase-order-supplier-access-applet/purchase-order-supplier-access-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();
