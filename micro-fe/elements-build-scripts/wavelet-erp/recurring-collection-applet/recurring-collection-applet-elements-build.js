const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/recurring-collection-applet/runtime.js',
    './dist/recurring-collection-applet/polyfills-es5.js',
    './dist/recurring-collection-applet/scripts.js',
    './dist/recurring-collection-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/recurring-collection-applet');
  await concat(files, './elements/wavelet-erp/applets/recurring-collection-applet/recurring-collection-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();
