const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/pricebook-applet/runtime.js',
    './dist/pricebook-applet/polyfills.js',
    './dist/pricebook-applet/scripts.js',
    './dist/pricebook-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/pricebook-applet');
  await concat(files, './elements/wavelet-erp/applets/pricebook-applet/pricebook-applet-elements.js');

})();
