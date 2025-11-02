const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-purchase-return-applet/runtime.js',
    './dist/internal-purchase-return-applet/polyfills-es5.js',
    './dist/internal-purchase-return-applet/scripts.js',
    './dist/internal-purchase-return-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-purchase-return-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-purchase-return-applet/internal-purchase-return-applet-elements.js');
})();