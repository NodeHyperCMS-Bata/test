"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DBs = void 0;
exports.addMember = addMember;
exports.changeMemberData = changeMemberData;
exports.changeUserName = changeUserName;
exports.getFindTableDataByMemberNumber = getFindTableDataByMemberNumber;
exports.getMemberNumber = getMemberNumber;
exports.getMembers = getMembers;
exports.getSiteInfo = getSiteInfo;
exports.getSiteInfoAwait = getSiteInfoAwait;
exports.getUserInfo = getUserInfo;
exports.setMemberNumber = setMemberNumber;
exports.setSiteInfo = setSiteInfo;
exports.setSiteInfoAwait = setSiteInfoAwait;
exports.setUserInfo = setUserInfo;
exports.tables = void 0;
var _database = require("./database");
var _password = require("./password");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var DBs = {
  site: new _database.Database('site')
};
exports.DBs = DBs;
var tables = {
  members: DBs.site.table('members'),
  member_names: DBs.site.table('member_names'),
  member_number: DBs.site.table('member_number'),
  site: DBs.site.table('site'),
  owner: DBs.site.table('owner'),
  visit: DBs.site.table('visit')
};
exports.tables = tables;
function getMemberNumber(_x) {
  return _getMemberNumber.apply(this, arguments);
}
function _getMemberNumber() {
  _getMemberNumber = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(user) {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return tables.member_names.get();
        case 2:
          _context.t0 = user;
          return _context.abrupt("return", _context.sent[_context.t0]);
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _getMemberNumber.apply(this, arguments);
}
function getUserInfo(_x2) {
  return _getUserInfo.apply(this, arguments);
}
function _getUserInfo() {
  _getUserInfo = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(member_number) {
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return tables.members.get();
        case 2:
          _context2.t0 = member_number;
          return _context2.abrupt("return", _context2.sent[_context2.t0]);
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _getUserInfo.apply(this, arguments);
}
function setMemberNumber(_x3, _x4) {
  return _setMemberNumber.apply(this, arguments);
}
function _setMemberNumber() {
  _setMemberNumber = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(user, member_number) {
    var memberNames;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return tables.member_names.get();
        case 2:
          memberNames = _context3.sent;
          memberNames[user] = member_number;
          _context3.next = 6;
          return tables.member_names.set(memberNames);
        case 6:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _setMemberNumber.apply(this, arguments);
}
function setUserInfo(_x5, _x6) {
  return _setUserInfo.apply(this, arguments);
}
function _setUserInfo() {
  _setUserInfo = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(member_number, userInfo) {
    var userInfos;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return tables.members.get();
        case 2:
          userInfos = _context4.sent;
          userInfos[member_number] = userInfo;
          _context4.next = 6;
          return tables.members.set(userInfos);
        case 6:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _setUserInfo.apply(this, arguments);
}
function changeUserName(_x7, _x8) {
  return _changeUserName.apply(this, arguments);
}
function _changeUserName() {
  _changeUserName = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(oldusername, newusername) {
    var memberNames, member_number, userInfos;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return tables.member_names.get();
        case 2:
          memberNames = _context5.sent;
          member_number = memberNames[oldusername];
          delete memberNames[oldusername];
          memberNames[newusername] = member_number;
          _context5.next = 8;
          return tables.member_names.set(memberNames);
        case 8:
          _context5.next = 10;
          return tables.members.get();
        case 10:
          userInfos = _context5.sent;
          userInfos[member_number].username = newusername;
          _context5.next = 14;
          return tables.members.set(userInfos);
        case 14:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _changeUserName.apply(this, arguments);
}
function addMember(_x9, _x10, _x11, _x12) {
  return _addMember.apply(this, arguments);
}
function _addMember() {
  _addMember = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(username, password, level, isadmin) {
    var member_number, userInfo;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return tables.member_number.get();
        case 2:
          member_number = _context6.sent;
          if (isNaN(+member_number)) member_number = 0;
          _context6.next = 6;
          return tables.member_number.set(member_number + 1);
        case 6:
          _context6.t0 = Object;
          _context6.next = 9;
          return (0, _password.password_hash)(password);
        case 9:
          _context6.t1 = _context6.sent;
          _context6.t2 = {
            member_number: member_number,
            username: username,
            level: level,
            isadmin: isadmin,
            joinDate: new Date().getTime()
          };
          userInfo = _context6.t0.assign.call(_context6.t0, _context6.t1, _context6.t2);
          _context6.next = 14;
          return setUserInfo(member_number, userInfo);
        case 14:
          _context6.next = 16;
          return setMemberNumber(username, member_number);
        case 16:
          return _context6.abrupt("return", userInfo);
        case 17:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return _addMember.apply(this, arguments);
}
function changeMemberData(_x13, _x14) {
  return _changeMemberData.apply(this, arguments);
}
function _changeMemberData() {
  _changeMemberData = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(userInfo, _ref) {
    var _ref$password, password, _ref$level, level, _ref$isadmin, isadmin, newData;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _ref$password = _ref.password, password = _ref$password === void 0 ? null : _ref$password, _ref$level = _ref.level, level = _ref$level === void 0 ? null : _ref$level, _ref$isadmin = _ref.isadmin, isadmin = _ref$isadmin === void 0 ? null : _ref$isadmin;
          newData = {};
          if (!password) {
            _context7.next = 9;
            break;
          }
          _context7.t0 = Object;
          _context7.t1 = newData;
          _context7.next = 7;
          return (0, _password.password_hash)(password);
        case 7:
          _context7.t2 = _context7.sent;
          newData = _context7.t0.assign.call(_context7.t0, _context7.t1, _context7.t2);
        case 9:
          if (level) {
            newData = Object.assign(newData, {
              level: level
            });
          }
          if (isadmin) {
            newData = Object.assign(newData, {
              isadmin: isadmin
            });
          }
          return _context7.abrupt("return", Object.assign(userInfo, newData));
        case 12:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return _changeMemberData.apply(this, arguments);
}
function getMembers() {
  return _getMembers.apply(this, arguments);
}
function _getMembers() {
  _getMembers = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return tables.members.get();
        case 2:
          return _context8.abrupt("return", _context8.sent);
        case 3:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return _getMembers.apply(this, arguments);
}
function getFindTableDataByMemberNumber(_x15, _x16) {
  return _getFindTableDataByMemberNumber.apply(this, arguments);
}
function _getFindTableDataByMemberNumber() {
  _getFindTableDataByMemberNumber = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(member_number, table) {
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return table.get();
        case 2:
          _context9.t0 = member_number;
          return _context9.abrupt("return", _context9.sent[_context9.t0]);
        case 4:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return _getFindTableDataByMemberNumber.apply(this, arguments);
}
function getSiteInfo() {
  return _getSiteInfo.apply(this, arguments);
}
function _getSiteInfo() {
  _getSiteInfo = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return tables.site.get();
        case 2:
          return _context10.abrupt("return", _context10.sent);
        case 3:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  }));
  return _getSiteInfo.apply(this, arguments);
}
function setSiteInfo(_x17) {
  return _setSiteInfo.apply(this, arguments);
}
function _setSiteInfo() {
  _setSiteInfo = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(siteInfo) {
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.next = 2;
          return tables.site.set(siteInfo);
        case 2:
        case "end":
          return _context11.stop();
      }
    }, _callee11);
  }));
  return _setSiteInfo.apply(this, arguments);
}
function getSiteInfoAwait() {
  return tables.site.getSync();
}
function setSiteInfoAwait(siteInfo) {
  tables.site.setSync(siteInfo);
}