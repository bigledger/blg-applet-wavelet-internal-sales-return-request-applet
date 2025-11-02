const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-purchase-refund-note-applet/runtime.js',
    './dist/internal-purchase-refund-note-applet/polyfills-es5.js',
    './dist/internal-purchase-refund-note-applet/scripts.js',
    './dist/internal-purchase-refund-note-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-purchase-refund-note-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-purchase-refund-note-applet/internal-purchase-refund-note-applet-elements.js');
})();
