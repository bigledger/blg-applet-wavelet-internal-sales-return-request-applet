const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-consignment-return-applet/runtime.js',
    './dist/internal-consignment-return-applet/polyfills-es5.js',
    './dist/internal-consignment-return-applet/scripts.js',
    './dist/internal-consignment-return-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-consignment-return-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-consignment-return-applet/internal-consignment-return-applet-elements.js');
})();