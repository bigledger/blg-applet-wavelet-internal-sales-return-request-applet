const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-sales-refund-note-applet-v3/runtime.js',
    './dist/internal-sales-refund-note-applet-v3/polyfills-es5.js',
    './dist/internal-sales-refund-note-applet-v3/scripts.js',
    './dist/internal-sales-refund-note-applet-v3/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-sales-refund-note-applet-v3');
  await concat(files, './elements/wavelet-erp/applets/internal-sales-refund-note-applet-v3/internal-sales-refund-note-applet-v3-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();