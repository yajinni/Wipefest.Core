var path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  // Where we should start the dependency tree to work out what needs compiling
  entry: ['./lib/index.ts'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    sourceMapFilename: 'index.js.map',
    library: '@wipefest/core',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    // Means we don't have to specify extension when importing
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
    // Means we don't have to specify root directory when importing
    modules: ['node_modules', path.resolve(__dirname, 'lib')]
  },
  module: {
    rules: [
      {
        test: /\.ts|\.tsx$/,
        use: [
          { loader: 'babel-loader' }, // Ran second - compiles ES6 js to ES5 js using .babelrc
          { loader: 'ts-loader' } // Ran first - compiles ts to ES6 js using tsconfig.json
        ]
      }
    ]
  },
  externals: {
    axios: 'axios',
	rxjs: 'rxjs'
  }
};