import Vue from 'vue';
import Vuex from 'vuex';
// Vuex 内置日志插件用于一般的调试
import createLogger from 'vuex/dist/logger';
import * as actions from './actions';
import * as getters from './getters';
import mutations from './mutations';
import state from './state';

Vue.use(Vuex);
// 只在开发环境时启动严格模式
const debug = process.env.NODE_ENV !== 'production';
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});
