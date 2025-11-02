const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    'dist/wavelet-erp/applets/internal-jobsheet-applet/runtime.js',
    'dist/wavelet-erp/applets/internal-jobsheet-applet/polyfills-es5.js',
    'dist/wavelet-erp/applets/internal-jobsheet-applet/scripts.js',
    'dist/wavelet-erp/applets/internal-jobsheet-applet/main.js'
  ];

  await fs.ensureDir('elements/wavelet-erp/applets/internal-jobsheet-applet');
  await concat(files, 'elements/wavelet-erp/applets/internal-jobsheet-applet/internal-jobsheet-applet-elements.js');

})();
