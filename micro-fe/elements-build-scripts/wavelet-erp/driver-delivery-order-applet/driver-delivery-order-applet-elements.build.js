const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/driver-delivery-order-applet/runtime.js',
    './dist/driver-delivery-order-applet/polyfills-es5.js',
    './dist/driver-delivery-order-applet/scripts.js',
    './dist/driver-delivery-order-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/driver-delivery-order-applet');
  await concat(files, './elements/wavelet-erp/applets/driver-delivery-order-applet/driver-delivery-order-applet-elements.js');
})();
