const withTM = require("next-transpile-modules")([
  "button",
  "calendar",
  "dialog",
  "tabbable",
]);

module.exports = withTM({
  reactStrictMode: true,
});
