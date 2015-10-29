module.exports = [
  {
    context: __dirname + '/src',
    entry: './plalib',
    output: {
        library: 'Plalib',
        libraryTarget: 'umd',
        path: __dirname + '/dist',
        filename: 'plalib.js'
    },
    module: {
        loaders: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
      ]
    }
  },
  {
    context: __dirname + '/src',
    entry: './plalib-worker',
    output: {
        path: __dirname + '/dist',
        filename: 'plalib-worker.js'
    },
    module: {
        loaders: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
      ]
    }
  }
];
