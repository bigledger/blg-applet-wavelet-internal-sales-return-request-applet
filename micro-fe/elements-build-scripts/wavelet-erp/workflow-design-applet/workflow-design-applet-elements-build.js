const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    'dist/workflow-design-applet/runtime.js',
    'dist/workflow-design-applet/polyfills.js',
    'dist/workflow-design-applet/scripts.js',
    'dist/workflow-design-applet/main.js'
  ];

  await fs.ensureDir('elements/wavelet-erp/applets/workflow-design-applet');
  await concat(files, 'elements/wavelet-erp/applets/workflow-design-applet/workflow-design-applet-elements.js');

})();
