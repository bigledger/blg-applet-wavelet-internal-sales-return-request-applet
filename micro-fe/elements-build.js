const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/akaun-platform/applets/auth-applet/runtime.js',
    './dist/akaun-platform/applets/auth-applet/polyfills.js',
    './dist/akaun-platform/applets/auth-applet/scripts.js',
    './dist/akaun-platform/applets/auth-applet/main.js'
  ];

  await fs.ensureDir('elements');
  await concat(files, 'elements/akaun-platform/applets/auth-applet/auth-applet-elements.js');
  await fs.copyFile(
    './dist/akaun-platform/applets/auth-applet/styles.css',
    'elements/akaun-platform/applets/auth-applet/styles.css'
  );
})();
