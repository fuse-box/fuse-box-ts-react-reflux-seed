const gulp = require('gulp');
const runSequence = require('run-sequence');
const spawn = require('child_process').spawn;
const child_process = require('child_process');
const fsbx = require("fuse-box");
let node;
/**
 * ********************************************************
 * REACT UI build
 */
const devReactFolder = 'dist/client/development';

/**
 * Project dependencies
 * Later on FuseBox will be able to extract them automatically
 */
const REACT_DEPS = `
    +react 
    +react-dom 
    +reflux
`
    // Copy dev html
gulp.task("copy-ui-development-html", () => {
    gulp.src("src/client/index.html")
        .pipe(gulp.dest(devReactFolder))
});

gulp.task("run-react-ui", ['copy-ui-development-html'], () => {
    // bundle vendor
    fsbx.FuseBox.init({
        homeDir: "src/client",
        log: false,
        outFile: `${devReactFolder}/bundles/vendor.js`,
    }).bundle(REACT_DEPS);

    // Start dev Socket
    // Isolate dependencies
    fsbx.FuseBox.init({
        homeDir: "src/client",
        log: false,
        plugins: [
            fsbx.JSONPlugin(),
            fsbx.TypeScriptHelpers(),
            // sass
            [
                fsbx.SassPlugin({ outputStyle: 'compressed' }),
                fsbx.CSSResourcePlugin({ inline: true }),
                fsbx.CSSPlugin()
            ]
        ],
        outFile: `${devReactFolder}/bundles/app.js`,
    }).devServer(">[development.tsx] +process", { httpServer: false, port: 5678 });
});


/**
 * Making UI dist
 * ******************************************************************************
 */

gulp.task("dist-react-production", (done) => {
    fsbx.FuseBox.init({
        homeDir: "src/client",
        log: true,
        cache: false,
        globals: { default: "MySuperApplication" },
        plugins: [
            fsbx.EnvPlugin({ NODE_ENV: "production" }),
            fsbx.TypeScriptHelpers(),

            [
                fsbx.SassPlugin({ outputStyle: 'compressed' }),
                fsbx.CSSResourcePlugin({ inline: true }),
                fsbx.CSSPlugin()
            ],

            fsbx.UglifyJSPlugin()
        ],
        outFile: `dist/client/production/bundle.min.js`,
    }).bundle(">application.tsx", done);
});



/**
 * ********************************************************
 * Server build
 */
gulp.task("fuse-box-server", (done) => {
    fsbx.FuseBox.init({
        homeDir: "src/server",
        outFile: "dist/server/development/app.js",
    }).bundle(">[app.ts]", done);
});




gulp.task('server', function() {
    if (node) node.kill()

    node = spawn('node', ['dist/server/development/app.js'], {
        stdio: 'inherit'
    })
    node.on('close', function(code) {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
});

gulp.task('start', ['fuse-box-server'], function() {
    process.env.EMIT_TEST_EVENTS = true;
    runSequence(['server', 'run-react-ui'])
    gulp.watch(['src/server/**/*.ts'], () => {
        runSequence('fuse-box-server', 'server')
    });
});


gulp.task("dist", ['dist-react-production'], () => {

});