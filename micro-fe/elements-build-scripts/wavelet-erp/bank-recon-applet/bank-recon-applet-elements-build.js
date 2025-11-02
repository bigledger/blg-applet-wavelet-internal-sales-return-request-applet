const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/wavelet-erp/applets/bank-recon-applet/runtime.js',
    './dist/wavelet-erp/applets/bank-recon-applet/polyfills.js',
    './dist/wavelet-erp/applets/bank-recon-applet/scripts.js',
    './dist/wavelet-erp/applets/bank-recon-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/bank-recon-applet');
  await concat(files, './elements/wavelet-erp/applets/bank-recon-applet/bank-recon-applet-elements.js');
  await fs.copyFile(
    './dist/wavelet-erp/applets/bank-recon-applet/styles.css',
    './elements/wavelet-erp/applets/bank-recon-applet/styles.css'
  );
})();
