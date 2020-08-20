import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations } from 'vuexfire';
import courses from './courses';
import messageBoard from './messageBoard';
import users from './users';

Vue.use(Vuex);

export default new Vuex.Store({
  mutations: vuexfireMutations,
  modules: {
    courses,
    messageBoard,
    users,
  },
});
