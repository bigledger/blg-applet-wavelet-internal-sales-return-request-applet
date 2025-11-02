const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-purchase-requisition-applet/runtime.js',
    './dist/internal-purchase-requisition-applet/polyfills-es5.js',
    './dist/internal-purchase-requisition-applet/scripts.js',
    './dist/internal-purchase-requisition-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-purchase-requisition-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-purchase-requisition-applet/internal-purchase-requisition-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();