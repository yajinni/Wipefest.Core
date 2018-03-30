var webpackConfig = require("./webpack.config.js");

module.exports = function (config) {
    config.set({
        // Find all files that match this glob
        files: [
            "**/*.spec.ts"
        ],
        // Before running any tests, run them through webpack
        preprocessors: {
            '**/*.spec.ts': ["webpack"]
        },
        // Use the following webpack configuration (pulled from webpack.config.js)
        // webpack.entry will be set to the file currently being preprocessed
        webpack: {
            mode: webpackConfig.mode,
            devtool: webpackConfig.devtool,
            resolve: webpackConfig.resolve,
            module: webpackConfig.module
        },
        // Allows karma to read ts files
        mime: {
            'text/x-typescript': ["ts", "tsx"]
        },
        
        browsers: ["Chrome"],
        reporters: ["progress", "kjhtml"],
        coverageIstanbulReporter: {
            reports: ["html", "lcovonly"],
            fixWebpackSourcePaths: true
        },
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },

        basePath: "",
        frameworks: ["jasmine"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        singleRun: false,
        concurrency: Infinity
    });
}