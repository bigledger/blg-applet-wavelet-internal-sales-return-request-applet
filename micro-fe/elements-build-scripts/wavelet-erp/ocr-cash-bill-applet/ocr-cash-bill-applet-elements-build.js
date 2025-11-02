const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/ocr-cash-bill-applet/runtime.js',
    './dist/ocr-cash-bill-applet/polyfills-es5.js',
    './dist/ocr-cash-bill-applet/scripts.js',
    './dist/ocr-cash-bill-applet/main.js'
  ];
  await fs.ensureDir('./elements/wavelet-erp/applets/ocr-cash-bill-applet');
  await concat(files, './elements/wavelet-erp/applets/ocr-cash-bill-applet/ocr-cash-bill-applet-elements.js');
  await fs.copyFile(
    './dist/ocr-cash-bill-applet/styles.css',
    './elements/wavelet-erp/applets/ocr-cash-bill-applet/styles.css'
  )
})();