import { AxiosRequestConfig, AxiosResponse } from "axios";
export default class API {
    private userAgent;
    private requests;
    private cookies;
    private options;
    /**
     * @constructor
     * @param options Whether to use headless mode and/or skip chromium download
     */
    constructor(options?: Options);
    /**
     * @description First checks if there are any valid cookies for the URL requested. If not, it will request the URL and get the cookies using Puppeteer. If there are valid cookies, it will use those cookies to make the request.
     * @param url Request URL
     * @param options Axios config. Be careful of of using a custom User-Agent/Cookie header, as it will be overwritten.
     * @returns Promise<AxiosResponse>
     */
    request(url: string, options?: AxiosRequestConfig): Promise<AxiosResponse>;
    /**
     * @description Checks if there is a request object for the URL
     * @param url URL to check for
     * @returns Requests object if found, otherwise undefined
     */
    private getRequest;
    /**
     * @description Removes a request object from the requests array
     * @param url URL to remove from the requests array
     */
    private removeRequest;
    /**
     * @description Checks if the request is a Cloudflare JS challenge
     * @param content HTML content
     * @returns Boolean
     */
    private isCloudflareJSChallenge;
    test(): Promise<void>;
    /**
     * @description Gets the headers for the URL requested to bypass CloudFlare
     * @param url URL to fetch
     * @returns Promise<{ "User-Agent": string, "Cookie": string }>
     */
    getHeaders(url: string): Promise<{
        "User-Agent": string;
        "Cookie": string;
    }>;
    /**
     * @description Converts a Puppeteer cookie to a tough-cookie cookie
     * @param cookie Cookie object
     * @returns Cookie
     */
    private toToughCookie;
}
interface Options {
    headless?: boolean;
    skip_chromium_download?: boolean;
}
export {};