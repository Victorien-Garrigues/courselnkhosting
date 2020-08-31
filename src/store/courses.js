import db from '@/db';
// import firebase from '@/firebase';
import { firestoreAction } from 'vuexfire';
// import store from '@/store';

// const mutations = {
//   //sets courses
//   setCourses(state, courses) {
//     state.courses = courses;
//   },
// };

const state = {
  // courses: [], //The users courses
  allCourses: [], //All courses from the users school
};

const actions = {
  //   async initCourses() {
  //     await db
  //       .collection('users')
  //       .doc(firebase.auth().currentUser.uid)
  //       .get()
  //       .then((doc) => {
  //         store.commit('courses/setCourses', doc.data().courses);
  //       });
  //   },
  //Binds the 'allCourses' state with all the course from the users school
  initAllCourses: firestoreAction(({ bindFirestoreRef }, school_id) => {
    bindFirestoreRef(
      'allCourses',
      db
        .collection('courses')
        .where('school_id', '==', school_id)
        .orderBy('courseCode')
    );
  }),
};

export default {
  namespaced: true,
  state,
  actions,
  // mutations,
};
