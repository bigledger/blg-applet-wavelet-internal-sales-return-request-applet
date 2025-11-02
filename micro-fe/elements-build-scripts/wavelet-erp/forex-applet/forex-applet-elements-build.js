const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/forex-applet/runtime.js',
    './dist/forex-applet/polyfills.js',
    './dist/forex-applet/scripts.js',
    './dist/forex-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/forex-applet');
  await concat(files, './elements/wavelet-erp/applets/forex-applet/forex-applet-elements.js');
  
})();