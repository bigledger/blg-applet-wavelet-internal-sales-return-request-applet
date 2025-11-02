const fs = require("fs-extra");
const concat = require("concat");

(async function build() {
  const files = [
    "./dist/warehouse-management-system-applet/runtime.js",
    "./dist/warehouse-management-system-applet/polyfills-es5.js",
    "./dist/warehouse-management-system-applet/scripts.js",
    "./dist/warehouse-management-system-applet/main.js",
  ];

  await fs.ensureDir("./elements/wavelet-erp/applets/warehouse-management-system-applet");
  await concat(
    files,
    "./elements/wavelet-erp/applets/warehouse-management-system-applet/warehouse-management-system-applet-elements.js"
  );
})();
