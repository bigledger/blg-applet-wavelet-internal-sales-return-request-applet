const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-sales-delivery-order-stock-out-applet/runtime.js',
    './dist/internal-sales-delivery-order-stock-out-applet/polyfills-es5.js',
    './dist/internal-sales-delivery-order-stock-out-applet/scripts.js',
    './dist/internal-sales-delivery-order-stock-out-applet/main.js'
  ];

  await fs.ensureDir('./elements/akaun-platform/applets/internal-sales-delivery-order-stock-out-applet');
  await concat(files, './elements/akaun-platform/applets/internal-sales-delivery-order-stock-out-applet/internal-sales-delivery-order-stock-out-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();