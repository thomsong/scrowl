// Dynamically export all slices

const req = require.context(".", true, /\.\/.+\/.+\.ts$/);

const exports: any = {};

req.keys().forEach((key) => {
  const sliceExports = req(key);
  const defaultSlice = sliceExports["default"];

  if (!defaultSlice) {
    return;
  }

  let sliceName = key.substr(2, key.length - 5);

  if (sliceName.endsWith("subscriber")) {
    return;
  }

  if (sliceName.endsWith("index")) {
    sliceName = sliceName.substring(0, sliceName.length - 6);
  }

  if (defaultSlice) {
    exports[sliceName] = defaultSlice;
  }
});

export default exports;
