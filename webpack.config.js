module.exports = {
  context: __dirname + '/src',
  entry: {
    'plalib': './plalib',
    'plalib-worker': './plalib-worker',
  },
  output: {
      path: __dirname + '/dist',
      filename: '[name].js'
  },
  module: {
      loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
    ]
  }
};
