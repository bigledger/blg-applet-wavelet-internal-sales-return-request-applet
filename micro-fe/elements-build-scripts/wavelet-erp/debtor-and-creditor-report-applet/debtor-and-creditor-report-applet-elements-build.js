const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/debtor-and-creditor-report-applet/runtime.js',
    './dist/debtor-and-creditor-report-applet/polyfills.js',
    './dist/debtor-and-creditor-report-applet/scripts.js',
    './dist/debtor-and-creditor-report-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/debtor-and-creditor-report-applet');
  await concat(files, './elements/wavelet-erp/applets/debtor-and-creditor-report-applet/debtor-and-creditor-report-applet-elements.js');
  // await fs.copyFile(
  //   './dist/wavelet-erp/applets/debtor-and-creditor-report-applet/styles.css',
  //   './elements/wavelet-erp/applets/debtor-and-creditor-report-applet/styles.css'
  // );
})();
