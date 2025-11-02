const fs = require("fs-extra");
const concat = require("concat");

(async function build() {
  const files = [
    "./dist/wavelet-erp/applets/cashbook-v3-applet/runtime.js",
    "./dist/wavelet-erp/applets/cashbook-v3-applet/polyfills-es5.js",
    "./dist/wavelet-erp/applets/cashbook-v3-applet/scripts.js",
    "./dist/wavelet-erp/applets/cashbook-v3-applet/main.js",
  ];

  await fs.ensureDir("./elements/wavelet-erp/applets/cashbook-applet");
  await concat(
    files,
    "./elements/wavelet-erp/applets/cashbook-applet/cashbook-applet-elements.js"
  );
})();
