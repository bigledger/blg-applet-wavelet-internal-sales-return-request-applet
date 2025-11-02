const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/commission-scheme-applet/runtime.js',
    './dist/commission-scheme-applet/polyfills.js',
    './dist/commission-scheme-applet/scripts.js',
    './dist/commission-scheme-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/commission-scheme-applet');
  await concat(files, './elements/wavelet-erp/applets/commission-scheme-applet/commission-scheme-applet-elements.js');

})();