"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ejs = _interopRequireDefault(require("ejs"));
var _fs = _interopRequireDefault(require("fs"));
var _path = require("./path");
var _event = _interopRequireDefault(require("./event"));
var _multer = _interopRequireDefault(require("multer"));
var _admZip = _interopRequireDefault(require("adm-zip"));
var _router = require("./router");
var _themeRead = require("./themeRead");
var _site = require("./site");
var _ = require("./404");
var _pages = require("./pages");
var _reset = _interopRequireDefault(require("./reset"));
var _restart = _interopRequireDefault(require("./restart"));
var _log = require("./log");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var router = new _router.Router();
var pageUrls = (0, _pages.getPageUrlsAwait)();
var themeMenus = [];
(0, _themeRead.themeFound)();
var themeUpload = (0, _multer["default"])({
  storage: _multer["default"].diskStorage({
    destination: function destination(req, file, done) {
      done(null, (0, _path.rootDir)('theme'));
    },
    filename: function filename(req, file, done) {
      var ext = _path.path.extname(file.originalname);
      done(null, 'upload_theme_' + new Date().valueOf() + ext);
    }
  }),
  fileFilter: function fileFilter(req, file, done) {
    var ext = _path.path.extname(file.originalname);
    if (ext === '.zip') {
      done(null, true);
    } else {
      done(null, false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});
function basicData(req, res) {
  return {
    req: req,
    res: res,
    themeMenus: themeMenus,
    path: _path.path
  };
}
router.admin = function (url) {
  var new_cbs = [];
  for (var _len = arguments.length, cb = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    cb[_key - 1] = arguments[_key];
  }
  cb.forEach(function (el, i) {
    new_cbs.push(function (req, res, next) {
      var _req$session, _req$userInfo;
      if ((_req$session = req.session) !== null && _req$session !== void 0 && _req$session.isLogined && req !== null && req !== void 0 && (_req$userInfo = req.userInfo) !== null && _req$userInfo !== void 0 && _req$userInfo.isadmin) {
        return el(req, res, next);
      } else {
        (0, _.error)(req, res);
      }
    });
  });
  router.all.apply(router, [url].concat(new_cbs));
};
function render(data, basicdata, page, callback) {
  if (_fs["default"].existsSync(process.cwd() + '/admin/ejs/' + page + '.ejs')) {
    Object.assign(data, {
      title: '',
      mainflex: true,
      defineTitle: function defineTitle(title) {
        data.title = title;
      },
      defineMainflex: function defineMainflex(isflex) {
        data.mainflex = isflex;
      }
    });
    _ejs["default"].renderFile(process.cwd() + '/admin/ejs/' + page + '.ejs', Object.assign(basicdata, data), {}, function (err, str) {
      _ejs["default"].renderFile(process.cwd() + '/admin/ejs/layout.ejs', Object.assign(basicdata, {
        title: data.title,
        mainflex: data.mainflex,
        page: str
      }), {}, function (e, s) {
        callback(e, s);
      });
    });
  }
}
function themereload() {
  themeMenus = [];
  if (_themeRead.activeTheme.admin) {
    _themeRead.activeTheme.admin.forEach(function (page) {
      router.admin(_path.path.join('/admin/theme/', _themeRead.activeTheme.dirname, page.url), /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
          return _regeneratorRuntime().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return page.routing(req, res, function (page) {
                  return new Promise( /*#__PURE__*/function () {
                    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(resolve, reject) {
                      var data, basicdata;
                      return _regeneratorRuntime().wrap(function _callee$(_context) {
                        while (1) switch (_context.prev = _context.next) {
                          case 0:
                            data = page.data || {};
                            basicdata = basicData(req, res);
                            if (_fs["default"].existsSync(_path.path.normalize(page.page) + '.ejs')) {
                              Object.assign(data, {
                                title: '',
                                mainflex: true,
                                defineTitle: function defineTitle(title) {
                                  data.title = title;
                                },
                                defineMainflex: function defineMainflex(isflex) {
                                  data.mainflex = isflex;
                                }
                              });
                              _ejs["default"].renderFile(page.page + '.ejs', Object.assign(basicdata, data), {}, function (err, str) {
                                _ejs["default"].renderFile(process.cwd() + '/admin/ejs/layout.ejs', Object.assign(basicdata, {
                                  title: data.title,
                                  mainflex: data.mainflex,
                                  page: str
                                }), {}, function (e, s) {
                                  if (e) console.error(e);
                                  res.status(200).send(s);
                                  resolve();
                                });
                              });
                            }
                          case 3:
                          case "end":
                            return _context.stop();
                        }
                      }, _callee);
                    }));
                    return function (_x3, _x4) {
                      return _ref2.apply(this, arguments);
                    };
                  }());
                });
              case 2:
              case "end":
                return _context2.stop();
            }
          }, _callee2);
        }));
        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
    });
    if (themeMenus = structuredClone(_themeRead.activeTheme.themeMenu)) {
      if (!Array.isArray(themeMenus)) themeMenus = [themeMenus];
    }
  }
}
_event["default"].on("theme_change", themereload);
themereload();
router.admin('/admin/', /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var _req$userInfo2;
    var user5, data;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          user5 = [];
          _context3.next = 3;
          return (0, _site.getMembers)();
        case 3:
          _context3.sent.sort(function (a, b) {
            return b.joinDate - a.joinDate;
          }).forEach(function (element, i) {
            if (i < 5) user5.push(element);
          });
          _context3.t0 = user5;
          _context3.t1 = (_req$userInfo2 = req.userInfo) === null || _req$userInfo2 === void 0 ? void 0 : _req$userInfo2.member_number;
          _context3.next = 8;
          return _site.tables.owner.get();
        case 8:
          _context3.t2 = _context3.sent;
          _context3.t3 = _context3.t1 === _context3.t2;
          data = {
            user5: _context3.t0,
            isOwner: _context3.t3
          };
          render(data, basicData(req, res), 'index', function (err, str) {
            if (err) console.error(err);
            res.status(200).send(str);
          });
        case 12:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
router.admin('/admin/site/BasicPreferences/', /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var _req$userInfo3, siteOwner, isOwner, _req$userInfo4, admins, data;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          if (!(req.body.siteName && req.body.siteDescription)) {
            _context4.next = 31;
            break;
          }
          _context4.t0 = (_req$userInfo3 = req.userInfo) === null || _req$userInfo3 === void 0 ? void 0 : _req$userInfo3.member_number;
          _context4.next = 4;
          return _site.tables.owner.get();
        case 4:
          _context4.t1 = _context4.sent;
          isOwner = _context4.t0 === _context4.t1;
          if (!(req.body.siteName === '')) {
            _context4.next = 10;
            break;
          }
          res.msgRedirect(req.originalUrl, {
            type: 'danger',
            msg: '사이트 제목은 빈칸일 수 없습니다.'
          });
          _context4.next = 29;
          break;
        case 10:
          _context4.t2 = isOwner;
          if (!_context4.t2) {
            _context4.next = 17;
            break;
          }
          _context4.next = 14;
          return (0, _site.getMemberNumber)(req.body.siteOwner);
        case 14:
          _context4.t3 = siteOwner = _context4.sent;
          _context4.t4 = undefined;
          _context4.t2 = _context4.t3 === _context4.t4;
        case 17:
          if (!_context4.t2) {
            _context4.next = 21;
            break;
          }
          res.msgRedirect(req.originalUrl, {
            type: 'danger',
            msg: "'".concat(req.body.siteOwner, "' \uC0AC\uC6A9\uC790\uAC00 \uC874\uC7AC\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.")
          });
          _context4.next = 29;
          break;
        case 21:
          req.siteInfo.title = req.body.siteName;
          req.siteInfo.description = req.body.siteDescription;
          _context4.next = 25;
          return (0, _site.setSiteInfo)(req.siteInfo);
        case 25:
          if (!isOwner) {
            _context4.next = 28;
            break;
          }
          _context4.next = 28;
          return _site.tables.owner.set(siteOwner);
        case 28:
          res.msgRedirect(req.originalUrl, {
            type: 'success',
            msg: "\uC124\uC815 \uC131\uACF5!"
          });
        case 29:
          _context4.next = 46;
          break;
        case 31:
          admins = [];
          _context4.next = 34;
          return (0, _site.getMembers)();
        case 34:
          _context4.sent.forEach(function (el) {
            if (el.isadmin) admins.push(el);
          });
          _context4.t5 = (_req$userInfo4 = req.userInfo) === null || _req$userInfo4 === void 0 ? void 0 : _req$userInfo4.member_number;
          _context4.next = 38;
          return _site.tables.owner.get();
        case 38:
          _context4.t6 = _context4.sent;
          _context4.t7 = _context4.t5 === _context4.t6;
          _context4.next = 42;
          return _site.tables.owner.get();
        case 42:
          _context4.t8 = _context4.sent;
          _context4.t9 = admins;
          data = {
            isowner: _context4.t7,
            owner: _context4.t8,
            admins: _context4.t9
          };
          render(data, basicData(req, res), 'site/BasicPreferences', function (err, str) {
            if (err) console.error(err);
            res.status(200).send(str);
          });
        case 46:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
router.admin('/admin/install', function (req, res) {
  var data = {};
  render(data, basicData(req, res), 'server/install', function (err, str) {
    if (err) console.error(err);
    res.status(200).send(str);
  });
});
router.admin('/admin/server/serverSettings/', /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var _req$userInfo5;
    var data, _data;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.t0 = (_req$userInfo5 = req.userInfo) === null || _req$userInfo5 === void 0 ? void 0 : _req$userInfo5.member_number;
          _context5.next = 3;
          return _site.tables.owner.get();
        case 3:
          _context5.t1 = _context5.sent;
          if (!(_context5.t0 === _context5.t1)) {
            _context5.next = 17;
            break;
          }
          if (!0 /*req.body.siteName && req.body.siteDescription*/) {
            _context5.next = 8;
            break;
          }
          _context5.next = 15;
          break;
        case 8:
          if (!(req.query.send === "visitorCount_reset")) {
            _context5.next = 14;
            break;
          }
          _context5.next = 11;
          return _site.tables.visit.set([]);
        case 11:
          res.msgRedirect('/admin/server/serverSettings/', {
            type: 'success',
            msg: '접속자 집계가 초기화됬습니다!'
          });
          _context5.next = 15;
          break;
        case 14:
          if (req.query.send === "log_reset") {
            (0, _log.logReset)();
            res.msgRedirect('/admin/server/serverSettings/', {
              type: 'success',
              msg: '로그가 초기화됬습니다!'
            });
          } else if (req.query.send === "restart") {
            res.redirect('/admin/');
            (0, _restart["default"])();
          } else if (req.query.send === "reset") {
            res.redirect('/admin/install');
            (0, _reset["default"])();
            (0, _restart["default"])();
          } else {
            data = {
              log: (0, _log.readHTMLlogs)()
            };
            render(data, basicData(req, res), 'server/serverSettings', function (err, str) {
              if (err) console.error(err);
              res.status(200).send(str);
            });
          }
        case 15:
          _context5.next = 19;
          break;
        case 17:
          _data = {};
          render(_data, basicData(req, res), '403', function (err, str) {
            if (err) console.error(err);
            res.status(403).send(str);
          });
        case 19:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());
router.admin('/admin/member/memberManagement/', /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var _req$userInfo6;
    var data;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return (0, _site.getMembers)();
        case 2:
          _context6.t0 = _context6.sent;
          _context6.t1 = (_req$userInfo6 = req.userInfo) === null || _req$userInfo6 === void 0 ? void 0 : _req$userInfo6.member_number;
          _context6.next = 6;
          return _site.tables.owner.get();
        case 6:
          _context6.t2 = _context6.sent;
          _context6.t3 = _context6.t1 === _context6.t2;
          data = {
            users: _context6.t0,
            isOwner: _context6.t3
          };
          render(data, basicData(req, res), 'member/memberManagement', function (err, str) {
            if (err) console.error(err);
            res.status(200).send(str);
          });
        case 10:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}());
router.admin('/admin/member/memberEdit/:memberName', /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var _req$userInfo7, isOwner, data;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          if (!(!req.params.memberName || !(0, _site.getUserInfo)(req.params.memberName))) {
            _context7.next = 4;
            break;
          }
          res.msgRedirect('/admin/member/memberManagement/', {
            type: 'danger',
            msg: '존재하지 않는 회원입니다.'
          });
          _context7.next = 46;
          break;
        case 4:
          _context7.t0 = (_req$userInfo7 = req.userInfo) === null || _req$userInfo7 === void 0 ? void 0 : _req$userInfo7.member_number;
          _context7.next = 7;
          return _site.tables.owner.get();
        case 7:
          _context7.t1 = _context7.sent;
          isOwner = _context7.t0 === _context7.t1;
          _context7.t2 = req.params.memberName;
          _context7.next = 12;
          return (0, _site.getMemberNumber)(req.params.memberName);
        case 12:
          _context7.t3 = _context7.sent;
          _context7.t4 = new Object();
          _context7.t5 = isOwner;
          data = {
            username: _context7.t2,
            memberNumber: _context7.t3,
            userInfo: _context7.t4,
            isOwner: _context7.t5
          };
          _context7.next = 18;
          return (0, _site.getUserInfo)(data.memberNumber);
        case 18:
          data.userInfo = _context7.sent;
          if (!req.body.level) {
            _context7.next = 45;
            break;
          }
          _context7.next = 22;
          return _site.tables.owner.get();
        case 22:
          _context7.t6 = _context7.sent;
          _context7.t7 = data.userInfo.member_number;
          if (!(_context7.t6 === _context7.t7)) {
            _context7.next = 26;
            break;
          }
          res.msgRedirect(req.originalUrl, {
            type: 'danger',
            msg: '주인을 편집할 수는 없습니다.'
          });
        case 26:
          if (!(!isOwner && data.userInfo.level >= req.userInfo.level && data.userInfo.isadmin)) {
            _context7.next = 30;
            break;
          }
          res.msgRedirect(req.originalUrl, {
            type: 'danger',
            msg: '설정하시려는 회원의 레벨이 사용자님의 레벨보다 높거나 같습니다.'
          });
          _context7.next = 43;
          break;
        case 30:
          if (!(!isOwner && +req.body.level > req.userInfo.level)) {
            _context7.next = 34;
            break;
          }
          res.msgRedirect(req.originalUrl, {
            type: 'danger',
            msg: '설정하시려는 레벨이 사용자님의 레벨보다 높습니다.'
          });
          _context7.next = 43;
          break;
        case 34:
          if (!(+req.body.level < 1)) {
            _context7.next = 38;
            break;
          }
          res.msgRedirect(req.originalUrl, {
            type: 'danger',
            msg: '레벨은 0 이상이여야 합니다.'
          });
          _context7.next = 43;
          break;
        case 38:
          data.userInfo.isadmin = !!req.body.isadmin;
          data.userInfo.level = +req.body.level;
          _context7.next = 42;
          return (0, _site.setUserInfo)(data.memberNumber, data.userInfo);
        case 42:
          res.msgRedirect(req.originalUrl, {
            type: 'success',
            msg: '설정 성공!'
          });
        case 43:
          _context7.next = 46;
          break;
        case 45:
          render(data, basicData(req, res), 'member/memberEdit', function (err, str) {
            if (err) console.error(err);
            res.status(200).send(str);
          });
        case 46:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function (_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}());
router.admin('/admin/member/visitorCount/', /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    var data;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return _site.tables.visit.get();
        case 2:
          _context8.t0 = _context8.sent;
          data = {
            visit: _context8.t0
          };
          render(data, basicData(req, res), 'member/visitorCount', function (err, str) {
            if (err) console.error(err);
            res.status(200).send(str);
          });
        case 5:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function (_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}());
router.admin('/admin/theme-update/themeManager/', function (req, res) {
  var data = {
    themes: _themeRead.themes
  };
  render(data, basicData(req, res), 'theme/themeManager', function (err, str) {
    if (err) console.error(err);
    res.status(200).send(str);
  });
});
router.admin('/admin/theme-update/themeInstaller/', function (req, res) {
  var data = {
    themes: _themeRead.themes
  };
  render(data, basicData(req, res), 'theme/themeInstaller', function (err, str) {
    if (err) console.error(err);
    res.status(200).send(str);
  });
});
router.admin('/admin/theme-update/upload/', themeUpload.single('theme'), function (req, res) {
  if (req.file) {
    var zip = new _admZip["default"](req.file.path);
    zip.extractAllTo((0, _path.rootDir)('theme'), true);
    _event["default"].emit("theme_change");
    res.msgRedirect('/admin/theme-update/themeInstaller', {
      type: 'success',
      msg: '테마가 추가되었습니다.'
    });
  } else {
    res.msgRedirect('/admin/theme-update/themeInstaller', {
      type: 'danger',
      msg: '지원되지 않는 테마 파일 형식입니다'
    });
  }
});
router.admin('/admin/theme-update/active/:themeName', /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
    var siteInfo;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          if (!(!req.params.themeName || !_themeRead.themes.some(function (el) {
            return el.dirname === req.params.themeName;
          }))) {
            _context9.next = 4;
            break;
          }
          res.msgRedirect('/admin/theme-update/themeManager/', {
            type: 'danger',
            msg: '존재하지 않는 테마입니다.'
          });
          _context9.next = 16;
          break;
        case 4:
          if (!(_themeRead.activeTheme.dirname === req.params.themeName)) {
            _context9.next = 8;
            break;
          }
          res.msgRedirect('/admin/theme-update/themeManager/', {
            type: 'danger',
            msg: '이미 활성화되있습니다.'
          });
          _context9.next = 16;
          break;
        case 8:
          _context9.next = 10;
          return (0, _site.getSiteInfo)();
        case 10:
          siteInfo = _context9.sent;
          siteInfo.theme = req.params.themeName;
          _context9.next = 14;
          return (0, _site.setSiteInfo)(siteInfo);
        case 14:
          _event["default"].emit("theme_change");
          res.msgRedirect('/admin/theme-update/themeManager/', {
            type: 'success',
            msg: '활성화 되었습니다!'
          });
        case 16:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return function (_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}());
router.admin('/admin/(*)', function (req, res) {
  var data = {};
  render(data, basicData(req, res), '404', function (err, str) {
    if (err) console.error(err);
    res.status(404).send(str);
  });
});
router.use('/static', _router.express["static"](_path.path.join(process.cwd(), 'admin/static')));
var _default = router;
exports["default"] = _default;