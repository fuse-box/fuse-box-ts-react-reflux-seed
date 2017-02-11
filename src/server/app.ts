import * as express from "express";
import * as path from 'path';
const appRoot = require("app-root-path");

const app = express()

app.use("/",
    express.static(path.join(appRoot.path, "/dist/client/development")));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})