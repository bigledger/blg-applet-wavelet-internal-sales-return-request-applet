const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    'dist/virtual-etl-applet/runtime.js',
    'dist/virtual-etl-applet/polyfills.js',
    'dist/virtual-etl-applet/scripts.js',
    'dist/virtual-etl-applet/main.js'
  ];

  await fs.ensureDir('elements/wavelet-erp/applets/virtual-etl-applet');
  await concat(files, 'elements/wavelet-erp/applets/virtual-etl-applet/virtual-etl-applet-elements.js');

})();
