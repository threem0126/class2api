"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hashcode = exports.delayRun = exports.crash = exports.sleep = exports.checkPhoneFormat = exports.getNonceStr = exports.getClientIp = undefined;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _promise2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _promise2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var getClientIp = exports.getClientIp = function getClientIp(req) {
    try {
        return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    } catch (err) {
        return "-not-get-ip";
    }
};

var getNonceStr = exports.getNonceStr = function getNonceStr() {
    var len = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;

    var seed = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var str = "";
    while (len--) {
        str += seed.split("")[Math.floor(Math.random() * seed.length)];
    }
    return str;
};

/**
 * 验证
 * @param phone
 * @returns {boolean}
 */
var checkPhoneFormat = exports.checkPhoneFormat = function checkPhoneFormat(phone) {
    return (/^1[34578]\d{9}$/.test(phone)
    );
};

var sleep = exports.sleep = function sleep(ms) {
    return new _promise2.default(function (resolve, reject) {
        setTimeout(function (_) {
            return resolve(ms);
        }, ms);
    });
};

var crash = exports.crash = function crash(title) {
    setTimeout(function () {
        throw title || '主动crash';
    }, 20);
};

var delayRun = exports.delayRun = function delayRun(fun, ms, errerhandle) {
    setTimeout(_asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return fun();

                    case 3:
                        _context.next = 8;
                        break;

                    case 5:
                        _context.prev = 5;
                        _context.t0 = _context["catch"](0);

                        if (errerhandle) errerhandle(_context.t0);else {
                            console.error("error in delayRun:");
                            console.error(_context.t0);
                        }

                    case 8:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[0, 5]]);
    })), ms || 0);
};

var hashcode = exports.hashcode = function hashcode(str) {
    var hash = 0,
        i,
        chr,
        len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};