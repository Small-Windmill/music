import Vue from 'vue';
import VueRouter from 'vue-router';
import Recommend from '../components/recommend/recommend';
import Search from '../components/search/search';
import Singer from '../components/singer/singer';
import Rank from '../components/rank/rank';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/recommend',
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: Recommend,
  }, {
    path: '/search',
    name: 'Search',
    component: Search,
  }, {
    path: '/singer',
    name: 'Singer',
    component: Singer,
  }, {
    path: '/rank',
    name: 'Rank',
    component: Rank,

  },

];

const router = new VueRouter({
  routes,
});

export default router;
