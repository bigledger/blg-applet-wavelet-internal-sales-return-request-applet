const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/stock-availability-applet/runtime.js',
    './dist/stock-availability-applet/polyfills.js',
    './dist/stock-availability-applet/scripts.js',
    './dist/stock-availability-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/stock-availability-applet');
  await concat(files, './elements/wavelet-erp/applets/stock-availability-applet/stock-availability-applet-elements.js');

})();
