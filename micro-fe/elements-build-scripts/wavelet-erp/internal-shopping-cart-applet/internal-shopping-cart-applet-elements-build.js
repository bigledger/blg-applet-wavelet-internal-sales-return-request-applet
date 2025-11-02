const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-shopping-cart-applet/runtime.js',
    './dist/internal-shopping-cart-applet/polyfills-es5.js',
    './dist/internal-shopping-cart-applet/scripts.js',
    './dist/internal-shopping-cart-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-shopping-cart-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-shopping-cart-applet/internal-shopping-cart-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();