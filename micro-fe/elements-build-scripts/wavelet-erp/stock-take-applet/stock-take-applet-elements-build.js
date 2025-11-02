const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    'dist/stock-take-applet/runtime.js',
    'dist/stock-take-applet/polyfills.js',
    'dist/stock-take-applet/scripts.js',
    'dist/stock-take-applet/main.js'
  ];

  await fs.ensureDir('elements/wavelet-erp/applets/stock-take-applet');
  await concat(files, 'elements/wavelet-erp/applets/stock-take-applet/stock-take-applet-elements.js');
  // await fs.copyFile(
  //   './dist/stock-take-applet/styles.css',
  //   './elements/wavelet-erp/applets/stock-take-applet/styles.css'
  // );
})();
