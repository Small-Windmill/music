// eslint-disable-next-line import/no-extraneous-dependencies
import 'babel-polyfill';
import fastclick from 'fastclick';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './common/styles/base.scss';
import './common/styles/iconfont.css';

Vue.config.productionTip = false;
fastclick.attach(document.body);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
