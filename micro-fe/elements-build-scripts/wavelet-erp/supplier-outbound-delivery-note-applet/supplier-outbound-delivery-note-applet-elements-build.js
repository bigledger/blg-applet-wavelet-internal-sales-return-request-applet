const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/supplier-outbound-delivery-note-applet/runtime.js',
    './dist/supplier-outbound-delivery-note-applet/polyfills-es5.js',
    './dist/supplier-outbound-delivery-note-applet/scripts.js',
    './dist/supplier-outbound-delivery-note-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/supplier-outbound-delivery-note-applet');
  await concat(files, './elements/wavelet-erp/applets/supplier-outbound-delivery-note-applet/supplier-outbound-delivery-note-applet-elements.js');

})();