let scope = typeof global !== "undefined" ? global : self;
if (!scope._babelPolyfill) {
  require("babel-polyfill");
}
