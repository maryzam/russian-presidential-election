 var path = require('path');
 var webpack = require('webpack');
 module.exports = {
     entry: './src/app.js',
     output: {
         path: path.resolve(__dirname, 'dist'),
         filename: 'app.js'
     },
    devServer: {
        inline: true,
        contentBase: './dist',
        port: 3000
    },
     module: {
         rules: [
             {
                 test: /\.js$/,                 
                 exclude: /(node_modules)/,
                 use: 'babel-loader'
             }
         ]
     }
 };