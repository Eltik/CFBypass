# CFBypass
Python based CloudFlare bypass. Utilizes [VeNoMouS's CloudScraper](https://github.com/VeNoMouS/cloudscraper) project to bypass CloudFlare. All credit goes to him.

### Installation
Run `pip install cloudscraper` or clone VeNoMouS's [repository](https://github.com/VeNoMouS/cloudscraper). All this project does is "port" his Python code and make it JavaScript friendly.

### How it Works
All I've done is run `child_process` to send `GET` and `POST` requests via the Python library `cloudscraper`. I set up an `index.py` script that uses the library and takes the following arguments:<br />
`--url`\*: The URL to send a request to.<br />
`--method`\*: The method to use. For example, `GET`, `POST`, etc. I also set up `COOKIE` and `TOKENS` to fetch CloudFlare cookies or the token which is featured in CloudScraper.<br />
`--data`: Request body. Mainly for `POST` requests.<br />
`--headers`: Request headers.<br />
After setting up the Python script, it's pretty easy to to set up a JS file that sends commands via `child_process`. For example, I could run:
```
python index.py --url "https://google.com/" --method "GET"
```
So, all the JS file needs is:
```js
const args:string[] = [join(__dirname, "index.py")];
args.push("--url", url);
args.push("--method", method);
...
```
That's pretty much the gist of how this repo works.

### Contribution
I unfortunately am not familiar with TypeScript as much as I am with vanilla JS so an NPM package has not been setup yet. However, since I'm learning I would be more than happy if you want to setup a package or create PR requests. My Discord is also [here](https://discord.gg/F87wYBtnkC) if you need to contact me.
