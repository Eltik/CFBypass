"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const path_1 = require("path");
class CloudScraper {
    constructor(isPython3) {
        this.isPython3 = isPython3;
    }
    async get(url, options = {}) {
        options = {
            ...options,
            method: "GET"
        };
        const response = await this.request(url, options);
        return response;
    }
    async post(url, options = {}) {
        options = {
            ...options,
            method: "POST"
        };
        const response = await this.request(url, options);
        return response;
    }
    async cookie(url, options = {}) {
        options = {
            ...options,
            method: "COOKIE"
        };
        const response = await this.request(url, options);
        return response;
    }
    async tokens(url, options = {}) {
        options = {
            ...options,
            method: "TOKENS"
        };
        const response = await this.request(url, options);
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
    async request(url, options = {}) {
        return new Promise((resolve, reject) => {
            const args = [(0, path_1.join)(__dirname, "index.py")];
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
            const result = [];
            const childProcess = (0, child_process_1.spawn)(this.isPython3 ? "python3" : "python", args);
            childProcess.stdout.setEncoding("utf8");
            childProcess.stdout.on("data", (data) => {
                // GitHub CoPilot moment
                if (data.includes("statusCode")) {
                    let statusCode = data.split("{ statusCode")[1];
                    statusCode = statusCode.split("}")[0];
                    statusCode = statusCode.split(":")[1];
                    statusCode = statusCode.trim();
                    result.push({
                        "status": Number(data)
                    });
                    result.push({
                        "data": data.split("{ statusCode")[0]?.trim()
                    });
                }
                else {
                    result.push({
                        "data": data
                    });
                }
            });
            childProcess.stderr.setEncoding('utf8');
            childProcess.stderr.on("data", (err) => {
                err = String(err).trim();
                err = err.replaceAll("\n", " ");
                result.push({
                    "error": String(err).trim()
                });
            });
            childProcess.on('exit', () => {
                let data = "";
                let statusCode = 200;
                const errors = [];
                for (let i = 0; i < result.length; i++) {
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
                        text: () => data,
                        json: () => JSON.parse(data)
                    });
                }
                else {
                    resolve({
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
}
exports.default = CloudScraper;
//# sourceMappingURL=CF.js.map