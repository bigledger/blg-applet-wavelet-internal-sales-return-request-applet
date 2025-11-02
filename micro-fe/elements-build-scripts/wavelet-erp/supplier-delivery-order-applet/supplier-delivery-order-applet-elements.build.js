const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/supplier-delivery-order-applet/runtime.js',
    './dist/supplier-delivery-order-applet/polyfills-es5.js',
    './dist/supplier-delivery-order-applet/scripts.js',
    './dist/supplier-delivery-order-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/supplier-delivery-order-applet');
  await concat(files, './elements/wavelet-erp/applets/supplier-delivery-order-applet/supplier-delivery-order-applet-elements.js');
})();
