// Dynamically export all slices
function init() {
  const req = require.context(".", true, /\.\/.+\/.+\.ts$/);

  req.keys().forEach((key) => {
    const sliceExports = req(key);
    const defaultSlice = sliceExports["default"];

    let sliceName = key.substr(2, key.length - 5);
    if (sliceName.endsWith("subscriber")) {
      // Init here
      defaultSlice();
      return;
    }
  });
}

export default init;
