const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/stock-transfer-applet/runtime.js',
    './dist/stock-transfer-applet/polyfills.js',
    './dist/stock-transfer-applet/scripts.js',
    './dist/stock-transfer-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/stock-transfer-applet');
  await concat(files, './elements/wavelet-erp/applets/stock-transfer-applet/stock-transfer-applet-elements.js');

})();
