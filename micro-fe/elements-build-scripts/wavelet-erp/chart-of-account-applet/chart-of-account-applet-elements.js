const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/wavelet-erp/applets/chart-of-account-applet/runtime.js',
    './dist/wavelet-erp/applets/chart-of-account-applet/polyfills.js',
    './dist/wavelet-erp/applets/chart-of-account-applet/scripts.js',
    './dist/wavelet-erp/applets/chart-of-account-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/chart-of-account-applet');
  await concat(files, './elements/wavelet-erp/applets/chart-of-account-applet/chart-of-account-applet-elements.js');
  await fs.copyFile(
    './dist/wavelet-erp/applets/chart-of-account-applet/styles.css',
    './elements/wavelet-erp/applets/chart-of-account-applet/styles.css'
  );
})();