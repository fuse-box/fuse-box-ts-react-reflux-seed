import * as express from "express";
import * as path from "path";
import * as fs from "fs";

const app = express();

const productionDir = "./dist/client/production";
const developmentDir = "./dist/client/development";

try {
    const statics = path.resolve(productionDir);
    fs.statSync(`${statics}/index.html`);
    console.log("Serving static build from: " + statics);
    console.log("Run `gulp clean` to return to development mode");
    app.use("/", express.static(statics));

    // app.get('*', function (req: any, res: any) {
    //   res.sendFile(path.join(__dirname, '../../dist/index.html'));
    // });
} catch (e) {
    // create dashboard
    const statics = path.resolve(developmentDir);
    app.use("/", express.static(statics));
    console.log("Serving statics from: " + statics);
    console.log("Serving development build with fuse-box middleware");
    console.log("Run `gulp dist` to create a production build");
}

app.listen(3000, function () {
    console.log("Example app listening on port 3000!");
});
