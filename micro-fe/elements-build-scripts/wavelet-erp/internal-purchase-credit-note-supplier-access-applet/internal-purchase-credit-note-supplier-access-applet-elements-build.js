const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-purchase-credit-note-supplier-access-applet/runtime.js',
    './dist/internal-purchase-credit-note-supplier-access-applet/polyfills-es5.js',
    './dist/internal-purchase-credit-note-supplier-access-applet/scripts.js',
    './dist/internal-purchase-credit-note-supplier-access-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-purchase-credit-note-supplier-access-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-purchase-credit-note-supplier-access-applet/internal-purchase-credit-note-supplier-access-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();