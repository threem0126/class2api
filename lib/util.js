"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getNonceStr = exports.makeToken = exports.delayRun = exports.getClientIp = undefined;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var getClientIp = exports.getClientIp = function getClientIp(req) {
    try {
        return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    } catch (err) {
        return "-not-get-ip";
    }
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
    })), ms);
};

var makeToken = exports.makeToken = function makeToken(id) {
    var key = "gankaouser888";
    return "user_id_" + id + "_" + MD5(id + key);
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