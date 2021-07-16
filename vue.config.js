module.exports = {
  publicPath: './',
  // 放置静态资源目录
  assetsDir: 'static',
  devServer: {
    hot: true,
    proxy: '',
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
