<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Cat Music</h1>
    <router-link tag="div" class="mine" to="/user">
      <i class="iconfont music-icon">&#xe66d;</i>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'm-header',
};

</script>
<style scoped lang="scss">
  .m-header {
    position: relative;
    height: 44px;
    text-align: center;
    color: $color-theme;
    font-size: 0;

    .icon {
      display: inline-block;
      vertical-align: top;
      margin-top: 6px;
      width: 30px;
      height: 32px;
      margin-right: 9px;

      @include bg-image('logo');

      background-size: 30px 32px;
    }

    .text {
      display: inline-block;
      vertical-align: top;
      line-height: 44px;
      font-size: $font-size-large;
    }

    .mine {
      position: absolute;
      top: 0;
      right: 0;

      .music-icon {
        display: block;
        padding: 12px;
        font-size: 24px;
        color: $color-theme;
      }
    }
  }
</style>
