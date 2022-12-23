import request from "../request/index";
import { Options, Request, Response } from "../CF";

export default class PromiseRequest {
    private url: string;
    private options: Options;

    constructor(url:string, options:Options) {
        this.url = url;
        this.options = options;
    }

    public async request(): Promise<Response> {
        return new Promise((resolve, reject) => {
            if (this.options.stream) {
                throw new Error("Stream is not supported yet! Development is in progress.");
            } else if (this.options.allowRedirect) {
                let redirectURL = this.url;
                request(this.url, {
                    ...this.options,
                    followRedirect: function(response) {
                        redirectURL = response.headers.location;
                        return true;
                    }
                }, (error, response, body) => {
                    const errors = [];
                    if (error) {
                        errors.push(error);
                    }
                    const request:Request = {
                        url: this.url,
                        options: this.options
                    };
    
                    const res:Response = {
                        request,
                        status: response.statusCode,
                        statusText: response.statusMessage,
                        url: redirectURL,
                        error: [],
                        headers: response.headers,
                        raw: () => response,
                        text: () => body,
                        json: () => JSON.parse(body)
                    };
    
                    resolve(res);
                });
            } else {
                request(this.url, this.options, (error, response, body) => {
                    const errors = [];
                    if (error) {
                        errors.push(error);
                    }
                    const request:Request = {
                        url: this.url,
                        options: this.options
                    };
    
                    const res:Response = {
                        request,
                        status: response.statusCode,
                        statusText: response.statusMessage,
                        url: response.url.length > 0 ? response.url : this.url,
                        error: [],
                        headers: response.headers,
                        raw: () => response,
                        text: () => body,
                        json: () => JSON.parse(body)
                    };
                    resolve(res);
                });
            }
        });
    }
}