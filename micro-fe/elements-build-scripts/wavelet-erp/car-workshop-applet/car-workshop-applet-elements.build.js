const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/car-workshop-applet/runtime.js',
    './dist/car-workshop-applet/polyfills-es5.js',
    './dist/car-workshop-applet/scripts.js',
    './dist/car-workshop-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/car-workshop-applet');
  await concat(files, './elements/wavelet-erp/applets/car-workshop-applet/car-workshop-applet-elements.js');
})();
