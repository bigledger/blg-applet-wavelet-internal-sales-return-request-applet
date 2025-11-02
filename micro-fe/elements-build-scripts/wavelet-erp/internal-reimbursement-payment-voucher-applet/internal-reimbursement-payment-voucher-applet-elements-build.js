const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-reimbursement-payment-voucher-applet/runtime.js',
    './dist/internal-reimbursement-payment-voucher-applet/polyfills-es5.js',
    './dist/internal-reimbursement-payment-voucher-applet/scripts.js',
    './dist/internal-reimbursement-payment-voucher-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-reimbursement-payment-voucher-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-reimbursement-payment-voucher-applet/internal-reimbursement-payment-voucher-applet-elements.js');
})();
