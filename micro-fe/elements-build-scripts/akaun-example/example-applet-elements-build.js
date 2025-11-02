const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/example-applet/runtime.js',
    './dist/example-applet/polyfills-es5.js',
    './dist/example-applet/scripts.js',
    './dist/example-applet/main.js'
  ];

  await fs.ensureDir('./elements/akaun-platform/applets/example-applet');
  await concat(files, './elements/akaun-platform/applets/example-applet/example-applet-elements.js');

})();
