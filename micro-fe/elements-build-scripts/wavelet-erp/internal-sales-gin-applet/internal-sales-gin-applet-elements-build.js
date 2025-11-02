const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-sales-gin-applet/runtime.js',
    './dist/internal-sales-gin-applet/polyfills-es5.js',
    './dist/internal-sales-gin-applet/scripts.js',
    './dist/internal-sales-gin-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-sales-gin-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-sales-gin-applet/internal-sales-gin-applet-elements.js');
})();
