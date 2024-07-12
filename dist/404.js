"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.error = exports["default"] = void 0;
var _router = require("./router");
var _themeRequire = _interopRequireDefault(require("./themeRequire.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var router = new _router.Router();
var theme = (0, _themeRequire["default"])();
router.all('*', function (req, res) {
  return error(req, res);
});
var error = theme.error;
exports.error = error;
var _default = router;
exports["default"] = _default;