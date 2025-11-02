const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    'dist/web-hook-applet/runtime.js',
    'dist/web-hook-applet/polyfills.js',
    'dist/web-hook-applet/scripts.js',
    'dist/web-hook-applet/main.js'
  ];

  await fs.ensureDir('elements/wavelet-erp/applets/web-hook-applet');
  await concat(files, 'elements/wavelet-erp/applets/web-hook-applet/web-hook-applet-elements.js');

})();
