import db from '@/db';
import { firestoreAction } from 'vuexfire';

const state = {
  allCourses: [], //All courses from the users school
};

const actions = {
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
};
