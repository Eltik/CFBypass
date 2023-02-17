# NOTICE
This package is deprecated and not developed anymore. This is meant only for bare-minimum tests and bypassing CloudFlare.
# CFBypass
Python based CloudFlare bypass. Utilizes [VeNoMouS's CloudScraper](https://github.com/VeNoMouS/cloudscraper) project to bypass CloudFlare. All credit goes to him.

## Installation
THIS NEEDS TO BE UPDATED<br />
<b>Prerequisites</b>: Python (version 3.10 or higher) and NodeJS (comes with NPM).<br /><br />
Installation is simple. Just run `pip install cloudscraper` or `pip3 install cloudscraper`. Then, run `npm i cfbypass`. Here is an example for using this package in your own project:
```javascript
// ES6
import CF from "cfbypass"

// CommonJS
const CF = require("cfbypass").default;

const cf = new CF(true); // Set to true if using python3, leave empty if using python
cf.request({
    url: "https://9anime.gs", options: {
        method: "GET"
    }
}).then((data) => {
    console.log(data.text());
}).catch((err) => {
    console.error(err);
})
```
If you encounter issues installing the Python package, try running `python3 -m pip uninstall cloudscraper` and then `python3 -m pip install cloudscraper`.