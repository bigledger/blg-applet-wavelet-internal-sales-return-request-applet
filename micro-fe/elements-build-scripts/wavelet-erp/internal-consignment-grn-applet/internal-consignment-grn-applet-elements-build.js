const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-consignment-grn-applet/runtime.js',
    './dist/internal-consignment-grn-applet/polyfills-es5.js',
    './dist/internal-consignment-grn-applet/scripts.js',
    './dist/internal-consignment-grn-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-consignment-grn-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-consignment-grn-applet/internal-consignment-grn-applet-elements.js');
})();
