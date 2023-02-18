import { join } from "path";
import axios from "axios";
import CloudFlare from "./CloudFlare";

const express = require('express');
const app = express();
const port = process.env.port || 3061;

const cf = new CloudFlare();
cf.init().then(() => {
    app.get("/", (req, res) => {
        res.sendFile(join(__dirname, "../test.html"));
    });

    app.get("/*", async (req, res) => {
        const request = await cf.request("https://www.justlightnovels.com" + req.url, { method: req.method });
        res.send(request.data);
    })

    app.listen(port, () => {
        console.log(`Test server started on port ${port}`)
    });
})