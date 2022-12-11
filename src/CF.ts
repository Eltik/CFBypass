import { spawn } from "child_process";
import { join } from "path";

class CloudScraper {
    private isPython3:boolean;

    constructor(isPython3:boolean) {
        this.isPython3 = isPython3;
    }

    public async get(url: string, options: Options = {}): Promise<Response> {
        options = {
            ...options,
            method: "GET"
        };
        const response = await this.request(url, options);
        return response;
    }

    public async post(url: string, options: Options = {}): Promise<Response> {
        options = {
            ...options,
            method: "POST"
        };
        const response = await this.request(url, options);
        return response;
    }

    public async cookie(url: string, options: Options = {}): Promise<Response> {
        options = {
            ...options,
            method: "COOKIE"
        };
        const response = await this.request(url, options);
        return response;
    }

    public async tokens(url: string, options: Options = {}): Promise<Response> {
        options = {
            ...options,
            method: "TOKENS"
        };
        const response = await this.request(url, options);
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

    public async request(url: string, options: Options = {}): Promise<Response> {
        return new Promise((resolve, reject) => {
            const args:string[] = [join(__dirname, "index.py")];
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

            const result:any[] = [];

            const childProcess = spawn(this.isPython3 ? "python3" : "python", args);
            
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
                    })

                    result.push({
                        "data": data.split("{ statusCode")[0]?.trim()
                    })
                } else {
                    result.push({
                        "data": data
                    })
                }
            })
            
            childProcess.stderr.setEncoding('utf8');
            childProcess.stderr.on("data", (err) => {
                err = String(err).trim();
                err = err.replaceAll("\n", " ");
                result.push({
                    "error": String(err).trim()
                })
            })
            
            childProcess.on('exit', () => {
                let data = "";
                let statusCode = 200;

                const errors:any[] = [];
                for (let i = 0; i < result.length; i++) {
                    if (result[i].error) {
                        errors.push(result[i]);
                    } else if (result[i].data) {
                        data += result[i].data;
                    } else if (result[i].status) {
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
                    })
                } else {
                    resolve({
                        status: statusCode,
                        statusText: "OK",
                        error: errors,
                        text: () => data,
                        json: () => JSON.parse(data)
                    });
                }
            })
        })
    }
}

export default CloudScraper;

type Options = {
    method?: Method | string;
    headers?: { [key: string]: string };
    body?: string;
};

type Method = {
    "GET"?: string;
    "POST"?: string;
    "COOKIE"?: string;
    "TOKENS"?: string;
    
    // THE FOLLOWING ARE UNSUPPORTED
    "PUT"?: string;
    "DELETE"?: string;
    "PATCH"?: string;
    "HEAD"?: string;
};

interface Response {
    status: number;
    statusText: string;
    error: string[];
    text: ()=>string;
    json: ()=>string;
}