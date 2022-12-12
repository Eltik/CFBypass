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
var child_process_1 = require("child_process");
var path_1 = require("path");
var CloudScraper = /** @class */ (function () {
    // If you are using Python 3, set this to true
    function CloudScraper(isPython3) {
        this.isPython3 = isPython3;
    }
    // @param url: string options: Options = {}
    CloudScraper.prototype.get = function (url, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = __assign(__assign({}, options), { method: "GET" });
                        return [4 /*yield*/, this.request(url, options)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    // @param url: string options: Options = {}
    CloudScraper.prototype.post = function (url, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = __assign(__assign({}, options), { method: "POST" });
                        return [4 /*yield*/, this.request(url, options)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    // @param url: string options: Options = {}
    CloudScraper.prototype.cookie = function (url, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = __assign(__assign({}, options), { method: "COOKIE" });
                        return [4 /*yield*/, this.request(url, options)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    // @param url: string options: Options = {}
    CloudScraper.prototype.tokens = function (url, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = __assign(__assign({}, options), { method: "TOKENS" });
                        return [4 /*yield*/, this.request(url, options)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    CloudScraper.prototype.put = function (url, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("PUT is not supported yet! Development is in progress.");
            });
        });
    };
    CloudScraper.prototype["delete"] = function (url, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("DELETE is not supported! Development is in progress.");
            });
        });
    };
    CloudScraper.prototype.patch = function (url, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("PUT is not supported! Development is in progress.");
            });
        });
    };
    CloudScraper.prototype.head = function (url, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("PUT is not supported! Development is in progress.");
            });
        });
    };
    // @param url: string options: Options = {}
    CloudScraper.prototype.request = function (url, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var args = [(0, path_1.join)(__dirname, "index.py")];
                        args.push("--url", url);
                        if (options.method) {
                            args.push("--method", String(options.method));
                        }
                        if (options.headers) {
                            args.push("--headers", JSON.stringify(options.headers));
                        }
                        if (options.body) {
                            args.push("--data", JSON.stringify(options.body));
                        }
                        var result = [];
                        var childProcess = (0, child_process_1.spawn)(_this.isPython3 ? "python3" : "python", args);
                        childProcess.stdout.setEncoding("utf8");
                        childProcess.stdout.on("data", function (data) {
                            var _a;
                            // GitHub CoPilot moment
                            if (data.includes("statusCode")) {
                                var statusCode = data.split("{ statusCode")[1];
                                statusCode = statusCode.split("}")[0];
                                statusCode = statusCode.split(":")[1];
                                statusCode = statusCode.trim();
                                result.push({
                                    "status": Number(data)
                                });
                                result.push({
                                    "data": (_a = data.split("{ statusCode")[0]) === null || _a === void 0 ? void 0 : _a.trim()
                                });
                            }
                            else {
                                result.push({
                                    "data": data
                                });
                            }
                        });
                        childProcess.stderr.setEncoding('utf8');
                        childProcess.stderr.on("data", function (err) {
                            err = String(err).trim();
                            err = err.replaceAll("\n", " ");
                            result.push({
                                "error": String(err).trim()
                            });
                        });
                        childProcess.on('exit', function () {
                            var data = "";
                            var statusCode = 200;
                            var errors = [];
                            for (var i = 0; i < result.length; i++) {
                                if (result[i].error) {
                                    errors.push(result[i]);
                                }
                                else if (result[i].data) {
                                    data += result[i].data;
                                }
                                else if (result[i].status) {
                                    statusCode = result[i].status;
                                }
                            }
                            if (errors.length > 0) {
                                reject({
                                    status: 500,
                                    statusText: "ERROR",
                                    error: errors,
                                    text: function () { return data; },
                                    json: function () { return JSON.parse(data); }
                                });
                            }
                            else {
                                resolve({
                                    status: statusCode,
                                    statusText: "OK",
                                    error: errors,
                                    text: function () { return data; },
                                    json: function () { return JSON.parse(data); }
                                });
                            }
                        });
                    })];
            });
        });
    };
    // @param isPython3: boolean
    CloudScraper.prototype.setPython3 = function (isPython3) {
        this.isPython3 = isPython3;
    };
    // @param isPython3: boolean
    CloudScraper.prototype.install = function (isPython3) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                isPython3 = isPython3 !== null && isPython3 !== void 0 ? isPython3 : this.isPython3;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var args = [(0, path_1.join)(__dirname, "/cfscraper/setup.py")];
                        args.push("install");
                        var childProcess = (0, child_process_1.spawn)(_this.isPython3 ? "python3" : "python", args);
                        childProcess.stdout.setEncoding("utf8");
                        childProcess.stdout.on("data", function (data) {
                            console.log(data);
                        });
                        childProcess.stderr.setEncoding('utf8');
                        childProcess.stderr.on("data", function (err) {
                            reject(err);
                        });
                        childProcess.on('exit', function () {
                            resolve(true);
                        });
                    })];
            });
        });
    };
    return CloudScraper;
}());
exports["default"] = CloudScraper;
