var CF = require('../src/CF').default;
// If your machine uses python3, input "true" in the constructor.
// By default CF uses python.
var cf = new CF(true);
// Basic get request.
cf.get('https://www.wcofun.net/dubbed-anime-list', { method: "GET" }).then(function (res) {
    // Logs the response text.
    console.log(res.text());
}).catch(function (err) {
    // Logs the error.
    console.error(err);
});
// Basic post request.
// Python hates it if you put the body in single quotes like this: { 'id': 5023 }
// So make sure you use double quotes instead: { "id": 5023 }
cf.post('https://myapi.com/utils', { method: "POST", body: { "id": 5023 } }).then(function (res) {
    // Logs the response as a JSON.
    console.log(res.json());
});
// Fetch cookies from CloudFlare protected sites. This feature is slightly buggy.
// You can also add headers to the request.
cf.cookie('https://www.wcofun.net/dubbed-anime-list', { method: "GET", headers: { "Referer": "https://www.wcofun.net/" } }).then(function (res) {
    // Logs the response text.
    console.log(res.text());
});
// Fetch tokens from CloudFlare protected sites. This feature is also slightly buggy.
cf.tokens('https://www.wcofun.net/dubbed-anime-list', { method: "GET" }).then(function (res) {
    // Logs the response text.
    console.log(res.text());
});
//# sourceMappingURL=example.js.map