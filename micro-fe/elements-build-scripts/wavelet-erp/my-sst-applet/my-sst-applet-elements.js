const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/my-sst-applet/runtime.js',
    './dist/my-sst-applet/polyfills.js',
    './dist/my-sst-applet/scripts.js',
    './dist/my-sst-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/my-sst-applet');
  await concat(files, './elements/wavelet-erp/applets/my-sst-applet/my-sst-applet-elements.js');
  await fs.copyFile(
    './dist/my-sst-applet/styles.css',
    './elements/wavelet-erp/applets/my-sst-applet/styles.css'
  );
})();
