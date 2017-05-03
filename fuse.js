const { FuseBox, HTMLPlugin, SassPlugin, CSSPlugin, WebIndexPlugin } = require("fuse-box");

const fuse = FuseBox.init({
    homeDir: "src",
    output: "dist/$name.js",
    plugins: [
        [SassPlugin(), CSSPlugin()],
        WebIndexPlugin({
            template: "src/client/index.html",
            title: "React + Reflux example",
            target: "client/index.html",
            bundles: ["client/app", "client/vendor"]
        })
    ]
});

fuse.dev({ port: 4445, httpServer: false });

fuse.bundle("server/bundle")
    .watch("server/**") // watch only server related code.. bugs up atm
    .instructions(" > [server/app.ts]")
    // Execute process right after bundling is completed
    // launch and restart express
    .completed(proc => proc.start())

fuse.bundle("client/vendor")
    .hmr()
    .instructions("~ client/application.tsx");

fuse.bundle("client/app")
    .watch("client/**")
    .hmr()
    .instructions(" !> [client/development.tsx]");

fuse.run();