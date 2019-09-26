import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import NamesView from './views/NamesView';
import MainView from './components/MainView';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainView,
    },
    {
      path: '/names',
      name: 'names',
      component: NamesView,
    },
    {
      path: '/stats',
      name: 'stats',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});
