'use strict';

const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
const multipart = require('multer')();
const util = require('util');

module.exports = (env) => {

  let mode = 'production';

  const plugins = [
    new webpack.ProgressPlugin()
  ];
  
  if (process.env.NODE_ENV === 'dev') {
    mode = 'development';
  }

  return {
    mode,
    devServer: {
      server: 'http',
      client: {
        overlay: {
          errors: true,
          warnings: false,
        }
      },
      allowedHosts: 'auto',
      compress: true,
      host: 'localhost',
      port: 9000, 
      open: ['demo/index.html'],
      static: [{
        publicPath: '/demo',
        directory: path.join(__dirname, '/demo'),
        watch: true,
      },{
        publicPath: '/node_modules/@cm-code-monkeyz/cm-element/dist',
        directory: path.join(__dirname, '/node_modules/@cm-code-monkeyz/cm-element/dist'),
        watch: true,
      },{
        publicPath: '/node_modules/@cm-code-monkeyz/cm-cookie-helper/dist',
        directory: path.join(__dirname, '/node_modules/@cm-code-monkeyz/cm-cookie-helper/dist'),
        watch: true,
      }],
      devMiddleware: {
        index: true,
        publicPath: '/dist',
        serverSideRender: true,
        writeToDisk: true,
      },
      setupMiddlewares: (middlewares, devServer) => {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined');
        }

        devServer.app.post('/api/data', multipart.any(), function(req, res) {

          const filesNames = [];

          Array.from(req.files || []).forEach(file => {
            filesNames.push(file.originalname);
          });

          setTimeout(() => {
            if (req.body.error === 'true') {
              res.sendStatus(401);
            } else{
              res.header('Access-Control-Allow-Origin', '*');
              res.send(JSON.stringify({...req.body, ...{files: filesNames}}));
            }
          }, 1000);

        });

        return middlewares;
      }
    },
    optimization: {
      minimize: mode === 'production',
      minimizer: [new TerserPlugin({ extractComments: false })],
    },
    cache: true,
    context: path.resolve(__dirname, './src'),
    entry: {
      'wb-target-audience-content': [
        './target-audience-content.ts'
      ]
    },
    devtool: (mode !== 'production') ? 'inline-source-map' : false,
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: '[name]' + '.js',
      chunkFilename: '[chunkhash]' + '.js'
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader'
            },
            {
              loader: 'ts-loader'
            }
          ]
        },
        {
          test: /\.js(x?)$/,
          //exclude: /node_modules/,
          exclude: /@babel(?:\/|\\{1,2})runtime|core-js/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                configFile: path.resolve(__dirname, 'babel.config.js'),
                compact: false,
                cacheDirectory: true,
                sourceMaps: false,
              },
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'to-string-loader',
            },
            {
              loader: 'css-loader',
            },
            {
              loader: "postcss-loader",
            },
          ]
        }
      ]
    },
    plugins,
    externals: {
      'cm-element': 'CMElement',
      './cm-element': 'CMElement',
      '@cm-code-monkeyz/cm-element' : 'CMElement'
    },
    resolve: {
      extensions: ['.ts','.tsx','.js'],
    },
  }
};
