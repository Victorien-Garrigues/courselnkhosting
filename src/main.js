import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import VueScrollTo from 'vue-scrollto';
import VueLazyLoad from 'vue-lazyload';

Vue.use(require('vue-moment'));
Vue.config.productionTip = false;
Vue.use(Buefy);
Vue.use(VueLazyLoad);
Vue.use(VueScrollTo, {
  container: '.postContainer',
  duration: 500,
  easing: 'ease',
  offset: 0,
  force: true,
  cancelable: true,
  onStart: false,
  onDone: false,
  onCancel: false,
  x: false,
  y: true,
});
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
