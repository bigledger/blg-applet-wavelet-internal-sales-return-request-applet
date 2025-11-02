const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    'dist/blanket-purchase-order-applet-supplier-access/runtime.js',
    'dist/blanket-purchase-order-applet-supplier-access/polyfills.js',
    'dist/blanket-purchase-order-applet-supplier-access/scripts.js',
    'dist/blanket-purchase-order-applet-supplier-access/main.js'
  ];

  await fs.ensureDir('elements/wavelet-erp/applets/blanket-purchase-order-applet-supplier-access');
  await concat(files, 'elements/wavelet-erp/applets/blanket-purchase-order-applet-supplier-access/blanket-purchase-order-applet-supplier-access-elements.js');

})();
