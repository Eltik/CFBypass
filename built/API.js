"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tough_cookie_1 = require("tough-cookie");
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
class API {
    /**
     * @constructor
     * @param options Whether to use headless mode and/or skip chromium download
     */
    constructor(options = { headless: true, skip_chromium_download: false }) {
        // Default user agent
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36';
        this.requests = [];
        this.cookies = new tough_cookie_1.CookieJar();
        this.options = options;
    }
    /**
     * @description First checks if there are any valid cookies for the URL requested. If not, it will request the URL and get the cookies using Puppeteer. If there are valid cookies, it will use those cookies to make the request.
     * @param url Request URL
     * @param options Axios config. Be careful of of using a custom User-Agent/Cookie header, as it will be overwritten.
     * @returns Promise<AxiosResponse>
     */
    async request(url, options = { headers: {} }) {
        // First check if the request is stored in the object
        const possible = this.getRequest(url);
        if (!possible) {
            const check = await (0, axios_1.default)(url, options).catch((err) => {
                // If the request fails, check if it's due to a CloudFlare challenge
                if (this.isCloudflareJSChallenge(err.response.data)) {
                    // If it is, this means that we need to fetch new headers.
                    return null;
                }
            });
            if (!check) {
                // Fetch headers needed to bypass CloudFlare.
                const headers = await this.getHeaders(url);
                this.requests.push({
                    url: url,
                    options: options,
                    cookies: headers.Cookie,
                    userAgent: headers['User-Agent']
                });
                options.headers["User-Agent"] = headers['User-Agent'];
                options.headers["Cookie"] = headers['Cookie'];
                // Send a request with the headers
                const response = await (0, axios_1.default)(url, options);
                return response;
            }
            else {
                // No need to fetch headers, just return the response
                return check;
            }
        }
        else {
            // Set the headers/cookies to the stored request
            options.headers["User-Agent"] = possible.userAgent;
            options.headers["Cookie"] = possible.cookies;
            // Try to send the request
            const response = await (0, axios_1.default)(url, options).catch((err) => {
                const body = err.response.data;
                // Check if the error is due to a CloudFlare challenge
                if (this.isCloudflareJSChallenge(body)) {
                    // If it is, remove the request (it's invalid)
                    this.removeRequest(url);
                    // Try to send the request again with new headers
                    return this.request(url, options);
                }
            });
            return response;
        }
    }
    /**
     * @description Checks if there is a request object for the URL
     * @param url URL to check for
     * @returns Requests object if found, otherwise undefined
     */
    getRequest(url) {
        const request = this.requests.find((request) => request.url == url);
        if (request) {
            return request;
        }
    }
    /**
     * @description Removes a request object from the requests array
     * @param url URL to remove from the requests array
     */
    removeRequest(url) {
        const index = this.requests.findIndex((request) => request.url == url);
        if (index > -1) {
            this.requests.splice(index, 1);
        }
    }
    /**
     * @description Checks if the request is a Cloudflare JS challenge
     * @param content HTML content
     * @returns Boolean
     */
    isCloudflareJSChallenge(content) {
        return content.includes('_cf_chl_opt');
    }
    async test() {
        //const { data } = await axios.get("https://justlightnovels.com");
        var atob = function (str) { return Buffer.from(str, "base64").toString("binary"); };
        var challenge = atob("%s");
        var context = { atob: atob };
        var options = { filename: "iuam-challenge.js", timeout: 4000 };
        var answer = require("vm").runInNewContext(challenge, context, options);
        console.log(answer);
    }
    /**
     * @description Gets the headers for the URL requested to bypass CloudFlare
     * @param url URL to fetch
     * @returns Promise<{ "User-Agent": string, "Cookie": string }>
     */
    async getHeaders(url) {
        return new Promise((resolve, reject) => {
            axios_1.default.get(url, {
                headers: {
                    "User-Agent": this.userAgent
                }
            }).then((data) => {
                resolve({ "User-Agent": this.userAgent, "Cookie": "" });
            }).catch(async (err) => {
                if (this.isCloudflareJSChallenge(err.response.data)) {
                    const $ = (0, cheerio_1.load)(err.response.data);
                    const challenge = $("form#challenge-form");
                    const uri = new URL(url);
                    const parsedURL = uri.protocol + "//" + uri.hostname;
                    const formURL = parsedURL + $(challenge).attr("action");
                    const formValue = $(challenge).find("input").attr("value");
                    const script = err.response.data.split(`cpo.src = '`)[1].split("';")[0];
                    const scriptReq = await axios_1.default.get(parsedURL + script, {
                        headers: {
                            "User-Agent": this.userAgent,
                            Referer: formURL
                        }
                    });
                    const ru = "aHR0cHM6Ly93d3cuanVzdGxpZ2h0bm92ZWxzLmNvbS8=";
                    const ra = 'TW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzgzLjAuNDEwMy4xMTYgU2FmYXJpLzUzNy4zNg==';
                    const rm = 'UE9TVA==';
                    const d = 'PHGybfI3s6b+bc+dgGP4HS/eegJECCLPcZgjiaf3K//udShbsAv3z9FuzCqlq/s1h0PchFLxD78gByDABTcWQDIfaIhvxCTEQCl8LuvpMGY47T6hc9uFfed9uBoIefNxcYUT1NUINA+86J7A7SLwM6NsYBEwWoSM0XzV3MnvXXWCyLDckZEHsGI0ERJ1WGZtzgpAJfDbjvXNPXj1HnY/SY0EkIA9r/0Ap3XLfbmSOcy663prKa3kdAU6Ij+gt/t7h73ygrCT2Z3YKlVHUTejhyZw9OFS4D8h18EMITOIq6EY+FNQPla2D940jU0p3gVOuISfZiJWbfOh7C5Tjf2YNFBtjPOHrPzRjSp0WSsrYr/Ux5hfsC3weecSefye2887lvmfULO1W6R9fHbp/i9+VE0TWdnG1iIvjPbLoeaWh3M55PKSVpeLPxUD6KrHZtminGTKsfj/QtcutSSGi7MJyg+ny4z1wFgEhkY4ux7WC2WONhMa0nwcqSPwz9nsHycn9Q2EXUvnI1w31GBrxoYAoj04+NpjoxFyB5RT7R8qnNUbtlUEUwZ62Mq79APdx0/f/XFSaMIE67lQonTtrfBi1LToHITRTPR+CL3DAH5b+bQxZnBrke9I+RL6eRZ2KassP7Ok4QOrHlCrYzBiJHIEE/voIVIdEOTBzEwmPivJNLTqf8STyfi+kVBhWqwJmiFU';
                    const t = 'MTY3Njc0MzYzNS4wNDkwMDA=';
                    const m = 'kjISD+GE9YCwhgkRAVz3LGZFMJ1qdTFOEQScOAo9H4U=';
                    const i1 = 'ZBED5GrcnqCLbe4TVoUBqw==';
                    const i2 = 'muOg24Wy4YJm7KfTMFW5wQ==';
                    const zh = 'cU+953k9wIps7PM83WqhXO645Koj74EWhNjL8LJqQvQ=';
                    const uh = 'kA9WJCQFxbXTbUPP6vkXkh5SZIEqKyKkfPwS91UaLL0=';
                    const hh = 'phF2gzp2urCGmCGwSgDU1P9ubZCUxeFOEIsUYhH0dwo=';
                    console.log("ru: " + atob(ru));
                    console.log("ra: " + atob(ra));
                    console.log("rm: " + atob(rm));
                    console.log("d: " + atob(d));
                    console.log("t: " + atob(t));
                    console.log("m: " + atob(m));
                    console.log("i1: " + atob(i1));
                    console.log("i2: " + atob(i2));
                    console.log("zh: " + atob(zh));
                    console.log("uh: " + atob(uh));
                    console.log("hh: " + atob(hh));
                    const formRequest = await axios_1.default.post(formURL, `md=${formValue}`, {
                        headers: {
                            "User-Agent": this.userAgent,
                            "X-Requested-With": "XMLHttpRequest",
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Accept": "application/x-www-form-urlencoded"
                        }
                    }).catch((err) => {
                        //console.error(err.response.data);
                    });
                    resolve(null);
                }
                else {
                    reject(err);
                }
            });
        });
    }
    /**
     * @description Converts a Puppeteer cookie to a tough-cookie cookie
     * @param cookie Cookie object
     * @returns Cookie
     */
    toToughCookie(cookie) {
        const { name, value, expires, domain, path } = cookie;
        const isExpiresValid = expires && typeof expires === 'number';
        const expiresDate = isExpiresValid ? new Date(expires * 1000) : new Date(Date.now() + 9999 * 1000);
        return new tough_cookie_1.Cookie({
            key: name,
            value,
            expires: expiresDate,
            domain: domain.startsWith('.') ? domain.substring(1) : domain,
            path
        });
    }
}
exports.default = API;
//# sourceMappingURL=API.js.map