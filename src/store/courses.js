import db from '@/db';
import firebase from '@/firebase';
import { firestoreAction } from 'vuexfire';

const state = {
  courses: [], //The users courses
  allCourses: [], //All courses from the users school
};

const actions = {
  //Gets all courses from the db and sets the 'courses' state with those courses
  async initCourses({ state }) {
    await db
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((doc) => {
        state.courses = doc.data().courses;
      });
  },

  //Binds the 'allCourses' state with all the course from the users school
  initAllCourses: firestoreAction(({ bindFirestoreRef, state }, school_id) => {
    bindFirestoreRef(
      console.log('cool'),
      'allCourses',
      db
        .collection('courses')
        .where('school_id', '==', school_id)
        .orderBy('courseCode'),
      console.log(state.allCourses)
    );
  }),
};

export default {
  namespaced: true,
  state,
  actions,
};
