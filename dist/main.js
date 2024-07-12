"use strict";

var _os = _interopRequireDefault(require("os"));
var _app = require("./app");
var _colorlog = require("./colorlog");
var _log = require("./log");
var _event = _interopRequireDefault(require("./event"));
var _ip = _interopRequireDefault(require("ip"));
var _api = _interopRequireDefault(require("./api"));
var _admin = _interopRequireDefault(require("./admin"));
var _theme = _interopRequireDefault(require("./theme"));
var _ = _interopRequireDefault(require("./404"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var port = process.env.POST || 3000;
_app.app.use(_theme["default"]);
_app.app.use(_api["default"]);
_app.app.use(_admin["default"]);
_app.app.use(_["default"]);
if (_os["default"].type() !== "Linux") {
  (0, _log.log)("os is ".concat(_colorlog.colorlog.red("not"), " linux. ").concat(_colorlog.colorlog.red("Errors"), " may occur, and some features may ").concat(_colorlog.colorlog.red("not"), " work."), "warning");
}
(0, _log.addText)("\nServer starting...");
_app.app.listen(port, '0.0.0.0', function () {
  (0, _log.addText)("Server start ".concat(_colorlog.colorlog.green('successfully!'), "\n"));
  (0, _log.addText)("".concat(_colorlog.colorlog.green('Ready'), " on port ").concat(_colorlog.colorlog.blue(port), ".\n"));
  (0, _log.addText)("Local:            ".concat(_colorlog.colorlog.blue("http://localhost:".concat(port))));
  (0, _log.addText)("On Your Network:  ".concat(_colorlog.colorlog.blue("http://".concat(_ip["default"].address(), ":").concat(port))));
}).on('error', function (err) {
  (0, _log.addText)('Error message ' + err);
});