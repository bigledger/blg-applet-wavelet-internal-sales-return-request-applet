const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-inbound-delivery-order-applet/runtime.js',
    './dist/internal-inbound-delivery-order-applet/polyfills-es5.js',
    './dist/internal-inbound-delivery-order-applet/scripts.js',
    './dist/internal-inbound-delivery-order-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-inbound-delivery-order-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-inbound-delivery-order-applet/internal-inbound-delivery-order-applet-elements.js');
})();
