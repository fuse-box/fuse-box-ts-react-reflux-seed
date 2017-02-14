const gulp = require('gulp');
const runSequence = require('run-sequence');
const spawn = require('child_process').spawn;
const child_process = require('child_process');
const fsbx = require("fuse-box");
const hash_src = require("gulp-hash-src");
const htmlmin = require("gulp-htmlmin");
const clean = require('gulp-clean');

let node;
/**
 * ********************************************************
 * REACT UI build
 */
const devReactFolder = 'dist/client/development';
const prodReactFolder = 'dist/client/production';

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

const ReactDevelopment = (opts) => {

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
    }).devServer(">[development.tsx] +process", opts);
}

gulp.task("run-react-ui", ['copy-ui-development-html'], () => {
    ReactDevelopment({ httpServer: false, port: 5678 })
});


/**
 * Making UI dist
 * ******************************************************************************
 */

gulp.task("dist-react-production", (done) => {
    fsbx.FuseBox.init({
        homeDir: "src/client",
        log: false,
        outFile: `${prodReactFolder}/bundles/vendor.js`,
        plugins: [
            fsbx.UglifyJSPlugin()
        ]
    }).bundle(REACT_DEPS);

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
        outFile: `${prodReactFolder}/bundles/app.js`,
    }).bundle(">application.tsx", done);
});

gulp.task("hash", function() {
    console.log(prodReactFolder)

    gulp.src("src/client/index.html")
        .pipe(gulp.dest(prodReactFolder))
        .pipe(htmlmin())
        .pipe(hash_src({verbose: true, build_dir: `./${prodReactFolder}`, src_path: `./${prodReactFolder}`}))
        .pipe(gulp.dest(`./${prodReactFolder}`))
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

    runSequence(['server', 'run-react-ui'])
    gulp.watch(['src/server/**/*.ts'], () => {
        runSequence('fuse-box-server', 'server')
    });
});

gulp.task('clean', function () {
    return gulp.src(prodReactFolder, {read: false})
        .pipe(clean());
});

gulp.task('dev', ['copy-ui-development-html'], function() {
    return ReactDevelopment({ root: "dist/client/development", port: 3000 });
});


gulp.task("dist", () => {
    runSequence('dist-react-production', 'hash')
});