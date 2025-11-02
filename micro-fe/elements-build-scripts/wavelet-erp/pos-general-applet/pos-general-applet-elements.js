const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/pos-general-applet/runtime.js',
    './dist/pos-general-applet/polyfills.js',
    './dist/pos-general-applet/scripts.js',
    './dist/pos-general-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/pos-general-applet');
  await concat(files, './elements/wavelet-erp/applets/pos-general-applet/pos-general-applet-elements.js');
  await fs.copyFile(
    './dist/pos-general-applet/styles.css',
    './elements/wavelet-erp/applets/pos-general-applet/styles.css'
  );
})();
