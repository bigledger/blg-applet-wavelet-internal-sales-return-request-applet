const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-sales-return-applet/runtime.js',
    './dist/internal-sales-return-applet/polyfills-es5.js',
    './dist/internal-sales-return-applet/scripts.js',
    './dist/internal-sales-return-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-sales-return-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-sales-return-applet/internal-sales-return-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();