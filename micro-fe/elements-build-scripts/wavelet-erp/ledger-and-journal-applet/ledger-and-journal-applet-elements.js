const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/ledger-and-journal-applet/runtime.js',
    './dist/ledger-and-journal-applet/polyfills.js',
    './dist/ledger-and-journal-applet/scripts.js',
    './dist/ledger-and-journal-applet/main.js'
  ];

  await fs.ensureDir('./elements/wavelet-erp/applets/ledger-and-journal-applet');
  await concat(files, './elements/wavelet-erp/applets/ledger-and-journal-applet/ledger-and-journal-applet-elements.js');
  await fs.copyFile(
    './dist/ledger-and-journal-applet/styles.css',
    './elements/wavelet-erp/applets/ledger-and-journal-applet/styles.css'
  );
})();
