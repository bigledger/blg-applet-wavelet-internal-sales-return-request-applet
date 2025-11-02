const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-purchase-gin-applet/runtime.js',
    './dist/internal-purchase-gin-applet/polyfills-es5.js',
    './dist/internal-purchase-gin-applet/scripts.js',
    './dist/internal-purchase-gin-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-purchase-gin-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-purchase-gin-applet/internal-purchase-gin-applet-elements.js');
})();
