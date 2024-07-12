"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));
var _database = require("./database");
var _start = _interopRequireDefault(require("./start"));
var _colorlog = require("./colorlog");
var _log = require("./log");
var _killPort = _interopRequireDefault(require("kill-port"));
var _fs = _interopRequireDefault(require("fs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
_dotenv["default"].config();
var port = process.env.POST || 3000;
function server() {
  require('./main.js');
}
(0, _log.addText)('\n', _colorlog.colorlog.blue("    _   __          __     __  __                      ________  ________"), '\n', _colorlog.colorlog.cyan("   / | / /___  ____/ /__  / / / /_  ______  ___  _____/ ____/  |/  / ___/"), '\n', _colorlog.colorlog.magenta("  /  |/ / __ \\/ __  / _ \\/ /_/ / / / / __ \\/ _ \\/ ___/ /   / /|_/ /\\__ \\ "), '\n', _colorlog.colorlog.red(" / /|  / /_/ / /_/ /  __/ __  / /_/ / /_/ /  __/ /  / /___/ /  / /___/ / "), '\n', _colorlog.colorlog.yellow("/_/ |_/\\____/\\__,_/\\___/_/ /_/\\__, / .___/\\___/_/   \\____/_/  /_//____/  "), '\n', _colorlog.colorlog.white("                             /____/_/                                    "));
(0, _log.addText)("\nServer starting...");

//eraseDatabase();
(0, _log.addText)("Killing port ".concat(_colorlog.colorlog.blue(port), "..."));
new Promise(function (resolve, reject) {
  (0, _killPort["default"])(port, 'tcp').then(function () {
    (0, _log.addText)("Port ".concat(_colorlog.colorlog.blue(port), " kill ").concat(_colorlog.colorlog.green('successfully!')));
    resolve("successfully");
  })["catch"](function (err) {
    if (err.message === 'No process running on port') {
      (0, _log.addText)("".concat(_colorlog.colorlog.green('Ok'), ", No process running on port ").concat(_colorlog.colorlog.blue(port)));
      resolve("successfully");
    } else {
      (0, _log.addText)("".concat(_colorlog.colorlog.red('Error'), " killing port ").concat(_colorlog.colorlog.blue(port)));
      (0, _log.addText)("".concat(_colorlog.colorlog.red('Error')), err.message);
      resolve(err);
    }
  });
}).then(function (res) {
  if (!(0, _database.existsDatabase)() || !_fs["default"].existsSync(process.cwd() + '/config.js')) {
    (0, _start["default"])().then(function () {
      return server();
    });
  } else server();
});