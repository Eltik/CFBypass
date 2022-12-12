# CFBypass
Python based CloudFlare bypass. Utilizes [VeNoMouS's CloudScraper](https://github.com/VeNoMouS/cloudscraper) project to bypass CloudFlare. All credit goes to him.

## Installation
THIS NEEDS TO BE UPDATED<br />
<b>Prerequisites</b>: Python (version 3.10 or higher), NodeJS (comes with NPM), TypeScript (only if you're cloning the repository).<br /><br />
1. Run `pip install cloudscraper` or clone VeNoMouS's [repository](https://github.com/VeNoMouS/cloudscraper). All this project does is "port" his Python code and make it JavaScript friendly.
2. Run `npm i cfbypass` or clone the GitHub repository using `git clone https://github.com/Eltik/CFBypass`.

## How it Works
All I've done is create a script that uses `child_process` to send `GET` and `POST` requests via the Python library `cloudscraper`. An `index.py` script that uses the library is included and takes the following arguments:<br />
`--url`\*: The URL to send a request to.<br />
`--method`\*: The method to use. For example, `GET`, `POST`, etc. I also set up `COOKIE` and `TOKENS` to fetch CloudFlare cookies or the token which is featured in CloudScraper.<br />
`--data`: Request body. Mainly for `POST` requests.<br />
`--headers`: Request headers.<br />
After setting up the Python script, it's pretty easy to to set up a JS file that sends commands via `child_process`. For example, you could run:
```
python /path/to/index.py --url "https://google.com/" --method "GET"
```
So, all the JS file needs to execute the Python script is:
```js
const args:string[] = [join(__dirname, "index.py")];
args.push("--url", url);
args.push("--method", method);
...
```
That's pretty much the gist of this works.

## Contribution
I unfortunately am not familiar with TypeScript (and especially not Python) as much as I am with vanilla JS, so there are not a ton of features quite yet. However, since I'm learning I would be more than happy if you want to create PR requests, issues, or give suggestions. My Discord server is also [here](https://discord.gg/F87wYBtnkC) if you need to contact me.


## Basic Documentation
(If anyone wants to contribute to this please do)<br />
### Constructor
CFBypass has a basic constructor of a boolean denoting whether to use `python` or `python3` to run the `index.py` script. For example:
```js
const CF = require("./CF").default;
const cf = new CF(true);
```
This will cause the program to run `python3 index.py --arguments_here`. Similarily, setting the constructor to false (`const cf = new CF(false)`) or leaving it empty will cause the program to run `python index.py --arguments_here`. The only purpose for this is to allow support for all machines that might have different versions of Python. But then again, <b>this mainly depends on how you installed [cloudscraper](https://github.com/VeNoMouS/cloudscraper)</b>.

### Functions
Similar to [axios](https://www.npmjs.com/package/axios), [got](https://www.npmjs.com/package/got), and other request-based packages, CFBypass contains a lot of those functions. However, it's of course not as robust. CFBypass is limited to what [cloudscraper](https://github.com/VeNoMouS/cloudscraper) has, and by extension what the [requests](https://requests.readthedocs.io/en/latest/) library has. If you don't know, `cloudscraper` uses the `requests` package for sending HTTP requests. I did my best to read up on the documentation to add as many features as possible, but my knowledge in Python is unfortunately limited. Anyways, with all that being said, CFBypass has the basic `GET` and `POST` request that you can access via a `CF` object:
```js
const CF = require("./CF").default;
const cf = new CF();
cf.get("https://google.com/", { method: "GET" }); // Returns a Promise<Response>
```
The `GET` and `POST` functions have two required parameters: the `url` parameter and the `options` parameter. The `url` parameter takes a `string` and must be a URL. For example, `https://google.com/` or `https://github.com/`. The `options` parameter must be a JSON object and meet the `options` type requirements:
```typescript
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
    
    // THE FOLLOWING ARE UNSUPPORTED TEMPORARILY (someone please create a PR request lol)
    "PUT"?: string;
    "DELETE"?: string;
    "PATCH"?: string;
    "HEAD"?: string;
};
```
Finally, the functions all return a `Promise<Response>`. It features a `text()` function, `json()` function, and any errors in an array:
```typescript
interface Response {
    status: number;
    statusText: string;
    error: string[];
    text: ()=>string;
    json: ()=>string;
}
```
Here is an example for sending requests to an API:
```js
const CF = require('../CF').default;
const cf = new CF(true);

// Basic post request.
// You can use cf.request to send a raw request and provide the method, or you can just use cf.post to send a POST request.
// The post and get functions override the method provided. So yes, you could do cf.post("url", { method: "GET" }) and it'll send a POST request.
cf.request('https://myapi.com/utils/', { method: "POST", headers: { Referer: "https://mysite.com/" }, body: { "id": 5012 }}).then((res) => {
    // Logs the response text.
    console.log(res.text());
    // Or if you want to get JSON data, unlike node-fetch you can get both at the same time:
    const jsonData = res.json();
    const textData = res.text();
    console.log("Fetched JSON data:", jsonData);
    console.log("Oh and this is the text response:", textData);
}).catch((err) => {
    // Logs the error.
    console.error(err);
    // Response:
    //
    // status: 500,
    // statusText: "ERROR",
    // error: errors,
    // text: () => data,
    // json: () => JSON.parse(data)
    //
    // "errors" is an array of data like this:
    //  error: [
    //      {
    //          error: 'Traceback (most recent call last):   File "/Users/eltik/Documents/CloudScraper/src/index.py", line 24, in <module>'
    //      }
    //  ]
});
```

### Bypassing Captchas
From my knowledge, the `cloudscraper` library bypasses hCaptcha and stormwall. It unfortunately does not bypass 2captcha as there isn't much of a way currently do such a thing without a headless browser or buying captcha keys. If you get an error saying that the site cannot be bypassed because it is in, "Under Attack Mode" and you have to buy the paid version, the site most likely has a captcha that's not bypassable. If you absolutely need to bypass it, try [PupFlare](https://github.com/unixfox/pupflare). But again, there currently is no good way to bypass 2captcha without buying keys or using a headless browser like Puppeteer or Playwright.
