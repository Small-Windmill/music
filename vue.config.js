module.exports = {
  devServer: {
    hot: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3200',
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
