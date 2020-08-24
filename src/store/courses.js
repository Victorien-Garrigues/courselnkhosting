import db from '@/db';
import firebase from '@/firebase';

const state = {
  courses: [],
};

const actions = {
  async initCourses({ state }) {
    await db
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((doc) => {
        state.courses = doc.data().courses;
      });
  },
};

export default {
  namespaced: true,
  state,
  actions,
};
