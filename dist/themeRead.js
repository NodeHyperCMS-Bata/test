"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.activeTheme = void 0;
exports.themeFound = themeFound;
exports.themes = exports.themeMenu = void 0;
var _fs = _interopRequireDefault(require("fs"));
var _path = require("./path");
var _log = _interopRequireDefault(require("./log"));
var _colorlog = require("./colorlog");
var _event = _interopRequireDefault(require("./event"));
var _site = require("./site");
var _markdown = _interopRequireDefault(require("./markdown"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var themes = [];
exports.themes = themes;
var themeMenu = [];
exports.themeMenu = themeMenu;
var activeTheme = new Object();
exports.activeTheme = activeTheme;
function themeFound() {
  exports.themes = themes = [];
  exports.themeMenu = themeMenu = [];
  var siteInfo = (0, _site.getSiteInfoAwait)();
  _fs["default"].readdirSync((0, _path.rootDir)('theme'), {
    withFileTypes: true
  }).forEach(function (file) {
    var dir = file.name;
    if (file.isDirectory()) {
      var _config;
      (0, _log["default"])("Found theme ".concat(_colorlog.colorlog.blue(dir), "."));
      var themeDir = 'theme/' + dir,
        themeRootDir = (0, _path.rootDir)(themeDir),
        themeMainFile,
        config,
        configDir,
        screenshot,
        screenshotDir;
      if (_fs["default"].existsSync(configDir = (0, _path.rootDir)(themeDir, 'package.json'))) {
        config = JSON.parse(_fs["default"].readFileSync(configDir, "utf8"));
      } else {
        (0, _log["default"])("Theme ".concat(_colorlog.colorlog.yellow(dir), " is missing package.json."), "warning");
      }
      if (_fs["default"].existsSync(themeMainFile = (0, _path.rootDir)(themeDir, ((_config = config) === null || _config === void 0 ? void 0 : _config.main) || 'index.js'))) {
        var _config2, _config3;
        var readme, readmeDir;
        if (_fs["default"].existsSync(readmeDir = (0, _path.rootDir)(themeDir, 'readme.md'))) {
          readme = _fs["default"].readFileSync(readmeDir, "utf8");
        } else {
          (0, _log["default"])("Theme ".concat(_colorlog.colorlog.yellow(dir), " is missing readme.md."), "warning");
        }
        if (_fs["default"].existsSync(screenshotDir = (0, _path.rootDir)(themeDir, 'screenshot.jpg'))) {
          try {
            screenshot = Buffer.from(_fs["default"].readFileSync(screenshotDir)).toString('base64');
          } catch (err) {
            (0, _log["default"])("There is a problem reading screenshot.jpg of theme ".concat(_colorlog.colorlog.yellow(dir), "."), "warning");
          }
        } else {
          (0, _log["default"])("Theme ".concat(_colorlog.colorlog.yellow(dir), " is missing screenshot.jpg."), "warning");
        }
        var themeData = {
          name: config !== undefined ? config['theme-name'] || dir : dir,
          dirname: dir,
          dir: themeRootDir,
          readme: readme !== undefined ? (0, _markdown["default"])(readme) : undefined,
          readmeMd: readme,
          author: ((_config2 = config) === null || _config2 === void 0 ? void 0 : _config2.author) || "",
          version: ((_config3 = config) === null || _config3 === void 0 ? void 0 : _config3.version) || "1.0.0",
          screenshot: screenshot,
          active: siteInfo.theme === dir
        };
        if (themeData.active) {
          try {
            var theme = require(themeMainFile);
            themeData = Object.assign(themeData, {
              exports: theme,
              router: theme.router,
              admin: theme.adminPages,
              themeMenu: theme.themeMenu
            });
            exports.activeTheme = activeTheme = themeData;
          } catch (error) {
            (0, _log["default"])("An error occurred in theme ".concat(_colorlog.colorlog.red(dir), ".\nat ").concat(_colorlog.colorlog.blue(themeMainFile), "\nerror: ").concat(_colorlog.colorlog.red(error)), 'error');
            themeData = null;
          }
        }
        if (themeData) themes.push(themeData);
      } else {
        var _config4;
        (0, _log["default"])("Theme ".concat(_colorlog.colorlog.red(dir), " does not have ").concat(_colorlog.colorlog.blue(((_config4 = config) === null || _config4 === void 0 ? void 0 : _config4.main) || 'index.js'), ".\nat ").concat(_colorlog.colorlog.blue((0, _path.rootDir)(themeDir))), 'error');
      }
    }
  });
}
_event["default"].on("theme_change", themeFound);