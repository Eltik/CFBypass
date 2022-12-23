import { load } from "cheerio";
import PromiseRequest from "./promise-request/promise-request";
import { decode } from "js-base64";

class CloudScraper {
    private url:string;
    private options:Options;

    // If you are using Python 3, set this to true
    constructor(url?:string, options?:Options) {
        this.url = url ? url : "";
        this.options = options ? options : {};
        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
        this.cookie = this.cookie.bind(this);
        this.tokens = this.tokens.bind(this);
        this.request = this.request.bind(this);
        this.solveCaptcha3 = this.solveCaptcha3.bind(this);
        this.solveCaptcha3FromHTML = this.solveCaptcha3FromHTML.bind(this);
    }

    // @param url: string options: Options = {}
    public async get(url?: string, options?: Options): Promise<Response> {
        if (url) {
            this.url = url;
        }
        if (options) {
            this.options = options;
        }
        this.options = {
            ...this.options,
            method: "GET"
        };
        
        const request:Request = {
            url: this.url,
            options: this.options
        };
        const response = await this.request(request);
        return response;
    }

    // @param url: string options: Options = {}
    public async post(url?: string, options?: Options): Promise<Response> {
        if (url) {
            this.url = url;
        }
        if (options) {
            this.options = options;
        }
        this.options = {
            ...this.options,
            method: "GET"
        };
        
        const request:Request = {
            url: this.url,
            options: this.options
        };
        const response = await this.request(request);
        return response;
    }

    // @param url: string options: Options = {}
    public async cookie(url?: string, options?: Options): Promise<Response> {
        if (url) {
            this.url = url;
        }
        if (options) {
            this.options = options;
        }
        this.options = {
            ...this.options,
            method: "GET"
        };
        
        const request:Request = {
            url: this.url,
            options: this.options
        };
        const response = await this.request(request);
        return response;
    }

    // @param url: string options: Options = {}
    public async tokens(url: string, options: Options = {}): Promise<Response> {
        options = {
            ...options,
            method: "TOKENS"
        };

        const request:Request = {
            url,
            options
        };
        const response = await this.request(request);
        return response;
    }

    public async put(url?: string, options?: Options): Promise<Response> {
        throw new Error("PUT is not supported yet! Development is in progress.");
    }

    public async delete(url?: string, options?: Options): Promise<Response> {
        throw new Error("DELETE is not supported! Development is in progress.");
    }
    
    public async patch(url?: string, options?: Options): Promise<Response> {
        throw new Error("PUT is not supported! Development is in progress.");
    }

    public async head(url?: string, options?: Options): Promise<Response> {
        throw new Error("PUT is not supported! Development is in progress.");
    }

    // @param url: string options: Options = {}
    public async request(request:Request): Promise<Response> {
        const url = request.url;
        const options = request.options;
        if (!request.options.method) {
            options.method = "GET";
        }

        return new Promise(async(resolve, reject) => {
            const req = new PromiseRequest(url, options);
            const init = await req.request();
            const html = init.text();
            const $ = load(html);
            const challengeForm = $("form#challenge-form").attr("action");

            /*
            let cfOptions = html.includes("window._cf_chl_opt={") ? html.split("window._cf_chl_opt={")[1].split("};")[0] : html.split(" = {")[1].split("};")[0];
            cfOptions = cfOptions.replace(/'/g, '"');
            console.log(cfOptions);
            let data = {
                ...JSON.parse(cfOptions),
            }
            //console.log(data);
            */

            const isIUAMChallenge = /\/cdn-cgi\/images\/trace\/jsch\//g;
            const isIUAMChallengeForm = /<form .*?="challenge-form" action="\/\S+__cf_chl_f_tk=/g;
            const isNewIUAMChallenge = /cpo.src\s*=\s*['"]\/cdn-cgi\/challenge-platform\/\S+orchestrate\/jsch\/v1/g;
            const isNewIUAMChallengeCaptcha = /cpo.src\s*=\s*['"]\/cdn-cgi\/challenge-platform\/\S+\/orchestrate\/captcha\/v1\?ray=/g;

            if ((isIUAMChallenge.test(html) || isIUAMChallengeForm.test(html)) && (isNewIUAMChallenge.test(html) || isNewIUAMChallengeCaptcha.test(html))) {
                const referer = new URL(init.url).protocol + '//' + new URL(init.url).host + challengeForm;
                
                const postRequest = new PromiseRequest(referer, {
                    body: JSON.stringify({
                        md: $("input[name='md']").val(),
                        r: $("input[name='r']").val(),
                    }),
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Referer": url
                    },
                });

                const postResponse = await postRequest.request();
                resolve(postResponse);

                /*
                const challengeRegex = html.match(/cpo.src\s*=\s*['"]\/cdn-cgi\/challenge-platform\/\S+\/orchestrate\/captcha\/v1\?ray=(?<form>\S+)/g);
                const challengeReq = challengeRegex[0].split("'")[1].split("';")[0];
                const challengeUrl = new URL(challengeReq, init.url).href;
                const req2 = new PromiseRequest(challengeUrl, {
                    headers: {
                        Referer: referer
                    }
                });
                const challenge = await req2.request();
                const cfBm = challenge.headers["set-cookie"][0].split(";")[0].split("=")[1];
                const cfRay = challenge.headers["cf-ray"];

                this.options.headers = {
                    ...this.options.headers,
                    "cookie": `__cf_bm=${cfBm}; __cfruid=${cfRay}`
                };

                const cookieRequest = new PromiseRequest(url, this.options);
                const req3 = await cookieRequest.request();

                resolve(req3);
                */
            } else {
                resolve(init);
            }
        })
    }

    // @param token: string
    public async solveCaptcha3(key: string, anchorLink: string, url?: string): Promise<string> {
        if (url) {
            this.url = url;
        }
        const uri = new URL(this.url);
        const domain = uri.protocol + '//' + uri.host;

        const keyReq = await this.get(`https://www.google.com/recaptcha/api.js?render=${key}`, {
            headers: {
                Referer: domain,
            },
        });

        const data = keyReq.text();

        const v = data.substring(data.indexOf('/releases/'), data.lastIndexOf('/recaptcha')).split('/releases/')[1];

        // ANCHOR IS SPECIFIC TO SITE
        const curK = anchorLink.split('k=')[1].split('&')[0];
        const curV = anchorLink.split("v=")[1].split("&")[0];

        const anchor = anchorLink.replace(curK, key).replace(curV, v);

        const req = await this.get(anchor);
        const $ = load(req.text());
        const reCaptchaToken = $('input[id="recaptcha-token"]').attr('value')

        if (!reCaptchaToken) throw new Error('reCaptcha token not found')

        return reCaptchaToken;
    }

    public async solveCaptcha3FromHTML(html: string, anchorLink: string, url?: string) {
        if (url) {
            this.url = url;
        }
        const $ = load(html);

        let captcha = null;
        $("script").map((index, element) => {
            if ($(element).attr("src") != undefined && $(element).attr("src").includes("/recaptcha/")) {
                captcha = $(element).attr("src");
            }
        })

        if (!captcha) {
            throw new Error("Couldn't fetch captcha.");
        }

        const captchaURI = new URL(captcha);
        const captchaId = captchaURI.searchParams.get("render");
        const captchaKey = await this.solveCaptcha3(captchaId, anchorLink, this.url);
        return captchaKey;
    }

    public async solveHCaptcha() {
        throw new Error("HCaptcha is not supported! Development is in progress.");
    }
}

type Options = {
    method?: Method["GET"] | Method["POST"] | Method["COOKIE"] | Method["TOKENS"];
    headers?: { [key: string]: string };
    body?: string;
    allowRedirect?: boolean;
    stream?: boolean;
};

type Method = {
    "GET": string;
    "POST": string;
    "COOKIE": string;
    "TOKENS": string;
    
    // THE FOLLOWING ARE UNSUPPORTED TEMPORARILY
    "PUT": string;
    "DELETE": string;
    "PATCH": string;
    "HEAD": string;
};

interface Response {
    request: Request;
    status: number;
    statusText: string;
    url: string;
    error: string[];
    headers: { [key: string]: string };
    raw: ()=>string;
    text: ()=>string;
    json: ()=>string;
};

interface Request {
    url: string;
    options: Options;
};

export default CloudScraper;
export type { Options, Method, Response, Request };