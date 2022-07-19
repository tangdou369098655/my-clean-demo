// 如果有額外的.babelrc配置的話就可以使用這段代碼1
// module.exports = {
//   module: {
//     rules: [
//       {
//         test:/\.jsx?$/,
//         use: ['babel-loader'],
//         exclude:/node_modules/  //排除 node_modules目錄
//       }
//     ]
//   }
// }
// 如果有額外的.babelrc配置的話就可以使用這段代碼2
// 在webpack中配置 babel，如果沒有額外的.babelrc配置的話就可以使用這段代碼1
//webpack.config.js
// 首先引入插件1
// 导入terser-webpack-plugin-->减少js体积(其中删除js的console.log和注释)
const TerserWebpackPlugin = require('terser-webpack-plugin')
// 实例化TerserWebpackPlugin对象
const terserPlugin = new TerserWebpackPlugin({
  parallel: 4,
  extractComments: true,
  terserOptions: {
    compress: {
      warnings: false,
      drop_console: true,
      drop_debugger: true,
      pure_funcs: ['console.log'], //移除console
    },
  },
})
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const isDev = process.env.NODE_ENV.trim() === 'development' //html-webpack-plugin 的 config 的妙用4-1
const { CleanWebpackPlugin } = require('clean-webpack-plugin') //清理dist目錄的插件
const path = require('path') //設置出口使用
const config = require('./public/config')[isDev ? 'dev' : 'build'] //html-webpack-plugin 的 config 的妙用4-2
module.exports = {
  entry: './src/index.js', //webpack的默認配置，也可以寫一個數組
  output: {
    path: path.resolve(__dirname, 'dist'), //必須是絕對路徑
    // filename: 'bundle.js',
    // filename: 'bundle.[hash].js',
    filename: 'bundle.[hash:6].js', //考虑到CDN缓存的问题，我们一般会给文件名加上 hash
    publicPath: config.template.publicPath
  },
  mode: isDev ? 'development' : 'production', //html-webpack-plugin 的 config 的妙用4-3
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                '@babel/plugin-transform-runtime',
                {
                  corejs: 3,
                },
              ],
            ],
          },
        },
        exclude: /node_modules|jsm|models/,
      },
      {
        //看清楚啦  這裡有四個loaderloader 的执行顺序是从右向左执行的，也就是后面的 loader 先执行，上面 loader 的执行顺序为: less-loader ---> postcss-loader ---> css-loader ---> style-loader
        test: /\.(le|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('autoprefixer')({
                    overrideBrowserslist: ['>0.25%', 'not dead'],
                  }),
                ]
              },
            },
          },
          'less-loader',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|gltf|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader',
            // options: {
            //     limit: 10240, //10K
            //     esModule: false
            // }
            // ,
            // 使用上面的那一段運行後會把圖片名字改為MD5哈希值，使用下面的會保留原有名稱加上六位哈希值
            options: {
              limit: 10240, //10K
              esModule: false,
              name: '[name]_[hash:0].[ext]',
              outputPath: config.template.assetsPath, //這個可以將打包後的資源放到指定的文件夾下
              // outputPath: 'assets', //這個可以將打包後的資源放到指定的文件夾下
            },
          },
        ],
        exclude: /node_modules/,
      },
      // {
      //   test: /\.html$/,
      //   use: 'html-withimg-loader'
      // },
    ],
  },
  // resolve: {  // 本想用这个代码来实现JS引入assets资源为相对路径，但是一直报错
  //   alias: {
  //     '@': resolve('src')
  //   }
  // },
  optimization: {
    minimizer: [
      // 只有打包环境为production时才能生效
      terserPlugin,
    ],
  },
  plugins: [
    // 數組，放著所有的webpack插件
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      config: config.template, //html-webpack-plugin 的 config 的妙用4-4
      minify: {
        removeAttributeQuotes: false, //是否刪除屬性的雙引號
        collapseWhitespace: false, //是否折疊空白
      },
      hash: true, //是否加上hash,默認是false
    }),
    new CleanWebpackPlugin(), //清理dist目錄插件，不需要傳參數，它自己可以找到outPath
    // new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns:['**/*','!dll','!dll/**']}) //如果你有需要不刪除dll目錄下的文件的話可以這樣子寫
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/'+ config.template.assetsPath,
          to: config.template.assetsPath,
        },
      ],
    }),
  ],
  devServer: {
    port: '8080', //默認是8080
    quiet: false, //默認不啟動
    inline: true, // 默認開啟inline 模式，如果設置為false, 開啟 iframe模式
    stats: 'errors-only', //終端僅僅打印 error
    overlay: false, //默認不啟用
    clientLogLevel: 'silent', //日誌等級
    compress: true, //是否啟用gzip壓縮
  },
  // devtool: 'cheap-module-eval-source-map', //开发环境下使用 打包上线之前要改一下这个哦TODU-LIST
}

// 在webpack中配置 babel，如果沒有額外的.babelrc配置的話就可以使用這段代碼2
