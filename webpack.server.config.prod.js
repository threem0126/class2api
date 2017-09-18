// jscs:disable
var webpack = require("webpack");
var fs =  require("fs");
var path = require("path");

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
        index: ["./lib/class2api.js"]
    },
    output: {
        path: __dirname + "/build",
        filename: "class2api.out.js"
    },
    externals: getExternals(),
    node: {
        __filename: false,
        __dirname: false
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.IgnorePlugin(/(\.(css|less|scss|p12|ejs|ico|gif|svg|png|jpe?g)$)|(static)/),
        new webpack.DefinePlugin({
            "process.env.__ISCOMPILING__": true,
            "process.env.NODE_ENV": '"production"'
        })
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ["babel-loader"],
            include: path.join(__dirname, "lib")
        },{
            test: /\.(png|jpg)$/,
            loader: "url?limit=25000!img?progressive=true"
        }, {
            test: /\.json$/,
            loader: "json-loader"
        }]
    }
};