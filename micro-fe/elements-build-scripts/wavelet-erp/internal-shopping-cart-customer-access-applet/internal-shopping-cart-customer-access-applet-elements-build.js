const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-shopping-cart-customer-access-applet/runtime.js',
    './dist/internal-shopping-cart-customer-access-applet/polyfills-es5.js',
    './dist/internal-shopping-cart-customer-access-applet/scripts.js',
    './dist/internal-shopping-cart-customer-access-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-shopping-cart-customer-access-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-shopping-cart-customer-access-applet/internal-shopping-cart-customer-access-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();