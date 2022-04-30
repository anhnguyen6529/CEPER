module.exports = {
    mode: 'development',
    entry: './src/index.js', // file jsx của entry point 
    output: {
      filename: 'bundle.js' // file sẽ xuất ra
    },
    module: {
      loaders: [{
        test: /\.js?$/, // đuôi mở rộng là js
        exclude: /node_modules/, // loại trừ bên dưới thư mục node_modules
        loader: 'babel-loader', // sử dụng babel-loader 
      }]
    },
    resolve: {
      modules: ['src', 'node_modules'], // folder đối tượng
      extensions: ['.js', '.json'] // file đối tượng
    },
  }