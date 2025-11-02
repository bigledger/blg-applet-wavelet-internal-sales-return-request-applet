const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/consignee-stock-transfer-applet/runtime.js',
    './dist/consignee-stock-transfer-applet/polyfills.js',
    './dist/consignee-stock-transfer-applet/scripts.js',
    './dist/consignee-stock-transfer-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/consignee-stock-transfer-applet');
  await concat(files, './elements/wavelet-erp/applets/consignee-stock-transfer-applet/consignee-stock-transfer-applet-elements.js');

})();
