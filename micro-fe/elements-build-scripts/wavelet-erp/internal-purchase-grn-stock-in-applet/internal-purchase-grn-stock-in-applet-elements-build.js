const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-purchase-grn-stock-in-applet/runtime.js',
    './dist/internal-purchase-grn-stock-in-applet/polyfills-es5.js',
    './dist/internal-purchase-grn-stock-in-applet/scripts.js',
    './dist/internal-purchase-grn-stock-in-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-purchase-grn-stock-in-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-purchase-grn-stock-in-applet/internal-purchase-grn-stock-in-applet-elements.js');
})();
