const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/wavelet-erp/applets/tax-config-applet/runtime.js',
    './dist/wavelet-erp/applets/tax-config-applet/polyfills.js',
    './dist/wavelet-erp/applets/tax-config-applet/scripts.js',
    './dist/wavelet-erp/applets/tax-config-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/tax-config-applet');
  await concat(files, './elements/wavelet-erp/applets/tax-config-applet/tax-config-applet-elements.js');
  await fs.copyFile(
    './dist/wavelet-erp/applets/tax-config-applet/styles.css',
    './elements/wavelet-erp/applets/tax-config-applet/styles.css'
  );
})();
