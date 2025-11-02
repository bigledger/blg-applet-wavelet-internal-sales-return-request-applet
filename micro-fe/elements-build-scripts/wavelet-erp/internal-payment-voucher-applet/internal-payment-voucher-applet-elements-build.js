const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-payment-voucher-applet/runtime.js',
    './dist/internal-payment-voucher-applet/polyfills-es5.js',
    './dist/internal-payment-voucher-applet/scripts.js',
    './dist/internal-payment-voucher-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-payment-voucher-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-payment-voucher-applet/internal-payment-voucher-applet-elements.js');
})();
