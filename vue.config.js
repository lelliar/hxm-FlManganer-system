const { resolve } = require('path')
module.exports = {
  devServer: {
    host: '192.168.0.33',
    port: '8082',
    overlay: {
      warnings: false,
      errors: true
    },
    // 网关代理
    proxy: {
      '/proxy/dev': {
        target: 'http://192.168.0.99:8080',
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/proxy/dev': ''
        }
      }
    }
  },
  lintOnSave: process.env.NODE_ENV == 'production' ? false : 'warning',
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "./src/theme/baseColor.scss"'
      }
    }
  },
  configureWebpack: (config) => {
    config.devtool = 'source-map'
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = '发料系统'
      args[0].favicon = './public/favicon.ico'
      return args
    })
    config.resolve.alias
      .set('@img', resolve('src/assets/img'))
      .set('@unt', resolve('src/untils/'))
      .set('@com', resolve('src/components/'))
      .set('@sev', resolve('src/service/'))
  }
}
