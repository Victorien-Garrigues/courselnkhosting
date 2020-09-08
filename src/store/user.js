import firebase from '@/firebase';
import db from '@/db';
import store from '@/store';

const state = {
  user: {},
};

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log('yo');
    db.collection('users')
      .doc(user.uid)
      .get()
      .then((doc) => {
        const data = doc.data();
        data.id = user.uid;
        store.commit('user/setUser', data);
      });
  } else {
    store.commit('user/setUser', null);
  }
});

const mutations = {
  setUser(state, user) {
    if (user) {
      state.user = user;
    } else {
      state.user = {};
    }
  },

  setCourses(state, courses) {
    state.user.courses = courses;
  },

  setFaculties(state, faculties) {
    state.user.faculties = faculties;
  },
};

const actions = {
  async logout() {
    await firebase.auth().signOut();
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
