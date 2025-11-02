const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/statement-of-account-applet/runtime.js',
    './dist/statement-of-account-applet/polyfills-es5.js',
    './dist/statement-of-account-applet/scripts.js',
    './dist/statement-of-account-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/statement-of-account-applet');
  await concat(files, './elements/wavelet-erp/applets/statement-of-account-applet/statement-of-account-applet-elements.js');
})();
