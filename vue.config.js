module.exports = {
  runtimeCompiler: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/common/styles/variable.scss";
        @import "~@/common/styles/mixin.scss";`,

      },
    },
  },
};
