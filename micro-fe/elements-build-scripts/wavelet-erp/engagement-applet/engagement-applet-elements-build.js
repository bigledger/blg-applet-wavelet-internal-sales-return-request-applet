const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/engagement-applet/runtime.js',
    './dist/engagement-applet/polyfills-es5.js',
    './dist/engagement-applet/scripts.js',
    './dist/engagement-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/engagement-applet');
  await concat(files, './elements/wavelet-erp/applets/engagement-applet/engagement-applet-elements.js');

})();
