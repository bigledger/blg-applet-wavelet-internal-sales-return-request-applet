const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-purchase-debit-note-applet/runtime.js',
    './dist/internal-purchase-debit-note-applet/polyfills-es5.js',
    './dist/internal-purchase-debit-note-applet/scripts.js',
    './dist/internal-purchase-debit-note-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-purchase-debit-note-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-purchase-debit-note-applet/internal-purchase-debit-note-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();