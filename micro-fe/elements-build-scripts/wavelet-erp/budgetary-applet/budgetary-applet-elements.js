const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/budgetary-applet/runtime.js',
    './dist/budgetary-applet/polyfills-es5.js',
    './dist/budgetary-applet/scripts.js',
    './dist/budgetary-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/budgetary-applet');
  await concat(files, './elements/wavelet-erp/applets/budgetary-applet/budgetary-applet-elements.js');
})();