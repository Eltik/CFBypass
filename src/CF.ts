import { spawn } from "child_process";
import { join } from "path";
import { decode } from "js-base64";
import { load } from "cheerio";

class CloudScraper {
    private url:string;
    private options:Options;
    private isPython3:boolean;

    // If you are using Python 3, set this to true
    constructor(isPython3?:boolean) {
        this.isPython3 = isPython3 ?? false;
        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
        this.cookie = this.cookie.bind(this);
        this.tokens = this.tokens.bind(this);
        this.request = this.request.bind(this);
        this.install = this.install.bind(this);
        this.setPython3 = this.setPython3.bind(this);
        this.solveCaptcha3 = this.solveCaptcha3.bind(this);
        this.solveCaptcha3FromHTML = this.solveCaptcha3FromHTML.bind(this);
    }

    // @param url: string options: Options = {}
    public async get(url: string, options: Options = {}): Promise<Response> {
        options = {
            ...options,
            method: "GET"
        };
        
        const request:Request = {
            url,
            options
        };
        const response = await this.request(request);
        return response;
    }

    // @param url: string options: Options = {}
    public async post(url: string, options: Options = {}): Promise<Response> {
        options = {
            ...options,
            method: "POST"
        };

        const request:Request = {
            url,
            options
        };
        const response = await this.request(request);
        return response;
    }

    // @param url: string options: Options = {}
    public async cookie(url: string, options: Options = {}): Promise<Response> {
        options = {
            ...options,
            method: "COOKIE"
        };
        
        const request:Request = {
            url,
            options
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

    public async put(url: string, options: Options = {}): Promise<Response> {
        throw new Error("PUT is not supported yet! Development is in progress.");
    }

    public async delete(url: string, options: Options = {}): Promise<Response> {
        throw new Error("DELETE is not supported! Development is in progress.");
    }
    
    public async patch(url: string, options: Options = {}): Promise<Response> {
        throw new Error("PUT is not supported! Development is in progress.");
    }

    public async head(url: string, options: Options = {}): Promise<Response> {
        throw new Error("PUT is not supported! Development is in progress.");
    }

    // @param url: string options: Options = {}
    public async request(request:Request): Promise<Response> {
        const url = request.url;
        const options = request.options;

        return new Promise((resolve, reject) => {
            const args:string[] = [join(__dirname, "index.py")];
            args.push("--url", url);

            let stringedData = "";
            let requestData:any = "";

            if (options.method) {
                args.push("--method", String(options.method));
            }
            if (options.headers) {
                args.push("--headers", JSON.stringify(options.headers));
            }
            if (options.body) {
                args.push("--data", JSON.stringify(options.body));
            }
            args.push("--allow-redirect", options.allowRedirect ? "True" : "False");

            const errors:any[] = [];

            const childProcess = spawn(this.isPython3 ? "python3" : "python", args);
            
            childProcess.stdout.setEncoding("utf8");
            
            childProcess.stdout.on("data", (data) => {
                if (data.includes("~~~~~~~REQUEST_DATA~~~~~~~")) {
                    requestData = String(data).split("~~~~~~~REQUEST_DATA~~~~~~~")[1].split("b'")[1].split("'")[0];

                    data = String(data).split("~~~~~~~REQUEST_DATA~~~~~~~")[0];
                }
                data = String(data);
                stringedData += data;
            })
            
            childProcess.stderr.setEncoding('utf8');
            childProcess.stderr.on("data", (err) => {
                err = String(err).trim();
                err = err.replaceAll("\n", " ");
                errors.push({
                    "error": String(err).trim()
                })
            })
            
            childProcess.on('exit', () => {
                let data = decode(stringedData.substring(2).substring(0, stringedData.length - 1));

                try {
                    requestData = JSON.parse(decode(requestData));
                } catch {
                    errors.push({
                        "error": "Could not parse request data of " + requestData
                    })
                }

                if (errors.length > 1) {
                    reject({
                        request,
                        status: requestData.status_code,
                        statusText: "ERROR",
                        error: errors,
                        url: requestData.url,
                        text: () => data,
                        json: () => JSON.parse(data)
                    })
                } else {
                    resolve({
                        request,
                        status: requestData.status_code,
                        statusText: "OK",
                        url: requestData.url,
                        error: errors,
                        headers: requestData.headers,
                        raw: () => stringedData,
                        text: () => data,
                        json: () => JSON.parse(data)
                    });
                }
            })
        })
    }

    // @param token: string
    public async solveCaptcha3(url: string, key: string, anchorLink: string): Promise<string> {
        const uri = new URL(url);
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

    public async solveCaptcha3FromHTML(url: string, html: string, anchorLink: string) {
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

        let captchaURI = new URL(captcha);
        const captchaId = captchaURI.searchParams.get("render");
        const captchaKey = await this.solveCaptcha3(url, captchaId, anchorLink);
        return captchaKey;
    }

    // @param isPython3: boolean
    public setPython3(isPython3:boolean) {
        this.isPython3 = isPython3;
    }

    // @param isPython3: boolean
    public async install() {
        return new Promise((resolve, reject) => {
            const args:string[] = [join(__dirname, "/cfscraper/setup.py")];
            args.push("install");

            const requestArgs:string[] = [join(__dirname, "/req/setup.py")];
            requestArgs.push("install");
            
            const childProcess = spawn(this.isPython3 ? "python3" : "python", requestArgs);
            
            childProcess.stdout.setEncoding("utf8");
            childProcess.stdout.on("data", (data) => {
                console.log(data);
            })
            
            childProcess.stderr.setEncoding('utf8');
            childProcess.stderr.on("data", (err) => {
                reject(err);
            })
            
            childProcess.on('exit', () => {
                const childProcess = spawn(this.isPython3 ? "python3" : "python", args);
            
                childProcess.stdout.setEncoding("utf8");
                childProcess.stdout.on("data", (data) => {
                    console.log(data);
                })
                
                childProcess.stderr.setEncoding('utf8');
                childProcess.stderr.on("data", (err) => {
                    reject(err);
                })
                
                childProcess.on('exit', () => {  
                    resolve(true);
                })
            })
        })
    }
}

type Options = {
    method?: Method["GET"] | Method["POST"] | Method["COOKIE"] | Method["TOKENS"];
    headers?: { [key: string]: string };
    body?: string;
    allowRedirect?: boolean;
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