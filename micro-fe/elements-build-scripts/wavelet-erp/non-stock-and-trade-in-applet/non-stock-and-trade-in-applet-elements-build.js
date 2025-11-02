const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/non-stock-and-trade-in-applet/runtime.js',
    './dist/non-stock-and-trade-in-applet/polyfills-es5.js',
    './dist/non-stock-and-trade-in-applet/scripts.js',
    './dist/non-stock-and-trade-in-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/non-stock-and-trade-in-applet');
  await concat(files, './elements/wavelet-erp/applets/non-stock-and-trade-in-applet/non-stock-and-trade-in-applet-elements.js');
})();
