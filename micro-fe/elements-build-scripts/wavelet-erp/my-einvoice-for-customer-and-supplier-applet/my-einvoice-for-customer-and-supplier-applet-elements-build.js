const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/my-einvoice-for-customer-and-supplier-applet/runtime.js',
    './dist/my-einvoice-for-customer-and-supplier-applet/polyfills-es5.js',
    './dist/my-einvoice-for-customer-and-supplier-applet/scripts.js',
    './dist/my-einvoice-for-customer-and-supplier-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/my-einvoice-for-customer-and-supplier-applet');
  await concat(files, './elements/wavelet-erp/applets/my-einvoice-for-customer-and-supplier-applet/my-einvoice-for-customer-and-supplier-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();
