const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-purchase-order-supplier-access-applet/runtime.js',
    './dist/internal-purchase-order-supplier-access-applet/polyfills-es5.js',
    './dist/internal-purchase-order-supplier-access-applet/scripts.js',
    './dist/internal-purchase-order-supplier-access-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-purchase-order-supplier-access-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-purchase-order-supplier-access-applet/internal-purchase-order-supplier-access-applet-elements.js');
})();
