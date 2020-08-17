import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Buefy from 'buefy';
import VueChatScroll from 'vue-chat-scroll';
import 'buefy/dist/buefy.css';

Vue.config.productionTip = false;
Vue.use(VueChatScroll);
Vue.use(Buefy);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
