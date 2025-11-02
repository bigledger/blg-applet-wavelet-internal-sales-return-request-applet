const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-stock-requisition-applet/runtime.js',
    './dist/internal-stock-requisition-applet/polyfills.js',
    './dist/internal-stock-requisition-applet/scripts.js',
    './dist/internal-stock-requisition-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-stock-requisition-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-stock-requisition-applet/internal-stock-requisition-applet-elements.js');

})();
