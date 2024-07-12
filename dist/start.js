"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = start;
var _dotenv = _interopRequireDefault(require("dotenv"));
var _database = require("./database");
var _site = require("./site");
var _express = _interopRequireDefault(require("express"));
var _expressSession = _interopRequireDefault(require("express-session"));
var _cors = _interopRequireDefault(require("cors"));
var _http = _interopRequireDefault(require("http"));
var _path = require("./path");
var _colorlog = require("./colorlog");
var _log = require("./log");
var _ip = _interopRequireDefault(require("ip"));
var _fs = _interopRequireDefault(require("fs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
_dotenv["default"].config();
var port = process.env.POST || 3000;
function setDatabase(_x) {
  return _setDatabase.apply(this, arguments);
}
function _setDatabase() {
  _setDatabase = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(config) {
    var site_DB, table_members, table_member_names, table_member_number, table_owner, table_site, table_visit;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          site_DB = new _database.Database('site');
          table_members = site_DB.table('members');
          table_member_names = site_DB.table('member_names');
          table_member_number = site_DB.table('member_number');
          table_owner = site_DB.table('owner');
          table_site = site_DB.table('site');
          table_visit = site_DB.table('visit');
          _context3.next = 9;
          return table_member_number.set(0);
        case 9:
          _context3.next = 11;
          return table_members.set(new Array());
        case 11:
          _context3.next = 13;
          return table_member_names.set(new Object());
        case 13:
          _context3.next = 15;
          return table_owner.set(0);
        case 15:
          _context3.next = 17;
          return table_site.set(config.site);
        case 17:
          _context3.next = 19;
          return table_visit.set([]);
        case 19:
          _context3.next = 21;
          return (0, _site.addMember)(config.admin.id, config.admin.password, 15, true);
        case 21:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _setDatabase.apply(this, arguments);
}
function startServer() {
  return new Promise( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(resolve, reject) {
      var app, server;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            app = (0, _express["default"])();
            app.use(_express["default"].json({
              limit: "50mb"
            }));
            app.use(_express["default"].urlencoded({
              limit: "50mb",
              extended: true
            }));
            app.use((0, _expressSession["default"])({
              secret: "keyboard cat",
              resave: false,
              saveUninitialized: true
            }));
            app.use((0, _cors["default"])());
            app.all('/install', /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
                var default_config, html, post, default_data, _post, _default_data, _req$session$data, site_title, site_description, admin_id, admin_password, _req$session$data2, _site_title, _site_description, _admin_id, _admin_password, config;
                return _regeneratorRuntime().wrap(function _callee$(_context) {
                  while (1) switch (_context.prev = _context.next) {
                    case 0:
                      default_config = require((0, _path.rootDir)('default_config.js'))["default"];
                      html = "\n\t\t\t<!doctype html>\n\t\t\t<html lang=\"ko\">\n\t\t\t\t<head>\n\t\t\t\t\t<meta charset=\"utf-8\">\n\t\t\t\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n\t\t\t\t\t<title>NodeHyperCMS install</title>\n\t\t\t\t\t<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css\" rel=\"stylesheet\" integrity=\"sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9\" crossorigin=\"anonymous\">\n\t\t\t\t</head>\n\t\t\t\t<body>\n\t\t\t\t<div class=\"modal d-block\">\n\t\t\t\t\t<div class=\"modal-dialog modal-dialog-scrollable\">\n\t\t\t\t\t\t<div class=\"modal-content\">\n\t\t\t";
                      if (req.session.step !== undefined) {
                        if (req.query.previous === '') {
                          if (req.session.step > 0) req.session.step--;
                        } else if (req.query.next === '') {
                          if (req.session.step < 4) req.session.step++;
                        }
                      }
                      if (!(req.session.step === undefined || req.session.step === 0 || !(req.query.previous !== undefined || req.query.next !== undefined))) {
                        _context.next = 8;
                        break;
                      }
                      html += "\n\t\t\t\t<div class=\"modal-header\">\n                    <h5 class=\"modal-title\">NodeHyperCMS \uC124\uCE58</h5>\n                </div>\n                <div class=\"modal-body\">\n                    <p>NodeHyperCMS\uC5D0 \uC624\uC2E0\uAC78 \uD658\uC601\uD569\uB2C8\uB2E4! \uC124\uCE58\uAC00 \uAC70\uC758 \uB2E4 \uB42C\uC2B5\uB2C8\uB2E4. \uC774\uC81C \uBA87\uBA87 \uC9C8\uBB38\uC5D0\uB9CC \uB2F5\uD574\uC8FC\uBA74 \uB429\uB2C8\uB2E4!</p>\n                </div>\n                <div class=\"modal-footer\">\n                    <a role=\"button\" class=\"btn btn-primary\" href=\"/install?next\">\uB2E4\uC74C</a>\n                </div>\n\t\t\t\t";
                      req.session.step = 0;
                      _context.next = 31;
                      break;
                    case 8:
                      if (!(req.session.step === 4 && req.query.next === "")) {
                        _context.next = 12;
                        break;
                      }
                      html += "\n\t\t\t\t<div class=\"modal-header\">\n\t\t\t\t\t<h5 class=\"modal-title\">NodeHyperCMS \uC124\uCE58 \uC644\uB8CC!</h5>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"modal-body\">\n\t\t\t\t\t<p>NodeHyperCMS \uC124\uCE58\uAC00 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4!</p>\n\t\t\t\t\t<p>\uC774\uC81C 5\uCD08 \uD6C4 \uC11C\uBC84\uAC00 \uC2DC\uC791\uB429\uB2C8\uB2E4.</p>\n\t\t\t\t\t<p></p>\n\t\t\t\t\t<p>\uB0A8\uC740 \uC2DC\uAC04(\uC608\uC0C1): <span id=\"reload_time\">5</span>\uCD08</p>\n\t\t\t\t</div>\n\t\t\t\t<script>\n\t\t\t\t\tlet reload_time = document.getElementById('reload_time');\n\n\t\t\t\t\tsetTimeout(() => {\n\t\t\t\t\t\treload_time.innerHTML = 4;\n\t\t\t\t\t\tsetTimeout(() => {\n\t\t\t\t\t\t\treload_time.innerHTML = 3;\n\t\t\t\t\t\t\tsetTimeout(() => {\n\t\t\t\t\t\t\t\treload_time.innerHTML = 2;\n\t\t\t\t\t\t\t\tsetTimeout(() => {\n\t\t\t\t\t\t\t\t\treload_time.innerHTML = 1;\n\t\t\t\t\t\t\t\t\tsetTimeout(() => {\n\t\t\t\t\t\t\t\t\t\treload_time.innerHTML = 0;\n\t\t\t\t\t\t\t\t\t\twindow.location = '/';\n\t\t\t\t\t\t\t\t\t}, 1000);\n\t\t\t\t\t\t\t\t}, 1000);\n\t\t\t\t\t\t\t}, 1000);\n\t\t\t\t\t\t}, 1000);\n\t\t\t\t\t}, 1000);\n\t\t\t\t</script>\n\t\t\t\t";
                      _context.next = 31;
                      break;
                    case 12:
                      _context.t0 = req.session.step;
                      _context.next = _context.t0 === 1 ? 15 : _context.t0 === 2 ? 17 : _context.t0 === 3 ? 24 : 31;
                      break;
                    case 15:
                      html += "\n                        <form action=\"/install?next\" method=\"post\">\n                            <div class=\"modal-header\">\n                                <h5 class=\"modal-title\">NodeHyperCMS \uC124\uCE58</h5>\n                            </div>\n                            <div class=\"modal-body\">\n                                <p>\uC0AC\uC774\uD2B8 \uC124\uC815</p>\n                                <div class=\"form-floating mb-3\">\n                                    <input type=\"text\" class=\"form-control\" id=\"site_title\" name=\"site_title\" placeholder=\"Title\" value=\"".concat(default_config.site.title, "\">\n                                    <label for=\"site_title\">Title</label>\n                                </div>\n                                <div class=\"form-floating mb-3\">\n                                    <textarea class=\"form-control\" id=\"site_description\" name=\"site_description\" placeholder=\"Description\" style=\"height: 100px\">").concat(default_config.site.description, "</textarea>\n                                    <label for=\"site_description\">Description</label>\n                                </div>\n                            </div>\n                            <div class=\"modal-footer\">\n                                <a role=\"button\" class=\"btn btn-secondary\" href=\"/install?previous\">\uC774\uC804</a>\n                                <input class=\"btn btn-primary\" type=\"submit\" value=\"\uB2E4\uC74C\">\n                            </div>\n                        </form>\n\t\t\t\t\t\t");
                      return _context.abrupt("break", 31);
                    case 17:
                      req.session.data = {};
                      post = req.body;
                      default_data = default_config.site;
                      req.session.data.site_title = post.site_title || default_data.title;
                      req.session.data.site_description = post.site_description || default_data.description;
                      html += "\n                        <form action=\"/install?next\" method=\"post\">\n                            <div class=\"modal-header\">\n                                <h5 class=\"modal-title\">NodeHyperCMS \uC124\uCE58</h5>\n                            </div>\n                            <div class=\"modal-body\">\n                                <p>\uAD00\uB9AC\uC790 \uC124\uC815</p>\n                                <div class=\"form-floating mb-3\">\n                                    <input type=\"text\" class=\"form-control\" id=\"admin_id\" name=\"admin_id\" placeholder=\"admin\" value=\"".concat(default_config.admin.id, "\">\n                                    <label for=\"admin_id\">Username</label>\n                                </div>\n                                <div class=\"form-floating\">\n                                    <input type=\"text\" class=\"form-control\" id=\"admin_password\" name=\"admin_password\" placeholder=\"test\" value=\"").concat(default_config.admin.password, "\">\n                                    <label for=\"admin_password\">Password</label>\n                                </div>\n                            </div>\n                            <div class=\"modal-footer\">\n                                <a role=\"button\" class=\"btn btn-secondary\" href=\"/install?previous\">\uC774\uC804</a>\n                                <input class=\"btn btn-primary\" type=\"submit\" value=\"\uB2E4\uC74C\">\n                            </div>\n                        </form>\n\t\t\t\t\t\t");
                      return _context.abrupt("break", 31);
                    case 24:
                      _post = req.body;
                      _default_data = default_config.admin;
                      req.session.data.admin_id = _post.admin_id || _default_data.id;
                      req.session.data.admin_password = _post.admin_password || _default_data.password;
                      _req$session$data = req.session.data, site_title = _req$session$data.site_title, site_description = _req$session$data.site_description, admin_id = _req$session$data.admin_id, admin_password = _req$session$data.admin_password;
                      html += "\n                        <div class=\"modal-header\">\n                            <h5 class=\"modal-title\">NodeHyperCMS \uC124\uCE58</h5>\n                        </div>\n\t\t\t\t\t\t<div class=\"modal-body\">\n\t\t\t\t\t\t\t<p>\uBAA8\uB4E0 \uC900\uBE44\uAC00 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4! \uC124\uC815\uC744 \uD655\uC778\uD558\uC2ED\uC2DC\uC624.</p>\n\t\t\t\t\t\t\t<table class=\"table\">\n\t\t\t\t\t\t\t\t<thead>\n\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t<th scope=\"col\">Name</th>\n\t\t\t\t\t\t\t\t\t\t<th scope=\"col\">Value</th>\n\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t</thead>\n\t\t\t\t\t\t\t\t<tbody>\n\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t<td>Site title</td>\n\t\t\t\t\t\t\t\t\t\t<td>".concat(site_title, "</td>\n\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t<td>Site description</td>\n\t\t\t\t\t\t\t\t\t\t<td>").concat(site_description, "</td>\n\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t<td>Admin id</td>\n\t\t\t\t\t\t\t\t\t\t<td>").concat(admin_id, "</td>\n\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t<td>Admin password</td>\n\t\t\t\t\t\t\t\t\t\t<td>").concat(admin_password, "</td>\n\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t</tbody>\n\t\t\t\t\t\t\t</table>\n\t\t\t\t\t\t</div>\n                        <div class=\"modal-footer\">\n                            <a role=\"button\" class=\"btn btn-secondary\" href=\"/install?previous\">\uC774\uC804</a>\n                            <a role=\"button\" class=\"btn btn-primary\" href=\"/install?next\">\uC124\uCE58</a>\n                        </div>\n\t\t\t\t\t\t");
                      return _context.abrupt("break", 31);
                    case 31:
                      html += "\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js\" integrity=\"sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm\" crossorigin=\"anonymous\"></script>\n\t\t\t\t</body>\n\t\t\t</html>\n\t\t\t";
                      res.status(200).send(html);
                      if (!(req.session.step === 4)) {
                        _context.next = 42;
                        break;
                      }
                      _req$session$data2 = req.session.data, _site_title = _req$session$data2.site_title, _site_description = _req$session$data2.site_description, _admin_id = _req$session$data2.admin_id, _admin_password = _req$session$data2.admin_password;
                      config = {
                        admin: {
                          id: _admin_id,
                          password: _admin_password
                        }
                      };
                      config.site = Object.assign(default_config.site, {
                        title: _site_title,
                        description: _site_description
                      });
                      _fs["default"].writeFileSync((0, _path.rootDir)('config.js'), "export default ".concat(JSON.stringify(config, null, '\t'), ";"));
                      _context.next = 40;
                      return setDatabase(config);
                    case 40:
                      server.close();
                      resolve();
                    case 42:
                    case "end":
                      return _context.stop();
                  }
                }, _callee);
              }));
              return function (_x4, _x5) {
                return _ref2.apply(this, arguments);
              };
            }());
            app.all('/', function (req, res) {
              res.redirect('/install');
            });
            server = _http["default"].createServer(app).listen(port, function () {
              console.log("\nConfig server start ".concat(_colorlog.colorlog.green('successfully!'), "\n"));
              console.log("".concat(_colorlog.colorlog.green('Ready'), " on port: ").concat(port, ".\n"));
              console.log("Local:            ".concat(_colorlog.colorlog.blue("http://localhost:".concat(port))));
              console.log("On Your Network:  ".concat(_colorlog.colorlog.blue("http://".concat(_ip["default"].address(), ":").concat(port))));
            });
          case 8:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function (_x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());
}
function start() {
  return _start.apply(this, arguments);
} // NodeHyperCMS
function _start() {
  _start = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
    var config;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          if (!((process.env.CONFIG || 'web') === 'web')) {
            _context4.next = 5;
            break;
          }
          _context4.next = 3;
          return startServer();
        case 3:
          _context4.next = 8;
          break;
        case 5:
          config = require((0, _path.rootDir)('config.js'))["default"];
          _context4.next = 8;
          return setDatabase(config);
        case 8:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _start.apply(this, arguments);
}