const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    'dist/warranty-admin-applet/runtime.js',
    'dist/warranty-admin-applet/polyfills.js',
    'dist/warranty-admin-applet/scripts.js',
    'dist/warranty-admin-applet/main.js'
  ];

  await fs.ensureDir('elements/wavelet-erp/applets/warranty-admin-applet');
  await concat(files, 'elements/wavelet-erp/applets/warranty-admin-applet/warranty-admin-applet-elements.js');

})();
