const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/recurring-sales-invoice-applet-v2/runtime.js',
    './dist/recurring-sales-invoice-applet-v2/polyfills.js',
    './dist/recurring-sales-invoice-applet-v2/scripts.js',
    './dist/recurring-sales-invoice-applet-v2/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/recurring-sales-invoice-applet-v2');
  await concat(files, './elements/wavelet-erp/applets/recurring-sales-invoice-applet-v2/recurring-sales-invoice-elements.js');
})();
