const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-sales-grn-applet/runtime.js',
    './dist/internal-sales-grn-applet/polyfills-es5.js',
    './dist/internal-sales-grn-applet/scripts.js',
    './dist/internal-sales-grn-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-sales-grn-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-sales-grn-applet/internal-sales-grn-applet-elements.js');
})();
