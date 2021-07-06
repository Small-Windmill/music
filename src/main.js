// eslint-disable-next-line import/no-extraneous-dependencies
import 'babel-polyfill';
import fastclick from 'fastclick';
import Vue from 'vue';
import VueLazyLoad from 'vue-lazyload';
import App from './App.vue';
import router from './router';
import store from './store';
import './common/styles/base.scss';
import './common/styles/iconfont.css';

Vue.config.productionTip = false;
fastclick.attach(document.body);
fastclick.prototype.focus = function (targetElement) {
  let length;
  if (targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
    length = targetElement.value.length;
    targetElement.focus();
    targetElement.setSelectionRange(length, length);
  } else {
    targetElement.focus();
  }
};
Vue.use(VueLazyLoad, {
  loading: require('./common/image/default.png'),
});
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
