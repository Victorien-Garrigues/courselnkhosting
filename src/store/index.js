import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations } from 'vuexfire';
import courses from './courses';
import messageBoard from './messageBoard';
import faculties from './faculties';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  mutations: vuexfireMutations,
  modules: {
    courses,
    messageBoard,
    faculties,
  },
  plugins: [createPersistedState()],
});
