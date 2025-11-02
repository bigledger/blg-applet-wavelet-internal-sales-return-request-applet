const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-rma-applet/runtime.js',
    './dist/internal-rma-applet/polyfills-es5.js',
    './dist/internal-rma-applet/scripts.js',
    './dist/internal-rma-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-rma-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-rma-applet/internal-rma-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();