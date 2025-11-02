const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-receipt-voucher-applet/runtime.js',
    './dist/internal-receipt-voucher-applet/polyfills-es5.js',
    './dist/internal-receipt-voucher-applet/scripts.js',
    './dist/internal-receipt-voucher-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-receipt-voucher-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-receipt-voucher-applet/internal-receipt-voucher-applet-elements.js');
})();
