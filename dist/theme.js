"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _router = require("./router");
var _themeRead = require("./themeRead");
var _themeRequire2 = _interopRequireDefault(require("./themeRequire"));
var _event = _interopRequireDefault(require("./event"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var router = new _router.Router();
var _themeRequire = (0, _themeRequire2["default"])(),
  pages = _themeRequire.pages;
var _loop = function _loop() {
  if (Object.hasOwnProperty.call(pages, key)) {
    var element = pages[key];
    router.receive(key, function (req, res) {
      return element(req, res);
    });
  }
};
for (var key in pages) {
  _loop();
}
function themeStatic() {
  router.use('/static', _router.express["static"](_themeRead.activeTheme.dir + '/static'));
}
themeStatic();
_event["default"].on("theme_change", themeStatic);
var _default = router;
exports["default"] = _default;