const fs = require("fs-extra");
const concat = require("concat");

(async function build() {
  const files = [
    "./dist/customer-consignment-applet/runtime.js",
    "./dist/customer-consignment-applet/polyfills-es5.js",
    "./dist/customer-consignment-applet/scripts.js",
    "./dist/customer-consignment-applet/main.js",
  ];

  await fs.ensureDir("./elements/wavelet-erp/applets/customer-consignment-applet");
  await concat(
    files,
    "./elements/wavelet-erp/applets/customer-consignment-applet/customer-consignment-applet-elements.js"
  );
})();
