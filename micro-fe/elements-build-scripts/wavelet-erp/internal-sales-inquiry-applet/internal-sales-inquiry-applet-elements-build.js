const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/wavelet-erp/applets/internal-sales-inquiry-applet/runtime.js',
    './dist/wavelet-erp/applets/internal-sales-inquiry-applet/polyfills.js',
    './dist/wavelet-erp/applets/internal-sales-inquiry-applet/scripts.js',
    './dist/wavelet-erp/applets/internal-sales-inquiry-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-sales-inquiry-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-sales-inquiry-applet/internal-sales-inquiry-applet-elements.js');
  await fs.copyFile(
    './dist/wavelet-erp/applets/internal-sales-inquiry-applet/styles.css',
    './elements/wavelet-erp/applets/internal-sales-inquiry-applet/styles.css'
  );
})();
