module.exports = {
  context: __dirname + "/src",
  entry: "./index",
  output: {
    path: __dirname + "/web-notebook",
    filename: "index.js",
    libraryTarget: 'amd'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['react', 'es2015']
        }
      }
    ],
  }
};
