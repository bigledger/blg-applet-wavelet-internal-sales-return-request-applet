const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/stock-balance-applet/runtime.js',
    './dist/stock-balance-applet/polyfills-es5.js',
    './dist/stock-balance-applet/scripts.js',
    './dist/stock-balance-applet/main.js'
  ];

  await fs.ensureDir('./elements/akaun-platform/applets/stock-balance-applet');
  await concat(files, './elements/akaun-platform/applets/stock-balance-applet/stock-balance-applet-elements.js');
  // await fs.copyFile(
  //   './dist/akaun-platform/applets/developer-maintenance-applet/styles.css',
  //   './elements/akaun-platform/applets/developer-maintenance-applet/styles.css'
  // );
})();
