"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var index_1 = require("../request/index");
var PromiseRequest = /** @class */ (function () {
    function PromiseRequest(url, options) {
        this.url = url;
        this.options = options;
    }
    PromiseRequest.prototype.request = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (_this.options.stream) {
                            throw new Error("Stream is not supported yet! Development is in progress.");
                        }
                        else if (_this.options.allowRedirect) {
                            var redirectURL_1 = _this.url;
                            (0, index_1["default"])(_this.url, __assign(__assign({}, _this.options), { followRedirect: function (response) {
                                    redirectURL_1 = response.headers.location;
                                    return true;
                                } }), function (error, response, body) {
                                var errors = [];
                                if (error) {
                                    errors.push(error);
                                }
                                var request = {
                                    url: _this.url,
                                    options: _this.options
                                };
                                var res = {
                                    request: request,
                                    status: response.statusCode,
                                    statusText: response.statusMessage,
                                    url: redirectURL_1,
                                    error: [],
                                    headers: response.headers,
                                    raw: function () { return response; },
                                    text: function () { return body; },
                                    json: function () { return JSON.parse(body); }
                                };
                                resolve(res);
                            });
                        }
                        else {
                            (0, index_1["default"])(_this.url, _this.options, function (error, response, body) {
                                var errors = [];
                                if (error) {
                                    errors.push(error);
                                }
                                var request = {
                                    url: _this.url,
                                    options: _this.options
                                };
                                var res = {
                                    request: request,
                                    status: response.statusCode,
                                    statusText: response.statusMessage,
                                    url: response.url.length > 0 ? response.url : _this.url,
                                    error: [],
                                    headers: response.headers,
                                    raw: function () { return response; },
                                    text: function () { return body; },
                                    json: function () { return JSON.parse(body); }
                                };
                                resolve(res);
                            });
                        }
                    })];
            });
        });
    };
    return PromiseRequest;
}());
exports["default"] = PromiseRequest;
