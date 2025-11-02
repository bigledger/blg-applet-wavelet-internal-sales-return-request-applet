const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/samsung-bopis-grn-applet/runtime.js',
    './dist/samsung-bopis-grn-applet/polyfills-es5.js',
    './dist/samsung-bopis-grn-applet/scripts.js',
    './dist/samsung-bopis-grn-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/samsung-bopis-grn-applet');
  await concat(files, './elements/wavelet-erp/applets/samsung-bopis-grn-applet/samsung-bopis-grn-applet-elements.js');
})();
