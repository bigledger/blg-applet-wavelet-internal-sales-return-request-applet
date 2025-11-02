const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/samsung-bopis-gin-applet/runtime.js',
    './dist/samsung-bopis-gin-applet/polyfills-es5.js',
    './dist/samsung-bopis-gin-applet/scripts.js',
    './dist/samsung-bopis-gin-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/samsung-bopis-gin-applet');
  await concat(files, './elements/wavelet-erp/applets/samsung-bopis-gin-applet/samsung-bopis-gin-applet-elements.js');
})();
