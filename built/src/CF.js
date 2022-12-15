"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const path_1 = require("path");
const js_base64_1 = require("js-base64");
class CloudScraper {
    // If you are using Python 3, set this to true
    constructor(isPython3) {
        this.isPython3 = isPython3 ?? false;
        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
        this.cookie = this.cookie.bind(this);
        this.tokens = this.tokens.bind(this);
        this.request = this.request.bind(this);
        this.install = this.install.bind(this);
    }
    // @param url: string options: Options = {}
    async get(url, options = {}) {
        options = {
            ...options,
            method: "GET"
        };
        const request = {
            url,
            options
        };
        const response = await this.request(request);
        return response;
    }
    // @param url: string options: Options = {}
    async post(url, options = {}) {
        options = {
            ...options,
            method: "POST"
        };
        const request = {
            url,
            options
        };
        const response = await this.request(request);
        return response;
    }
    // @param url: string options: Options = {}
    async cookie(url, options = {}) {
        options = {
            ...options,
            method: "COOKIE"
        };
        const request = {
            url,
            options
        };
        const response = await this.request(request);
        return response;
    }
    // @param url: string options: Options = {}
    async tokens(url, options = {}) {
        options = {
            ...options,
            method: "TOKENS"
        };
        const request = {
            url,
            options
        };
        const response = await this.request(request);
        return response;
    }
    async put(url, options = {}) {
        throw new Error("PUT is not supported yet! Development is in progress.");
    }
    async delete(url, options = {}) {
        throw new Error("DELETE is not supported! Development is in progress.");
    }
    async patch(url, options = {}) {
        throw new Error("PUT is not supported! Development is in progress.");
    }
    async head(url, options = {}) {
        throw new Error("PUT is not supported! Development is in progress.");
    }
    // @param url: string options: Options = {}
    async request(request) {
        const url = request.url;
        const options = request.options;
        return new Promise((resolve, reject) => {
            const args = [(0, path_1.join)(__dirname, "index.py")];
            args.push("--url", url);
            let stringedData = "";
            if (options.method) {
                args.push("--method", String(options.method));
            }
            if (options.headers) {
                args.push("--headers", JSON.stringify(options.headers));
            }
            if (options.body) {
                args.push("--data", JSON.stringify(options.body));
            }
            const errors = [];
            const childProcess = (0, child_process_1.spawn)(this.isPython3 ? "python3" : "python", args);
            childProcess.stdout.setEncoding("utf8");
            childProcess.stdout.on("data", (data) => {
                data = String(data);
                stringedData += data;
            });
            childProcess.stderr.setEncoding('utf8');
            childProcess.stderr.on("data", (err) => {
                err = String(err).trim();
                err = err.replaceAll("\n", " ");
                errors.push({
                    "error": String(err).trim()
                });
            });
            childProcess.on('exit', () => {
                let data = (0, js_base64_1.decode)(stringedData.substring(2).substring(0, stringedData.length - 1));
                let statusCode = 200;
                if (errors.length > 0) {
                    reject({
                        request,
                        status: 500,
                        statusText: "ERROR",
                        error: errors,
                        text: () => data,
                        json: () => JSON.parse(data)
                    });
                }
                else {
                    resolve({
                        request,
                        status: statusCode,
                        statusText: "OK",
                        error: errors,
                        text: () => data,
                        json: () => JSON.parse(data)
                    });
                }
            });
        });
    }
    // @param isPython3: boolean
    setPython3(isPython3) {
        this.isPython3 = isPython3;
    }
    // @param isPython3: boolean
    async install() {
        return new Promise((resolve, reject) => {
            const args = [(0, path_1.join)(__dirname, "/cfscraper/setup.py")];
            args.push("install");
            const childProcess = (0, child_process_1.spawn)(this.isPython3 ? "python3" : "python", args);
            childProcess.stdout.setEncoding("utf8");
            childProcess.stdout.on("data", (data) => {
                console.log(data);
            });
            childProcess.stderr.setEncoding('utf8');
            childProcess.stderr.on("data", (err) => {
                reject(err);
            });
            childProcess.on('exit', () => {
                resolve(true);
            });
        });
    }
}
;
;
exports.default = CloudScraper;
//# sourceMappingURL=CF.js.map