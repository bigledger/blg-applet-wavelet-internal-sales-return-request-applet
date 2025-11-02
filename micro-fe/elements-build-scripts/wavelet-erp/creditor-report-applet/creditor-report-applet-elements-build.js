const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/creditor-report-applet-V2/runtime.js',
    './dist/creditor-report-applet-V2/polyfills-es5.js',
    './dist/creditor-report-applet-V2/scripts.js',
    './dist/creditor-report-applet-V2/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/creditor-report-applet-V2');
  await concat(files, './elements/wavelet-erp/applets/creditor-report-applet-V2/creditor-report-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/debtor-and-creditor-report-applet/styles.css',
  //   './elements/wavelet-erp/applets/debtor-and-creditor-report-applet/styles.css'
  // );
})();
