import * as express from "express";
import * as path from "path";
import * as fs from "fs";

const app = express();

const productionDir = "./dist/client/production";
const developmentDir = "./dist/client/development";


const statics = path.resolve("dist/client");
fs.statSync(`${statics}/index.html`);
console.log("Serving static build from: " + statics);
app.use("/", express.static(statics));

// app.get('*', function (req: any, res: any) {
//   res.sendFile(path.join(__dirname, '../../dist/index.html'));
// });


app.listen(3000, function () {
    console.log("Example app listening on port 3000!");
});
