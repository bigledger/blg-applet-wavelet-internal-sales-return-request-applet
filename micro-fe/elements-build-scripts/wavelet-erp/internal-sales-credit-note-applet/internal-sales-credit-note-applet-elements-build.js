const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-sales-credit-note-applet/runtime.js',
    './dist/internal-sales-credit-note-applet/polyfills-es5.js',
    './dist/internal-sales-credit-note-applet/scripts.js',
    './dist/internal-sales-credit-note-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-sales-credit-note-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-sales-credit-note-applet/internal-sales-credit-note-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();