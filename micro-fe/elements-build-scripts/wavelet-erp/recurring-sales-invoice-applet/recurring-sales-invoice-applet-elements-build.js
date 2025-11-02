const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/recurring-sales-invoice-applet/runtime.js',
    './dist/recurring-sales-invoice-applet/polyfills-es5.js',
    './dist/recurring-sales-invoice-applet/scripts.js',
    './dist/recurring-sales-invoice-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/recurring-sales-invoice-applet');
  await concat(files, './elements/wavelet-erp/applets/recurring-sales-invoice-applet/recurring-sales-invoice-elements.js');
})();
