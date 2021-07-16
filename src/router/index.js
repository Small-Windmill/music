import Vue from 'vue';
import VueRouter from 'vue-router';
import Recommend from '../components/recommend/recommend';
import Search from '../components/search/search';
import Singer from '../components/singer/singer';
import Rank from '../components/rank/rank';
import SingerDetail from '../components/singer-detail/singer-detail';
import Disc from '../components/disc/disc.vue';
import TopList from '../components/top-list/top-list.vue';
import UserCenter from '../components/user-center/user-center.vue';

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
    children: [{
      path: ':id',
      component: Disc,
    }],
  }, {
    path: '/search',
    name: 'Search',
    component: Search,
  }, {
    path: '/singer',
    name: 'Singer',
    component: Singer,
    children: [{
      path: ':id',
      component: SingerDetail,
    }],
  }, {
    path: '/rank',
    name: 'Rank',
    component: Rank,
    children: [{
      path: ':id',
      component: TopList,
    }],
  },
  {
    path: '/user',
    name: 'User',
    component: UserCenter,
  },
];

const router = new VueRouter({
  mode: 'hash',
  routes,
});
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
export default router;
