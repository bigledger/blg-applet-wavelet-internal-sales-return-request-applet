const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-outbound-delivery-order-applet/runtime.js',
    './dist/internal-outbound-delivery-order-applet/polyfills-es5.js',
    './dist/internal-outbound-delivery-order-applet/scripts.js',
    './dist/internal-outbound-delivery-order-applet/main.js'
  ];

  await fs.ensureDir('./elements/akaun-platform/applets/internal-delivery-order-applet');
  await concat(files, './elements/akaun-platform/applets/internal-delivery-order-applet/internal-delivery-order-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();