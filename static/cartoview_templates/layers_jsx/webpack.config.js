var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'src');

const LayersComponent = APP_DIR + '/components/Layers/LayersComponent.jsx'
const MapsComponent = APP_DIR + '/components/Maps/MapsComponent.jsx'

var config = {
  entry: {
    LayersComponent,
    MapsComponent,
  },

  output: {
    path: BUILD_DIR,
    // asper documentation [name].js will compile multiple enty points to
    // their name.js
    //  main.jsx => main.js
    filename: '[name].js'
  },

  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel-loader'
      },
      {
        test: /\.css$/,
        loader: ['css-loader',]
        // loader: ['css-loader', 'style-loader']
        // loader: ['to-string-loader', 'css-loader']

      },
    ],

  },
};

module.exports = config;
