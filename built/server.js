"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const CloudFlare_1 = __importDefault(require("./CloudFlare"));
const express = require('express');
const app = express();
const port = process.env.port || 3061;
const cf = new CloudFlare_1.default();
cf.init().then(() => {
    app.get("/", (req, res) => {
        res.sendFile((0, path_1.join)(__dirname, "../test.html"));
    });
    app.get("/*", async (req, res) => {
        const request = await cf.request("https://www.justlightnovels.com" + req.url, { method: req.method });
        res.send(request.data);
    });
    app.listen(port, () => {
        console.log(`Test server started on port ${port}`);
    });
});
//# sourceMappingURL=server.js.map