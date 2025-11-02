const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/internal-goods-dispatch-note-applet/runtime.js',
    './dist/internal-goods-dispatch-note-applet/polyfills-es5.js',
    './dist/internal-goods-dispatch-note-applet/scripts.js',
    './dist/internal-goods-dispatch-note-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/internal-goods-dispatch-note-applet');
  await concat(files, './elements/wavelet-erp/applets/internal-goods-dispatch-note-applet/internal-goods-dispatch-note-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/developer-maintenance-applet/styles.css',
  //   './elements/wavelet-erp/applets/developer-maintenance-applet/styles.css'
  // );
})();
