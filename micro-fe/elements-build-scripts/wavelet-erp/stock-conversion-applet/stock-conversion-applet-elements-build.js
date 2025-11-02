const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/stock-conversion-applet/runtime.js',
    './dist/stock-conversion-applet/polyfills.js',
    './dist/stock-conversion-applet/scripts.js',
    './dist/stock-conversion-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/stock-conversion-applet');
  await concat(files, './elements/wavelet-erp/applets/stock-conversion-applet/stock-conversion-applet-elements.js');

})();
