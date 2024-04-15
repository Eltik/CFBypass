declare class CloudScraper {
    private isPython3;
    constructor(isPython3?: boolean);
    get(url: string, options?: Options): Promise<Response>;
    post(url: string, options?: Options): Promise<Response>;
    cookie(url: string, options?: Options): Promise<Response>;
    tokens(url: string, options?: Options): Promise<Response>;
    put(url: string, options?: Options): Promise<Response>;
    delete(url: string, options?: Options): Promise<Response>;
    patch(url: string, options?: Options): Promise<Response>;
    head(url: string, options?: Options): Promise<Response>;
    request(request: Request): Promise<Response>;
    solveCaptcha3(url: string, key: string, anchorLink: string): Promise<string>;
    solveCaptcha3FromHTML(url: string, html: string, anchorLink: string): Promise<string>;
    setPython3(isPython3: boolean): void;
    install(): Promise<unknown>;
}
type Options = {
    method?: Method["GET"] | Method["POST"] | Method["COOKIE"] | Method["TOKENS"];
    headers?: {
        [key: string]: string;
    };
    body?: string;
    redirect?: boolean;
};
type Method = {
    "GET": string;
    "POST": string;
    "COOKIE": string;
    "TOKENS": string;
    "PUT": string;
    "DELETE": string;
    "PATCH": string;
    "HEAD": string;
};
interface Response {
    status: number;
    statusText: string;
    headers: string | Record<string, string>;
    error: string[];
    text: () => string;
    json: () => string;
}
interface Request {
    url: string;
    options: Options;
}
export default CloudScraper;
export type { Options, Method, Response, Request };
