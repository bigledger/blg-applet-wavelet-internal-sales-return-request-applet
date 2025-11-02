const fs = require("fs-extra");
const concat = require("concat");

(async function build() {
  const files = [
    "./dist/delivery-installation-applet-V2/runtime.js",
    "./dist/delivery-installation-applet-V2/polyfills.js",
    "./dist/delivery-installation-applet-V2/scripts.js",
    "./dist/delivery-installation-applet-V2/main.js",
  ];

  await fs.ensureDir(
    "./elements/wavelet-erp/applets/delivery-installation-applet"
  );

  await concat(
    files,
    "./elements/wavelet-erp/applets/delivery-installation-applet/delivery-installation-applet-elements.js"
  );

})();
