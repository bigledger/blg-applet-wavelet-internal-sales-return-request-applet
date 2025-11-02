const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/shipping-pricebook-applet/runtime.js',
    './dist/shipping-pricebook-applet/polyfills.js',
    './dist/shipping-pricebook-applet/scripts.js',
    './dist/shipping-pricebook-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/shipping-pricebook-applet');
  await concat(files, './elements/wavelet-erp/applets/shipping-pricebook-applet/shipping-pricebook-applet-elements.js');

})();
