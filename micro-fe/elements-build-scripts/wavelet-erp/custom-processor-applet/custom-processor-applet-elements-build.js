const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/custom-processor-applet/runtime.js',
    './dist/custom-processor-applet/polyfills-es5.js',
    './dist/custom-processor-applet/scripts.js',
    './dist/custom-processor-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/custom-processor-applet');
  await concat(files, './elements/wavelet-erp/applets/custom-processor-applet/custom-processor-applet-elements.js');

})();
