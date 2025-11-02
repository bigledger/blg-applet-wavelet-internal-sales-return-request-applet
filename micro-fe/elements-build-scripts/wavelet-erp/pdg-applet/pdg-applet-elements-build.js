const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/pdg-applet/runtime.js',
    './dist/pdg-applet/polyfills-es5.js',
    './dist/pdg-applet/scripts.js',
    './dist/pdg-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/pdg-applet');
  await concat(files, './elements/wavelet-erp/applets/pdg-applet/pdg-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();