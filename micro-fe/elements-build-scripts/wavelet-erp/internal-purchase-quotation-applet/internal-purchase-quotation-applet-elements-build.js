const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-purchase-quotation-applet/runtime.js',
    './dist/internal-purchase-quotation-applet/polyfills-es5.js',
    './dist/internal-purchase-quotation-applet/scripts.js',
    './dist/internal-purchase-quotation-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-purchase-quotation-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-purchase-quotation-applet/internal-purchase-quotation-applet-elements.js');
})();
