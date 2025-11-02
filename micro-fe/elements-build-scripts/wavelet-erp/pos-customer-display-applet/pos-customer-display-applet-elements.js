const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/pos-customer-display-applet/runtime.js',
    './dist/pos-customer-display-applet/polyfills.js',
    './dist/pos-customer-display-applet/scripts.js',
    './dist/pos-customer-display-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/pos-customer-display-applet');
  await concat(files, './elements/wavelet-erp/applets/pos-customer-display-applet/pos-customer-display-applet-elements.js');
  await fs.copyFile(
    './dist/pos-customer-display-applet/styles.css',
    './elements/wavelet-erp/applets/pos-customer-display-applet/styles.css'
  );
})();
