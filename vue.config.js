module.exports = {
  // publicPath: './',
  // // 放置静态资源目录
  // assetsDir: 'static',
  // devServer: {
  //   hot: true,
  //   proxy: '',
  // },
  publicPath: './',
  devServer: {
    hot: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
  runtimeCompiler: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/common/styles/variable.scss";
        @import "~@/common/styles/mixin.scss";
        `,

      },
    },
  },
};
