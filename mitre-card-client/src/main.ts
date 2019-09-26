import Vue from 'vue';
import App from './App.vue';
import router from './router';
import MainView from './components/MainView';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.config.productionTip = false;
Vue.use(BootstrapVue);

new Vue({
  router,
  render: (h) => h(MainView),
}).$mount('#app');


