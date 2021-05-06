<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from './components/m-header/m-header';
import Player from './components/player/player';
import Tab from './components/tab/tab';

export default {
  components: {
    MHeader,
    Tab,
    Player,
  },
};
Player;

</script>
<style lang="scss" >
* {
  margin: 0;
  padding: 0;
  list-style: none;
  touch-action: none;
}
</style>
