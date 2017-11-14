// jscs:disable
var webpack = require("webpack");
var fs =  require("fs");
var path = require("path");
var CopyWebpackPlugin = require("copy-webpack-plugin");

function getExternals() {
  const nodeModules = fs.readdirSync(path.resolve(__dirname, "node_modules"));
  return nodeModules.reduce(function (ext, mod) {
    ext[mod] = "commonjs " + mod;
    return ext;
  }, {});
}

module.exports = {
    target: "node",
    entry: {
        index: ["./demo-src/server.js"]
    },
    output: {
        path: __dirname + "/build/server",
        filename: "[name].js"
    },
    resolve: {
        modules: [
            path.resolve('./demo-src'),
            path.resolve('./node_modules')
        ]
    },
    externals: getExternals(),
    node: {
        __filename: true,
        __dirname: true
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.IgnorePlugin(/(\.(css|less|scss|p12|ejs|ico|gif|svg|png|jpe?g)$)|(static)/),
        new webpack.DefinePlugin({
            "process.env.__ISCOMPILING__": true,
            "process.env.NODE_ENV": '"production"'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {warnings: false}
        }),
        new CopyWebpackPlugin([ ])
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ["babel-loader"],
            include: path.join(__dirname, "src")
        },{
            test: /\.(png|jpg)$/,
            loader: "url?limit=25000!img?progressive=true"
        }, {
            test: /\.json$/,
            loader: "json-loader"
        }]
    }
};