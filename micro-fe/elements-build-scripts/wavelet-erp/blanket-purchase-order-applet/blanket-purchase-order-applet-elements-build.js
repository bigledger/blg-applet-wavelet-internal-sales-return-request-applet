const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    'dist/blanket-purchase-order-applet/runtime.js',
    'dist/blanket-purchase-order-applet/polyfills.js',
    'dist/blanket-purchase-order-applet/scripts.js',
    'dist/blanket-purchase-order-applet/main.js'
  ];

  await fs.ensureDir('elements/wavelet-erp/applets/blanket-purchase-order-applet');
  await concat(files, 'elements/wavelet-erp/applets/blanket-purchase-order-applet/blanket-purchase-order-applet-elements.js');

})();
