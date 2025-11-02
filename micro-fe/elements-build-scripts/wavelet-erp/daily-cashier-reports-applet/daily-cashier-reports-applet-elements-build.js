const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/daily-cashier-reports-applet/runtime.js',
    './dist/daily-cashier-reports-applet/polyfills.js',
    './dist/daily-cashier-reports-applet/scripts.js',
    './dist/daily-cashier-reports-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/daily-cashier-reports-applet');
  await concat(files, './elements/wavelet-erp/applets/daily-cashier-reports-applet/daily-cashier-reports-applet-elements.js');
  
})();