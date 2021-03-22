const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env, options) => {
    const prodMode = options.mode === "production";
    console.log(options.mode);
    return {
        entry: {
            index: ["./src/script.js"],
        },
        devServer: { contentBase: "./build" },
        plugins: [
            new CleanWebpackPlugin(),
            new CopyPlugin({
                patterns: ["src/prepareData"],
            }),
            new HtmlWebpackPlugin({
                filename: "index.html",
                template: "src/index.html",
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: "babel-loader",
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: [".js"],
        },
        output: {
            filename: "script.js",
            path: path.resolve(__dirname, "build"),
        },
    };
};
