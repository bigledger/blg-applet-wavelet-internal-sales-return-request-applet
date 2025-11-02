const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-consignment-gin-applet/runtime.js',
    './dist/internal-consignment-gin-applet/polyfills-es5.js',
    './dist/internal-consignment-gin-applet/scripts.js',
    './dist/internal-consignment-gin-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-consignment-gin-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-consignment-gin-applet/internal-consignment-gin-applet-elements.js');
})();
